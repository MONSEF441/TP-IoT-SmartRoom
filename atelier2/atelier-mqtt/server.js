const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir les fichiers statiques depuis public
app.use(express.static(path.join(__dirname, "public")));

// Route explicite pour charger dashboard.html sur '/'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

const mqttClient = mqtt.connect("mqtt://broker.hivemq.com:1883");

const topicMesure = "smartroom/measurements";
const topicTemperature = "smartroom/temperature";
const topicHumidity = "smartroom/humidity";
const topicStatus = "smartroom/status";
const topicAlert = "smartroom/alert";

// Stockage de la dernière mesure reçue par device_id (ESP32_01, ESP32_02)
const latestMeasurements = {};

mqttClient.on("connect", () => {
  console.log("Connexion broker MQTT reussie");

  const topics = [
    topicMesure,
    topicTemperature,
    topicHumidity,
    topicStatus,
    topicAlert
  ];

  mqttClient.subscribe(topics, (err) => {
    if (err) {
      console.log("Erreur abonnement MQTT :", err);
      return;
    }
    console.log("Abonnements MQTT reussis :", topics);
  });
});

mqttClient.on("message", (receivedTopic, message) => {
  try {
    const data = JSON.parse(message.toString());

    switch (receivedTopic) {
      case topicMesure:
        console.log("Mesure complete :", data);

        if (
          typeof data.temperature !== "number" ||
          typeof data.humidity !== "number" ||
          typeof data.device_id !== "string" ||
          data.temperature < -40 ||
          data.temperature > 80 ||
          data.humidity < 0 ||
          data.humidity > 100
        ) {
          console.log("Mesure invalide");
          return;
        }

        const measurement = {
          ...data,
          receivedAt: new Date().toISOString()
        };

        // Sauvegarde par appareil pour ne pas écraser l'autre salle
        latestMeasurements[data.device_id] = measurement;

        io.emit("newMeasurement", measurement);
        break;

      case topicTemperature:
        console.log("Temperature :", data);
        io.emit("newTemperature", data);
        break;

      case topicHumidity:
        console.log("Humidite :", data);
        io.emit("newHumidity", data);
        break;

      case topicStatus:
        console.log("Statut :", data);
        io.emit("deviceStatus", data);
        break;

      case topicAlert:
        if (
          typeof data.device_id !== "string" ||
          data.alert !== "HIGH_TEMPERATURE" ||
          typeof data.temperature !== "number" ||
          data.temperature <= 30
        ) {
          console.log("Alerte invalide :", data);
          return;
        }

        const alert = {
          ...data,
          receivedAt: new Date().toISOString()
        };

        console.log("ALERTE TEMPERATURE ELEVEE :", alert);
        io.emit("temperatureAlert", alert);
        break;
    }
  } catch (error) {
    console.log("Erreur JSON :", error.message);
  }
});

// Retourne les dernières mesures des 2 ESP au format tableau
app.get("/api/measurements/latest", (req, res) => {
  res.json(Object.values(latestMeasurements));
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Dashboard actif sur port 3000");
});