/*

MinIMU-9-Arduino-AHRS
Pololu MinIMU-9 + Arduino AHRS (Attitude and Heading Reference System)

Copyright (c) 2011-2016 Pololu Corporation.
http://www.pololu.com/

MinIMU-9-Arduino-AHRS is based on sf9domahrs by Doug Weibel and Jose Julio:
http://code.google.com/p/sf9domahrs/

sf9domahrs is based on ArduIMU v1.5 by Jordi Munoz and William Premerlani, Jose
Julio and Doug Weibel:
http://code.google.com/p/ardu-imu/

MinIMU-9-Arduino-AHRS is free software: you can redistribute it and/or modify it
under the terms of the GNU Lesser General Public License as published by the
Free Software Foundation, either version 3 of the License, or (at your option)
any later version.

MinIMU-9-Arduino-AHRS is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
more details.

You should have received a copy of the GNU Lesser General Public License along
with MinIMU-9-Arduino-AHRS. If not, see <http://www.gnu.org/licenses/>.

*/


void MinIMUsetup()
{
//  Serial.begin(115200);
//  pinMode (STATUS_LED,OUTPUT);  // Status LED
  I2C_Init();

  Serial.println("Pololu MinIMU-9 + Arduino AHRS");

//  digitalWrite(STATUS_LED,LOW);
  delay(1500);
  Accel_Init();
  Compass_Init();
  Gyro_Init();
  delay(20);

  for(int i=0;i<32;i++)    // We take some readings...
    {
    Read_Gyro();
    Read_Accel();
    for(int y=0; y<6; y++)   // Cumulate values
      AN_OFFSET[y] += AN[y];
    delay(20);
    }
  for(int y=0; y<6; y++)
    AN_OFFSET[y] = AN_OFFSET[y]/32;

  AN_OFFSET[5]-=GRAVITY*SENSOR_SIGN[5];

  Serial.println("Offset:");
  for(int y=0; y<6; y++)
    Serial.println(AN_OFFSET[y]);

  delay(2000);
  digitalWrite(STATUS_LED,HIGH);

  timer=millis();
  delay(20);
  counter=0;
}

void MinIMUloop() //Main Loop
{
  if((millis()-timer)>=20)  // Main loop runs at 50Hz
  {
    counter++;
    timer_old = timer;
    timer=millis();
    if (timer>timer_old)
    {
      G_Dt = (timer-timer_old)/1000.0;    // Real time of loop run. We use this on the DCM algorithm (gyro integration time)
      if (G_Dt > 0.2)
        G_Dt = 0; // ignore integration times over 200 ms
    }
    else
      G_Dt = 0;



    // *** DCM algorithm
    // Data adquisition
    Read_Gyro();   // This read gyro data
    Read_Accel();     // Read I2C accelerometer

    if (counter > 5)  // Read compass data at 10Hz... (5 loop runs)
    {
      counter=0;
      Read_Compass();    // Read I2C magnetometer
      Compass_Heading(); // Calculate magnetic heading
    }

    // Calculations...
    Matrix_update();
    Normalize();
    Drift_correction();
    Euler_angles();
    // ***

//    printdata();
  }

}
