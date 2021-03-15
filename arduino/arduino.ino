#include <WiFi101.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <RTCZero.h>
char ssid[] = "prettyflyforawifi";     
char pass[] = "mylittleponyranch"; 
char user[] =  "simon";
char server[] = "smarttimer-server.herokuapp.com"; 
int status = WL_IDLE_STATUS;
WiFiClient wifiClient;
String buttons[4];

WiFiUDP ntpUDP;
int interrupt1 = 6;
int interrupt2 = A1;
int interrupt3 = A2;
int interrupt4 = 8;
int interruptPower = 5;

int led1 = 0;
int led2 = 1;
int led3 = 2;
int led4 = 3;
int interruptPower2 = A3;
int interruptPower3 = A4;

int currentMode;
int lastMode = 1;
unsigned long prev;
unsigned long now;
String date;
NTPClient timeClient(ntpUDP);
RTCZero rtc;


void setup() {
  Serial.begin(115200);
  attachInterrupt(digitalPinToInterrupt(interrupt1),isr1,HIGH);
  attachInterrupt(digitalPinToInterrupt(interrupt2),isr2,HIGH);
  attachInterrupt(digitalPinToInterrupt(interrupt3),isr3,HIGH);
  attachInterrupt(digitalPinToInterrupt(interrupt4),isr4,HIGH);

  pinMode(led1,OUTPUT);
  pinMode(led2,OUTPUT);
  pinMode(led3,OUTPUT);
  pinMode(led4,OUTPUT);
  pinMode(interruptPower,OUTPUT);
  pinMode(interruptPower2,OUTPUT);
  pinMode(interruptPower3,OUTPUT);
  prev = 0;
  digitalWrite(interruptPower,HIGH);
  digitalWrite(interruptPower2,HIGH);
  digitalWrite(interruptPower3,HIGH);

    while (status != WL_CONNECTED) {
      Serial.print("Attempting to connect to SSID: ");
      Serial.println(ssid);
      status = WiFi.begin(ssid, pass);
      delay(100);
    }
      Serial.println("\nStarting connection to server...");
     
  timeClient.begin();
  rtc.begin();
  String body;
  StaticJsonDocument<200> doc;
  doc["username"] = user;
  serializeJson(doc, body);
  if (wifiClient.connect(server, 80)) {
    Serial.println("connected");
    wifiClient.println("POST /api/sync HTTP/1.1");
    wifiClient.println("Host: smarttimer-server.herokuapp.com");
    wifiClient.println("Content-type:application/json");
    wifiClient.println("Connection: close");
    wifiClient.print("Content-Length: ");
    wifiClient.println(body.length());
    wifiClient.println();
    wifiClient.println(body);  
  }
  String response;
  while (wifiClient.connected()){
    if ( wifiClient.available()){
      char str=wifiClient.read();
      response += str;
    }      
  }
  String json = response.substring(response.indexOf("[")+1,response.indexOf("]"));
  initializeButtons(json);
  Serial.println("Wait 1 second");
  delay(1000);
  Serial.println("Setup Done");
  timeClient.update();
  date = timeClient.getFormattedDate();
  Serial.println(date);
  prev = timeClient.getEpochTime();
  isr1();
}

void loop() {
  if (currentMode != lastMode) {
    timeClient.update();
    now = timeClient.getEpochTime();
    unsigned long diff = now - prev;
    prev = now;
    int spentTime = diff;
   
    Serial.println("making POST request");
    String contentType = "application/json";
    String data;
    StaticJsonDocument<200> doc;
    doc["date"] = date;
    doc["module"] = buttons[lastMode-1];
    if(buttons[lastMode -1] == NULL) {
      Serial.println("Button not in use");
      lastMode = currentMode;
      return;
    }
    doc["rectime"] = spentTime;
    doc["username"] = user;
    serializeJson(doc, data);
    Serial.println(data);
    lastMode = currentMode;

    if (wifiClient.connect(server, 80)) {
      Serial.println("connected");
      wifiClient.println("POST /api/addtimestamp HTTP/1.1");
      wifiClient.println("Host: smarttimer-server.herokuapp.com");
      wifiClient.println("Content-type:application/json");
      wifiClient.println("Connection: close");
      wifiClient.print("Content-Length: ");
      wifiClient.println(data.length());
      wifiClient.println();
      wifiClient.println(data);  
  }
  String response;
  while (wifiClient.connected()){
    if ( wifiClient.available()){
      char str=wifiClient.read();
      response += str;
    }      
  }
  Serial.println(response);
  timeClient.update();
  date = timeClient.getFormattedDate();
  Serial.println(date);
  wifiClient.flush();
  wifiClient.stop();
  WiFi.end();
  delay(10);
  WiFi.begin(ssid, pass);
}
}

void isr1() {
  currentMode = 1;
  digitalWrite(led1,HIGH);
  digitalWrite(led2,LOW);
  digitalWrite(led3,LOW);
  digitalWrite(led4,LOW);
}
void isr2() {
  currentMode = 2;
  digitalWrite(led2,HIGH);
  digitalWrite(led1,LOW);
  digitalWrite(led3,LOW);
  digitalWrite(led4,LOW);
}
void isr3() {
  currentMode = 3;
  digitalWrite(led3,HIGH);
  digitalWrite(led2,LOW);
  digitalWrite(led1,LOW);
  digitalWrite(led4,LOW);
}
void isr4() {
  currentMode = 4;
  digitalWrite(led4,HIGH);
  digitalWrite(led2,LOW);
  digitalWrite(led3,LOW);
  digitalWrite(led1,LOW);
}
void initializeButtons(String response) {
  Serial.println(response);

  for(int i = 0; i < 4; i++) {
      DynamicJsonDocument doc2(1024);
  deserializeJson(doc2, response);
  String moduleid = doc2["moduleid"];
  String buttonid = doc2["buttonid"];
  Serial.println(buttonid);
  if(buttonid == "blue") {
    buttons[0] = moduleid;
  }
  if(buttonid == "yellow") {
    buttons[1] = moduleid;
  }
  if(buttonid == "red") {
    buttons[2] = moduleid;
  }
  if(buttonid == "green") {
    buttons[3] = moduleid;
  }
  response.remove(0,response.indexOf("}")+2);
  }
  for(int i = 0; i < 4;i++){
    Serial.println(buttons[i]);
  }
}
