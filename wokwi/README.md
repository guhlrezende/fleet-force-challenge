# Kit embarcado Fleet Force (Wokwi, simulado)

ESP32 com **duas variáveis**, decisão do grupo em 12/10/2026. Serve para qualquer veículo da frota (caminhão, van, carro); só muda o limite de velocidade.

| Variável | Componente | O que mede | Eventos |
|---|---|---|---|
| Acelerômetro | MPU6050 (I2C: SDA GPIO21, SCL GPIO22) | **aceleração**, ou seja, quanto a velocidade muda de uma vez (não é a velocidade) | `frenagem_brusca` (eixo X ≤ −0,40 g) e `arrancada_brusca` (≥ +0,30 g), com o veículo andando: o motorista que pisa demais e gasta mais combustível |
| GPS | NEO-6M (Serial2: RX GPIO16, TX GPIO17, 9600 baud, NMEA) | velocidade, posição e km rodado | `excesso_velocidade` (acima de 90 km/h por 1 min ou mais) e, com a ignição, `ocioso` (ignição ligada e 0 km/h por 5 min ou mais) |

Juntando os dois sai o **indicador de condução**: eventos bruscos por 100 km, impresso a cada hora simulada numa linha de comentário (`# indicador: ...`).

Botão no GPIO15 = fio de ignição. LEDs: amarelo (GPIO2) ocioso, vermelho (GPIO4) evento brusco, azul (GPIO19) acima do limite. Tempo acelerado: **1 s real = 1 min simulado**.

## GPS no Wokwi

O Wokwi tem o MPU6050, mas não tem módulo GPS. Com `GPS_SIMULADO = true` (padrão), o firmware gera as sentenças NMEA (`$GPRMC`) de uma rota Campinas → São Paulo, com a velocidade do **potenciômetro** (0 a 120 km/h), e lê essas sentenças com a **TinyGPSPlus**, a mesma biblioteca usada com o NEO-6M de verdade. Na bancada (Sprint 2): `GPS_SIMULADO = false` e o NEO-6M ligado em RX2/TX2.

## Saída

CSV no Serial, mesmo formato de `../prototipo/dados/eventos_iot_simulado.csv` (o motor `calcular.py` lê e marca como "simulado"; linhas que começam com `#` são comentário):

```
timestamp_min,placa,lat,lon,velocidade_kmh,km,accel_pico_g,duracao_min,rotulo
```

O cruzamento "abastecimento longe do posto" é feito no servidor: compara a posição do GPS no horário com o posto da planilha de abastecimentos.

## Como rodar

- **wokwi.com (navegador):** novo projeto ESP32; colar `src/main.cpp` no `sketch.ino`, trocar o `diagram.json` pelo daqui e criar `libraries.txt` com `TinyGPSPlus`.
- **VS Code + extensão Wokwi:** `pio run` e depois "Wokwi: Start Simulator" (usa `wokwi.toml`).

Roteiro de teste:
1. Ligar a ignição com o potenciômetro no zero e esperar 5 s: o LED amarelo acende; ao subir o potenciômetro sai uma linha `ocioso`.
2. Com o potenciômetro no meio (cerca de 60 km/h), clicar no MPU6050 e pôr a aceleração X em −0,6 g: sai `frenagem_brusca` e o LED vermelho pisca. Voltar para 0 e pôr +0,4 g: `arrancada_brusca`.
3. Potenciômetro no máximo (120 km/h) por mais de 1 s: LED azul; ao baixar, sai `excesso_velocidade`.
4. Depois de 1 min real (1 h simulada), conferir a linha `# indicador`.

## Estado

- Compila com PlatformIO (`pio run`, 12/10/2026, TinyGPSPlus 1.1.0).
- Formato das sentenças NMEA conferido em teste no PC (checksum, posição e velocidade batem).
- **Ainda não rodado no simulador do Wokwi.** Falta rodar o roteiro acima e tirar print para o slide de hardware.
- Validar com o prof. Noris na aula de qua 14/10 (ele pediu recursos vistos em aula; conferir se o GPS conta).
