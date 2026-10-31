// atelier-mqtt/simulate_esp.js
const mqtt = require('mqtt');

const BROKER_URL = 'mqtt://localhost:1883';
const TOPIC_MEASUREMENTS = 'smartroom/measurements';
const TOPIC_ALERT = 'smartroom/alert';

const client1 = mqtt.connect(BROKER_URL, { clientId: 'ESP32_01' });
const client2 = mqtt.connect(BROKER_URL, { clientId: 'ESP32_02' });

let c1 = 1, c2 = 1;

client1.on('connect', () => {
  console.log('✅ ESP32_01 simulé connecté');
  setInterval(() => {
    const payload = {
      device_id: 'ESP32_01',
      temperature: +(21 + Math.random() * 4).toFixed(1),
      humidity: +(50 + Math.random() * 8).toFixed(1),
      location: 'Salle TP1',
      sensor_type: 'DHT22',
      counter: String(c1++),
      status: 'OK'
    };
    client1.publish(TOPIC_MEASUREMENTS, JSON.stringify(payload));
    console.log('[ESP32_01] ->', payload);
  }, 5000);
});

client2.on('connect', () => {
  console.log('✅ ESP32_02 simulé connecté');
  setInterval(() => {
    const temp = +(28 + Math.random() * 5).toFixed(1);

    if (temp > 30.0) {
      const alert = { device_id: 'ESP32_02', alert: 'HIGH_TEMPERATURE', temperature: temp };
      client2.publish(TOPIC_ALERT, JSON.stringify(alert));
      console.log('🔥 [ALERTE ESP32_02] ->', alert);
    }

    const payload = {
      device_id: 'ESP32_02',
      temperature: temp,
      humidity: +(42 + Math.random() * 10).toFixed(1),
      location: 'Salle TP2',
      sensor_type: 'DHT22',
      counter: String(c2++),
      status: 'OK'
    };
    client2.publish(TOPIC_MEASUREMENTS, JSON.stringify(payload));
    console.log('[ESP32_02] ->', payload);
  }, 5000);
});