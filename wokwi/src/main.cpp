// Fleet Force - kit embarcado (prototipo SIMULADO no Wokwi), Sprint 1
//
// Duas variaveis, decisao do grupo em 12/10:
//   1. Acelerometro MPU6050 (I2C) -> mede ACELERACAO (quanto a velocidade muda de uma vez):
//      frenagem e arrancada bruscas = motorista que "pisa" e gasta diesel a mais
//   2. GPS NEO-6M (Serial2, NMEA) -> velocidade, km rodado e posicao
// Botao = fio de ignicao (motor ligado/desligado), como nos rastreadores de frota.
//
// Eventos (cada um vira uma linha CSV):
//   ocioso             -> ignicao ligada e GPS parado (< VEL_PARADO_KMH) por LIMITE_OCIOSO_MIN ou mais
//   frenagem_brusca    -> aceleracao longitudinal <= LIMIAR_FRENAGEM_G com o caminhao andando
//   arrancada_brusca   -> aceleracao longitudinal >= LIMIAR_ARRANCADA_G
//   excesso_velocidade -> acima de LIMITE_VELOCIDADE_KMH por 1 min ou mais
//   normal             -> telemetria a cada TELEMETRIA_A_CADA_MIN (posicao, velocidade, km)
// A cada hora simulada sai um comentario "#" com o indicador de conducao:
// eventos bruscos por 100 km (quanto maior, mais o motorista pisa e freia forte).
//
// GPS: o Wokwi nao tem modulo GPS. Com GPS_SIMULADO = true, o proprio firmware
// gera sentencas NMEA ($GPRMC) de uma rota Campinas -> Sao Paulo, com a velocidade
// do potenciometro, e as le com a TinyGPSPlus, a mesma biblioteca usada com o NEO-6M.
// Na bancada (Sprint 2): GPS_SIMULADO = false e o NEO-6M ligado em RX2/TX2 (GPIO16/17).
//
// Saida: CSV no Serial, mesmo formato de prototipo/dados/eventos_iot_simulado.csv.
// Tempo acelerado: 1 s real = 1 min simulado.

#include <Arduino.h>
#include <Wire.h>
#include <TinyGPSPlus.h>
#include <math.h>

// ---------- pinos ----------
const int PIN_POT_VELOCIDADE = 34;   // so no modo simulado: velocidade que o GPS vai reportar
const int PIN_IGNICAO = 15;
const int PIN_LED_OCIOSO = 2;        // amarelo
const int PIN_LED_BRUSCA = 4;        // vermelho
const int PIN_LED_VELOCIDADE = 19;   // azul
const int PIN_GPS_RX = 16;           // NEO-6M TX -> ESP32 RX2
const int PIN_GPS_TX = 17;           // NEO-6M RX <- ESP32 TX2
const uint8_t MPU_ADDR = 0x68;

// ---------- configuracao ----------
const bool GPS_SIMULADO = true;
const char *PLACA = "DEM0A00";
const float VEL_MAX_POT_KMH = 120.0;
const float VEL_PARADO_KMH = 2.0;
const unsigned long LIMITE_OCIOSO_MIN = 5;
const float LIMIAR_FRENAGEM_G = -0.40;   // mesmo limiar do gerador do caso demo
const float LIMIAR_ARRANCADA_G = 0.30;
const float LIMITE_VELOCIDADE_KMH = 90.0; // caminhao em rodovia (CTB, art. 61)
const unsigned long TELEMETRIA_A_CADA_MIN = 10;
const unsigned long INDICADOR_A_CADA_MIN = 60;
const unsigned long MS_POR_MIN_SIMULADO = 1000;
const float RUMO_GRAUS = 150.0;           // Campinas -> Sao Paulo, aproximado

TinyGPSPlus gps;

// ---------- estado ----------
bool ignicao = false;
bool botaoAnterior = HIGH;
double latSim = -22.905, lonSim = -47.061;   // ponto de partida da rota simulada (Campinas)
double kmTotal = 0, kmUltimoIndicador = 0;
unsigned long ultimoMs = 0;
bool emParadoLigado = false;
unsigned long inicioParadoMin = 0;
bool emExcesso = false;
unsigned long inicioExcessoMin = 0;
bool armadoFrenagem = true, armadoArrancada = true;
unsigned long eventosBruscos = 0, eventosBruscosUltimoIndicador = 0;
unsigned long ledBruscaAteMs = 0;
unsigned long ultimaTelemetriaMin = 0, ultimoIndicadorMin = 0;

