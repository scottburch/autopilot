/*
Remote LED control sketch
Send remote AT request frame to Coordinator(short address is 0x0000)
Router should enter API mode at first
On/Sleep Led on remote device will blink
*/
#include <Arduino.h>

/* LED Pin */
int led = 13;
/* declaration */
void remoteATIO_Off();
void remoteATIO_On();

void setup() {
pinMode(led, OUTPUT);
/* open the serial port at 115200 bps */
Serial.begin(115200);
}

void loop() {
  delay(1000);
  Serial.println("+++\r");
  delay(1000);
  Serial.println("atif\r");
  delay(1000);
  while (Serial.available()) {
    Serial.print(Serial.read());
  }
  Serial.println("**");
}

/*
void loop() {
remoteATIO_On();
digitalWrite(led, LOW);
delay(500);
remoteATIO_Off();
digitalWrite(led, HIGH);
delay(500);
}

*/
/* Turn off remote Led */
void remoteATIO_Off()
{
Serial.write(0x7e); //start delimiter
Serial.write(0x0d); //length
Serial.write(0x17); //API identifier: remote AT require
Serial.write(0xec); //frame ID
Serial.write(0x00); //option
Serial.write(0x70); //AT cmd index
Serial.write(0x09); //IO pin No
Serial.write(0x00); //State: Off
Serial.write(0x00); //none
Serial.write(0x00); //none
Serial.write(0x00); //none
Serial.write(0x00); //none
Serial.write(0x00); //none
Serial.write(0x00); //none
Serial.write(0x00); //unicast address low
Serial.write(0x00);
//unicast address high
Serial.write(0x9c); //check sum: payload byte[4-16]
}
/* Turn on remote Led */
void remoteATIO_On()
{
Serial.write(0x7e);
Serial.write(0x0d);
Serial.write(0x17);
Serial.write(0xec);
Serial.write(0x00);
Serial.write(0x70);
Serial.write(0x09);
Serial.write(0x01); //State: On
Serial.write(0x00);
Serial.write(0x00);
Serial.write(0x00);
Serial.write(0x00);
Serial.write(0x00);
Serial.write(0x00);
Serial.write(0x00);
Serial.write(0x00);
Serial.write(0x9d);
}

