const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

let lastMeasurement = null;

app.post("/api/measurements", (req, res) => {

const data = req.body;

if (
typeof data.temperature !== "number" ||
typeof data.humidity !== "number" ||
typeof data.device_id !== "string"
) {
return res.status(400).json({
success: false,
message: "JSON invalide"
});
}

const measurement = {
...data,
receivedAt: new Date().toISOString()
};

lastMeasurement = measurement;

console.log("Mesure recue :", measurement);

io.emit("newMeasurement", measurement);

res.status(200).json({
success: true,
message: "Mesure recue"
});
});

app.get("/api/measurements/latest", (req, res) => {
res.json(lastMeasurement);
});

server.listen(3000, "0.0.0.0", () => {
console.log("Serveur actif sur port 3000");
});