unsigned long minutoSimulado() { return millis() / MS_POR_MIN_SIMULADO; }

// ---------- acelerometro (registradores do MPU6050, sem biblioteca) ----------
void iniciarMpu() {
  Wire.begin(21, 22);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);  // PWR_MGMT_1: acorda o sensor
  Wire.write(0);
  Wire.endTransmission();
}

// Aceleracao no eixo X (longitudinal do caminhao), em g, faixa de +-2 g
float lerAceleracaoLongitudinalG() {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);  // ACCEL_XOUT_H
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, (uint8_t)2);
  if (Wire.available() < 2) return 0;
  int16_t bruto = (Wire.read() << 8) | Wire.read();
  return bruto / 16384.0;
}

// ---------- GPS simulado: gera NMEA e entrega para a TinyGPSPlus ----------
void entregarNmea(const char *corpo) {
  uint8_t cs = 0;
  for (const char *c = corpo; *c; c++) cs ^= *c;
  char linha[120];
  snprintf(linha, sizeof(linha), "$%s*%02X\r\n", corpo, cs);
  for (const char *c = linha; *c; c++) gps.encode(*c);
}

void coordNmea(double graus, bool ehLat, char *saida, size_t n, char &hemisferio) {
  double a = fabs(graus);
  int g = (int)a;
  double minutos = (a - g) * 60.0;
  hemisferio = ehLat ? (graus < 0 ? 'S' : 'N') : (graus < 0 ? 'W' : 'E');
  snprintf(saida, n, ehLat ? "%02d%07.4f" : "%03d%07.4f", g, minutos);
}

void gpsSimuladoPasso(float velKmh, double horasPassadas) {
  // avanca na rota conforme a velocidade
  double km = velKmh * horasPassadas;
  double rumo = RUMO_GRAUS * M_PI / 180.0;
  latSim += (km * cos(rumo)) / 111.32;
  lonSim += (km * sin(rumo)) / (111.32 * cos(latSim * M_PI / 180.0));
  // relogio simulado: 08:00 + minutos simulados
  unsigned long min = minutoSimulado();
  int hh = (8 + min / 60) % 24, mm = min % 60;
  char lat[16], lon[16], ns, ew, corpo[100];
  coordNmea(latSim, true, lat, sizeof(lat), ns);
  coordNmea(lonSim, false, lon, sizeof(lon), ew);
  snprintf(corpo, sizeof(corpo), "GPRMC,%02d%02d00.00,A,%s,%c,%s,%c,%.1f,%.1f,121026,,,A",
           hh, mm, lat, ns, lon, ew, velKmh / 1.852, RUMO_GRAUS);
  entregarNmea(corpo);
}

// ---------- saida ----------
void linhaCsv(unsigned long t, float vel, float accel, unsigned long duracao, const char *rotulo) {
  Serial.printf("%lu,%s,%.5f,%.5f,%.0f,%.1f,%.2f,%lu,%s\n", t, PLACA,
                gps.location.isValid() ? gps.location.lat() : 0.0,
                gps.location.isValid() ? gps.location.lng() : 0.0,
                vel, kmTotal, accel, duracao, rotulo);
}

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, PIN_GPS_RX, PIN_GPS_TX);  // NEO-6M (9600 baud de fabrica)
  pinMode(PIN_IGNICAO, INPUT_PULLUP);
  pinMode(PIN_LED_OCIOSO, OUTPUT);
  pinMode(PIN_LED_BRUSCA, OUTPUT);
  pinMode(PIN_LED_VELOCIDADE, OUTPUT);
  iniciarMpu();
  Serial.println("# Fleet Force - dados SIMULADOS (Wokwi). 1 s = 1 min. Acelerometro MPU6050 + GPS.");
  Serial.println("timestamp_min,placa,lat,lon,velocidade_kmh,km,accel_pico_g,duracao_min,rotulo");
  ultimoMs = millis();
}

