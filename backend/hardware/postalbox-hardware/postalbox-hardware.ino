#include <Servo.h>

Servo sorter;
int sortPin = 9;
int pos = 0;

// all the way down, normal, bin 2, bin 3
int bins[] = {0, 30, 60, 90};
int binsNum = 4;

int binPins[] = {10,11,12};

int laserBreakPin = A0;
int laserThreshold = 15;

void setup() {
    sorter.attach(9);
    Serial.begin(9600);
    sorter.write(0);
    delay(1000);
    pinMode(binPins[0], OUTPUT);
    pinMode(binPins[1], OUTPUT);
    pinMode(binPins[2], OUTPUT);
}

// arduino is s l a v e
void loop() {
    // laser broken by envelope!
    if(analogRead(laserBreakPin) < laserThreshold) {
        Serial.println("mail");
    }
    
    String incoming = Serial.readString();
    if (incoming.length()) {
        incoming.toLowerCase();
  
        Serial.println(incoming);
  
        // maximum number of arguments
        const int maxArgs = 2;
        String cmd[maxArgs];
    
        int i = 0;
        char buf[512];
        incoming.toCharArray(buf, sizeof(buf));
        char *p = buf;
        while ((cmd[i] = strtok_r(p, " ", &p)) != NULL) {
            Serial.println(cmd[i]);
            i++;
        }
    
        for(i;i<maxArgs;i++){
            cmd[i]="";
        }

        if(cmd[0].equals("sort")) {
            int bin = cmd[1].toInt();
            // error handling
            if(bin > binsNum - 1 || bin < 0) {
                Serial.println("bad");
            }
        
            if(pos > bins[bin]){
                for(;pos>bins[bin];--pos){
                    sorter.write(pos);
                    delay(1);
                }
            } else if(pos < bins[bin]) {
                for(;pos<bins[bin];++pos){
                    sorter.write(pos);
                    delay(1);
                }
            }
            delay(1000);
            for(;pos>bins[0];--pos){
                sorter.write(pos);
                delay(1);
            }
            Serial.println("ok");
        }
        else if(cmd[0].equals("open")) {
            digitalWrite(binPins[cmd[1].toInt()], HIGH);
            Serial.println("ok");
        }
        else if(cmd[0].equals("close")) {
            digitalWrite(binPins[cmd[1].toInt()], LOW);
            Serial.println("ok");
        }
        else {
            Serial.println("bad");
        }
    }
}
