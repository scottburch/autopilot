#include <Wire.h>
#include "autopilot.h"

// Digitial pins
int MOTOR_SPEED_PIN = 9;
int MOTOR_DIRECTION_PIN = 8;

// Analog pins
int MOTOR_TACH_PIN = 0;
int VOLTAGE_PIN = 1;


void setup() {
    // Set PCM frequency
  TCCR1B = (TCCR1B & 0b11111000) | 0x01;

  Serial.begin(115200);
  Serial.println("Serial port up");
//  Serial.setTimeout(1);
  MinIMUsetup();
  pinMode(MOTOR_SPEED_PIN, OUTPUT);
  pinMode(MOTOR_DIRECTION_PIN, OUTPUT);
}

int speed = 0;
int base;
int tachRef;


void log(String string) {
    Serial.print("L:");
    Serial.println(string);
}

void serialEvent() {
        String cmd = Serial.readStringUntil(':');
        String val = Serial.readStringUntil('!');
        if(cmd == "R") {
            speed = val.toInt();
            digitalWrite(MOTOR_DIRECTION_PIN, speed > 0 ? LOW : HIGH);
            if(speed == 0) {
                analogWrite(MOTOR_SPEED_PIN, 0);
            }
            base = 100;

        }
        if(cmd == "P") {
                Serial.print("D:");
                Serial.println(millis() - val.toInt());
        }
}

void motorDriveLoop() {
    if(speed != 0) {
        if(abs(analogRead(MOTOR_TACH_PIN) - tachRef) < abs(speed)) {
            base = base + 5;
            base = base > 255 ? 255 : base;
        }  else {
            base = base - 5;
            base = base < 0 ? 0 : base;
        }
        analogWrite(MOTOR_SPEED_PIN, base);
    } else {
        tachRef = analogRead(MOTOR_TACH_PIN);
    }
}

const unsigned long COMPASS_UPDATE_INTERVAL = 100;
unsigned long lastCompassSend = millis();

//int firstTime = 1;
int count = 0;
int minVolts = 1023;
int maxVolts = 0;
int volts = 0;

void voltageReadLoop() {
    volts = analogRead(VOLTAGE_PIN);
    volts < minVolts && (minVolts = volts);
    volts > maxVolts && (maxVolts = volts);
}

void loop() {
    count++;

//    if(firstTime) {
//        setup();
//        firstTime = 0;
//    }

    MinIMUloop();
    if(millis() - lastCompassSend > COMPASS_UPDATE_INTERVAL) {
        printdata();
        Serial.print("HZ:");
        Serial.println(count * (1000/(millis() - lastCompassSend)));
        Serial.print("B:");
        Serial.println(base);
        Serial.print("T:");
        Serial.println(tachRef);
        Serial.print("S:");
        Serial.println(speed);
        Serial.print("V:");
        Serial.print(volts);
        Serial.print(",");
        Serial.print(minVolts);
        Serial.print(",");
        Serial.println(maxVolts);


        count = 0;
        lastCompassSend = millis();
    }

    voltageReadLoop();
//    serialReadLoop();
    motorDriveLoop();
    delay(1);
}
