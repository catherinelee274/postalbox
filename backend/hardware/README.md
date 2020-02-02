# What

The `postalbox-hardware/` folder contains the `.ino` program for Arduino. This program parses string commands through serial.

IT DOES NOT HANDLE ERRORS WELL (it does not catch type errors because Arduino doesn't have try-catch blocks).

The Python file is not yet complete but it uses Pyserial to communicate with the Arduino program. Instead of using the Arduino serial through the IDE, you can do the same programmatically through Pyserial. So far, the program implements several write functions to the Arduino to sort mail, turn on LEDs, etc.
