#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

#define SS_PIN 5
#define RST_PIN 4
#define BUZZER_PIN 2
#define BUZZER_CH 0

// ===== Hàm bỏ dấu tiếng Việt =====
String removeVietnameseTones(String str) {
  str.replace("á", "a"); str.replace("à", "a"); str.replace("ả", "a");
  str.replace("ã", "a"); str.replace("ạ", "a"); str.replace("ă", "a");
  str.replace("ắ", "a"); str.replace("ằ", "a"); str.replace("ẳ", "a");
  str.replace("ẵ", "a"); str.replace("ặ", "a"); str.replace("â", "a");
  str.replace("ấ", "a"); str.replace("ầ", "a"); str.replace("ẩ", "a");
  str.replace("ẫ", "a"); str.replace("ậ", "a"); str.replace("đ", "d");
  str.replace("é", "e"); str.replace("è", "e"); str.replace("ẻ", "e");
  str.replace("ẽ", "e"); str.replace("ẹ", "e"); str.replace("ê", "e");
  str.replace("ế", "e"); str.replace("ề", "e"); str.replace("ể", "e");
  str.replace("ễ", "e"); str.replace("ệ", "e"); str.replace("í", "i");
  str.replace("ì", "i"); str.replace("ỉ", "i"); str.replace("ĩ", "i");
  str.replace("ị", "i"); str.replace("ó", "o"); str.replace("ò", "o");
  str.replace("ỏ", "o"); str.replace("õ", "o"); str.replace("ọ", "o");
  str.replace("ô", "o"); str.replace("ố", "o"); str.replace("ồ", "o");
  str.replace("ổ", "o"); str.replace("ỗ", "o"); str.replace("ộ", "o");
  str.replace("ơ", "o"); str.replace("ớ", "o"); str.replace("ờ", "o");
  str.replace("ở", "o"); str.replace("ỡ", "o"); str.replace("ợ", "o");
  str.replace("ú", "u"); str.replace("ù", "u"); str.replace("ủ", "u");
  str.replace("ũ", "u"); str.replace("ụ", "u"); str.replace("ư", "u");
  str.replace("ứ", "u"); str.replace("ừ", "u"); str.replace("ử", "u");
  str.replace("ữ", "u"); str.replace("ự", "u"); str.replace("ý", "y");
  str.replace("ỳ", "y"); str.replace("ỷ", "y"); str.replace("ỹ", "y");
  str.replace("ỵ", "y");

  // Chữ hoa
  str.replace("Á", "A"); str.replace("À", "A"); str.replace("Ả", "A");
  str.replace("Ã", "A"); str.replace("Ạ", "A"); str.replace("Ă", "A");
  str.replace("Ắ", "A"); str.replace("Ằ", "A"); str.replace("Ẳ", "A");
  str.replace("Ẵ", "A"); str.replace("Ặ", "A"); str.replace("Â", "A");
  str.replace("Ấ", "A"); str.replace("Ầ", "A"); str.replace("Ẩ", "A");
  str.replace("Ẫ", "A"); str.replace("Ậ", "A"); str.replace("Đ", "D");
  str.replace("É", "E"); str.replace("È", "E"); str.replace("Ẻ", "E");
  str.replace("Ẽ", "E"); str.replace("Ẹ", "E"); str.replace("Ê", "E");
  str.replace("Ế", "E"); str.replace("Ề", "E"); str.replace("Ể", "E");
  str.replace("Ễ", "E"); str.replace("Ệ", "E"); str.replace("Í", "I");
  str.replace("Ì", "I"); str.replace("Ỉ", "I"); str.replace("Ĩ", "I");
  str.replace("Ị", "I"); str.replace("Ó", "O"); str.replace("Ò", "O");
  str.replace("Ỏ", "O"); str.replace("Õ", "O"); str.replace("Ọ", "O");
  str.replace("Ô", "O"); str.replace("Ố", "O"); str.replace("Ồ", "O");
  str.replace("Ổ", "O"); str.replace("Ỗ", "O"); str.replace("Ộ", "O");
  str.replace("Ơ", "O"); str.replace("Ớ", "O"); str.replace("Ờ", "O");
  str.replace("Ở", "O"); str.replace("Ỡ", "O"); str.replace("Ợ", "O");
  str.replace("Ú", "U"); str.replace("Ù", "U"); str.replace("Ủ", "U");
  str.replace("Ũ", "U"); str.replace("Ụ", "U"); str.replace("Ư", "U");
  str.replace("Ứ", "U"); str.replace("Ừ", "U"); str.replace("Ử", "U");
  str.replace("Ữ", "U"); str.replace("Ự", "U"); str.replace("Ý", "Y");
  str.replace("Ỳ", "Y"); str.replace("Ỷ", "Y"); str.replace("Ỹ", "Y");
  str.replace("Ỵ", "Y");
  return str;
}

// ===== Thiết bị =====
MFRC522 mfrc522(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 20, 4);   // LCD 20x4

const char* ssid = "H06-Babershop";
const char* password = "Tratiencattoc";
const String firebaseHost = "https://nckh-61911-default-rtdb.firebaseio.com/";

bool daQuetSV = false;
DynamicJsonDocument tempSV(512);
DynamicJsonDocument tempSach(512);

