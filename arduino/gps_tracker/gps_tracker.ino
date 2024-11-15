#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

static const uint32_t GPSBaud = 9600;

TinyGPSPlus gps;
SoftwareSerial ss(5,4);

const char* ssid = "SEVENHEALERS 4835";
const char* password = "1234567890";
const char* serverURL = "http://192.168.137.1:3000/location"; // Replace with your server's IP and port

WiFiClient client;

void setup() {  
  Serial.begin(9600);
  Serial.println("Connecting to WiFi...");
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");

  ss.begin(GPSBaud);
}

void loop() {  
  if (ss.available() > 0) {
    if (gps.encode(ss.read())) {
      if (gps.location.isValid()) {
        float latitude = gps.location.lat();
        float longitude = gps.location.lng();
        float speed = gps.speed.kmph();
        
        Serial.print("Latitude: ");
        Serial.println(latitude, 6);
        Serial.print("Longitude: ");
        Serial.println(longitude, 6);
        Serial.print("Speed (km/h): ");
        Serial.println(speed, 2);
        
        sendToServer(latitude, longitude, speed);
      }
    }
  }
  // else{
  //   Serial.println("Not Available");
  // }
}

void sendToServer(float latitude, float longitude, float speed) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"latitude\":" + String(latitude, 6) + ",\"longitude\":" + String(longitude, 6) + ",\"speed\":" + String(speed, 2) + "}";
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.println("Data sent to server successfully");
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}
