#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

#define DHTPIN 15
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "NOM_WIFI";
const char* password = "12345678";

const char* serverURL ="http://192.168.1.10:3000/api/measurements&quot";

unsigned long previousMillis = 0;
const unsigned long interval = 5000;

void setup() {

Serial.begin(115200);
dht.begin();

WiFi.begin(ssid, password);

Serial.println("Connexion Wi-Fi...");

while (WiFi.status() != WL_CONNECTED) {
delay(500);
Serial.print(".");
}

Serial.println("Wi-Fi connecte !");
Serial.println(WiFi.localIP());
}

void loop() 
{

if (millis() - previousMillis >= interval) 
{

previousMillis = millis();

float temperature = dht.readTemperature();
float humidity = dht.readHumidity();

if (isnan(temperature) || isnan(humidity)) {
Serial.println("Erreur DHT22");
return;
 }

 JsonDocument doc;

doc["device_id"] = "ESP32_01";
doc["temperature"] = temperature;
doc["humidity"] = humidity;


String jsonData;
serializeJson(doc, jsonData);

Serial.println(jsonData);

if (WiFi.status() == WL_CONNECTED) {

HTTPClient http;

http.begin(serverURL);
http.addHeader(
"Content-Type",
"application/json"
);

int code = http.POST(jsonData);

Serial.print("Code HTTP : ");
Serial.println(code);

if (code > 0) {
Serial.println(http.getString());
}

http.end();
}
}
}