void loop() {
  unsigned long agora = minutoSimulado();
  unsigned long ms = millis();
  double horasPassadas = (ms - ultimoMs) / (double)MS_POR_MIN_SIMULADO / 60.0;
  ultimoMs = ms;

  // ignicao (botao alterna)
  bool botao = digitalRead(PIN_IGNICAO);
  if (botaoAnterior == HIGH && botao == LOW) ignicao = !ignicao;
  botaoAnterior = botao;

  // GPS: velocidade e posicao
  if (GPS_SIMULADO) {
    float velPot = ignicao ? analogRead(PIN_POT_VELOCIDADE) * VEL_MAX_POT_KMH / 4095.0 : 0;
    gpsSimuladoPasso(velPot, horasPassadas);
  } else {
    while (Serial2.available()) gps.encode(Serial2.read());
  }
  float vel = gps.speed.isValid() ? gps.speed.kmph() : 0;
  if (vel < VEL_PARADO_KMH) vel = 0;
  kmTotal += vel * horasPassadas;

  // acelerometro: frenagem e arrancada bruscas (so com o caminhao andando)
  float ax = lerAceleracaoLongitudinalG();
  if (vel > 5 && armadoFrenagem && ax <= LIMIAR_FRENAGEM_G) {
    linhaCsv(agora, vel, ax, 0, "frenagem_brusca");
    armadoFrenagem = false; eventosBruscos++; ledBruscaAteMs = ms + 2000;
  }
  if (ax > LIMIAR_FRENAGEM_G / 2) armadoFrenagem = true;
  if (vel > 5 && armadoArrancada && ax >= LIMIAR_ARRANCADA_G) {
    linhaCsv(agora, vel, ax, 0, "arrancada_brusca");
    armadoArrancada = false; eventosBruscos++; ledBruscaAteMs = ms + 2000;
  }
  if (ax < LIMIAR_ARRANCADA_G / 2) armadoArrancada = true;
  digitalWrite(PIN_LED_BRUSCA, ms < ledBruscaAteMs);

  // motor ligado com o caminhao parado (ignicao + GPS a 0 km/h)
  bool paradoLigado = ignicao && vel == 0;
  if (paradoLigado && !emParadoLigado) { emParadoLigado = true; inicioParadoMin = agora; }
  else if (!paradoLigado && emParadoLigado) {
    unsigned long dur = agora - inicioParadoMin;
    if (dur >= LIMITE_OCIOSO_MIN) linhaCsv(agora, vel, ax, dur, "ocioso");
    emParadoLigado = false;
  }
  digitalWrite(PIN_LED_OCIOSO, emParadoLigado && (agora - inicioParadoMin) >= LIMITE_OCIOSO_MIN);

  // excesso de velocidade
  bool acima = vel > LIMITE_VELOCIDADE_KMH;
  if (acima && !emExcesso) { emExcesso = true; inicioExcessoMin = agora; }
  else if (!acima && emExcesso) {
    unsigned long dur = agora - inicioExcessoMin;
    if (dur >= 1) linhaCsv(agora, vel, ax, dur, "excesso_velocidade");
    emExcesso = false;
  }
  digitalWrite(PIN_LED_VELOCIDADE, acima);

  // telemetria periodica (linha "normal" para o dataset)
  if (agora - ultimaTelemetriaMin >= TELEMETRIA_A_CADA_MIN) {
    linhaCsv(agora, vel, ax, 0, "normal");
    ultimaTelemetriaMin = agora;
  }

  // indicador de conducao: eventos bruscos por 100 km na ultima hora simulada
  if (agora - ultimoIndicadorMin >= INDICADOR_A_CADA_MIN) {
    double km = kmTotal - kmUltimoIndicador;
    unsigned long ev = eventosBruscos - eventosBruscosUltimoIndicador;
    if (km > 1) Serial.printf("# indicador: %lu eventos bruscos em %.1f km = %.1f por 100 km\n", ev, km, ev * 100.0 / km);
    kmUltimoIndicador = kmTotal; eventosBruscosUltimoIndicador = eventosBruscos;
    ultimoIndicadorMin = agora;
  }

  delay(100);
}
