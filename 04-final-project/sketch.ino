# My Project

Write an introduction or document your project here. Be sure to _rename the main folder_ when you duplicate this for use in your own projects!
/*!
 * @file  piezoVibrationSensor.ino
 * @brief This example The sensors detect vibration
 * @copyright  Copyright (c) 2010 DFRobot Co.Ltd (http://www.dfrobot.com)
 * @license  The MIT License (MIT)
 * @author  linfeng(490289303@qq.com)
 * @version  V1.0
 * @date  2016-02-26
 */

#define sensorPin A0
void setup()
{
  Serial.begin(115200);
}

void loop()
{
  int x = analogRead(sensorPin);
  Serial.println(x);
  delay(50);
}