// ===== Buzzer =====
void beepMs(int ms, int freq = 2000) {
  ledcWriteTone(BUZZER_CH, freq);
  delay(ms);
  ledcWriteTone(BUZZER_CH, 0);
}

// ===== Firebase GET =====
bool getDataFromFirebase(String path, JsonDocument& doc) {
  if (WiFi.status() != WL_CONNECTED) return false;
  HTTPClient http;
  WiFiClientSecure client;
  client.setInsecure();
  String url = firebaseHost + path + ".json";
  http.begin(client, url);
  int httpCode = http.GET();
  if (httpCode <= 0) {
    Serial.println("Loi HTTP");
    http.end();
    return false;
  }
  String payload = http.getString();
  DeserializationError error = deserializeJson(doc, payload);
  http.end();
  if (error) {
    Serial.println("Loi JSON");
    return false;
  }
  return true;
}

// ===== Firebase PUT =====
bool pushDataToFirebase(String path, JsonDocument& doc) {
  if (WiFi.status() != WL_CONNECTED) return false;
  HTTPClient http;
  WiFiClientSecure client;
  client.setInsecure();
  String url = firebaseHost + path + ".json";
  http.begin(client, url);
  String jsonStr;
  serializeJson(doc, jsonStr);
  int httpCode = http.PUT(jsonStr);
  if (httpCode > 0) {
    Serial.println("Upload OK: " + String(httpCode));
  } else {
    Serial.println("Upload FAIL");
    http.end();
    return false;
  }
  http.end();
  return true;
}

// ===== In tiêu đề sách =====
void printBookTitle(LiquidCrystal_I2C &lcd, String tieuDe) {
  tieuDe = removeVietnameseTones(tieuDe);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Sach:");

  int maxWidth = 20;
  int maxLines = 3;
  String dong[3];
  int dongIndex = 0;

  while (tieuDe.length() > 0 && dongIndex < maxLines) {
    if (tieuDe.length() <= maxWidth) {
      dong[dongIndex++] = tieuDe;
      break;
    }
    int splitPos = tieuDe.lastIndexOf(' ', maxWidth);
    if (splitPos == -1) splitPos = maxWidth;
    dong[dongIndex++] = tieuDe.substring(0, splitPos);
    tieuDe = tieuDe.substring(splitPos + 1);
  }

  for (int i = 0; i < dongIndex; i++) {
    lcd.setCursor(0, i + 1);
    lcd.print(dong[i]);
  }
}

void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Dang ket noi WiFi");

  WiFi.begin(ssid, password);
  int retry = 0;
  ledcSetup(BUZZER_CH, 2000, 10);
  ledcAttachPin(BUZZER_PIN, BUZZER_CH);

  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }
  lcd.clear();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nDa ket noi WiFi!");
    lcd.print("Da ket noi WiFi");
  } else {
    Serial.println("\nWiFi Fail");
    lcd.print("WiFi Failed");
  }
  delay(1500);
  lcd.clear();
  lcd.print("Quet the SV...");
}

void loop() {
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) return;
  beepMs(100);

  // Lấy UID
  String uidStr = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uidStr += (mfrc522.uid.uidByte[i] < 0x10 ? "0" : "") + String(mfrc522.uid.uidByte[i], HEX);
  }
  uidStr.toUpperCase();
  Serial.println("Quet: " + uidStr);

  // Lấy dữ liệu từ Firebase
  DynamicJsonDocument tempUser(512), tempBook(512);
  bool isUser = getDataFromFirebase("users/" + uidStr, tempUser) && !tempUser.isNull();
  bool isBook = getDataFromFirebase("books/" + uidStr, tempBook) && !tempBook.isNull();

  if (isUser) {
    // ==== Sinh viên ====
    tempSV.clear();
    tempSV.set(tempUser);
    String ten = tempSV["username"] | "SV khong ten";
    ten = removeVietnameseTones(ten);

    lcd.clear();
    lcd.print("Xin chao:");
    lcd.setCursor(0, 1);
    lcd.print(ten);

    daQuetSV = true;
    pushDataToFirebase("temp/student", tempSV);

    delay(2000);
    lcd.clear();
    lcd.print("Quet the sach");
  }
  else if (isBook) {
    // ==== Sách ====
    if (!daQuetSV) {
      lcd.clear();
      lcd.print("Sai thu tu!");
      lcd.setCursor(0, 1);
      lcd.print("Quet the SV truoc");
      delay(2000);
      lcd.clear();
      lcd.print("Quet the SV...");
      return;
    }

    tempSach.clear();
    tempSach.set(tempBook);

    String tieuDe = tempSach["title"] | "Sach khong ten";
    printBookTitle(lcd, tieuDe);

    Serial.println("Thong tin SV:");
    serializeJsonPretty(tempSV, Serial);
    Serial.println("\nThong tin Sach:");
    serializeJsonPretty(tempSach, Serial);

    pushDataToFirebase("temp/book", tempSach);

    daQuetSV = false;
    delay(3000);
    lcd.clear();
    lcd.print("Quet the SV...");
  }
  else {
    // ==== Không tìm thấy UID ====
    lcd.clear();
    lcd.print("Khong tim UID");
    delay(2000);
    lcd.clear();
    lcd.print("Quet the SV...");
  }
}
