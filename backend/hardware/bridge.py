import serial
import requests

from time import sleep

device = "/dev/cu.usbmodem142301"

ser = serial.Serial(device, 9600)
sleep(1)


def send(cmd: str, bin: int):
    ser.write(cmd)
    sleep(1)
    ser.readline()
    ser.write(bin)


def sort(bin: int):
    send("sort", bin)


def open(bin: int):
    send("open", bin)


def close(bin: int):
    send("close", bin)


def main():
    pass


if __name__ == "__main__":
    main()
