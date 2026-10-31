# 🌐 TP IoT : Smart Room Monitoring System (HTTP & MQTT)

Projet complet de supervision et télémétrie IoT pour environnement intérieur (Smart Room), réalisé avec des microcontrôleurs ESP32, des capteurs DHT22 et une interface Web temps réel.

---

## 📌 Structure du projet

Ce dépôt contient deux architectures complémentaires :

### 🔹 Atelier 1 : Architecture HTTP / REST
- **Protocole :** HTTP (Requêtes POST / GET).
- **Fonctionnement :** L'ESP32 agit en tant que client HTTP et pousse périodiquement ses relevés vers une API REST Node.js/Express.
- **Dossier :** `atelier1/`

### 🔹 Atelier 2 : Architecture MQTT & WebSockets Multi-Device
- **Protocole IoT :** MQTT (Broker public HiveMQ / Mosquitto).
- **Communication Web :** WebSockets via Socket.IO.
- **Fonctionnement :** Deux cartes ESP32 distinctes (`ESP32_01` et `ESP32_02`) publient indépendamment sur des topics MQTT (`smartroom/measurements`, `smartroom/alert`).
- **Dashboard :** Tableau de bord dynamique affichant les données en temps réel pour chaque salle sans écrasement mutuel, avec gestion des alertes de surchauffe (> 30 °C).
- **Dossier :** `atelier2/`

---

## 🛠️ Technologies utilisées

- **Embarqué :** ESP32, DHT22 (Pins 15 et 21), C++ / Arduino Framework, Wokwi Simulator.
- **Backend :** Node.js, Express, `mqtt`, `socket.io`.
- **Frontend :** HTML5, CSS3, JavaScript moderne (Event-driven).

---

## 🚀 Démarrage rapide

### 1. Cloner le projet
```bash
git clone [https://github.com/MONSEF441/TP-IoT-SmartRoom.git](https://github.com/MONSEF441/TP-IoT-SmartRoom.git)
cd TP-IoT-SmartRoom
