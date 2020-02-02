#!/usr/bin/python

from flask import Flask, request, jsonify

import os
from time import sleep

import pygame, sys

from pygame.locals import *
import pygame.camera

# ocr
from PIL import Image
import pytesseract

import serial

import threading

app = Flask(__name__)

# pygame camera init
"""
pygame.init()
pygame.camera.init()
width = 640
height = 480
cam = pygame.camera.Camera("/dev/video1", (width, height))
cam.start()
"""

device = "/dev/cu.usbmodem14101"
ser = serial.Serial(device, 9600)
sleep(1)


class User:
    def __init__(self, name, uid, slot, count=0):
        self.name = name  # user name
        self.uid = uid  # user id from blockstack
        self.slot = slot  # bin id
        self.count = count

    def serialize(self):
        return {
            "name": self.name,
            "uid": self.uid,
            "slot": self.slot,
            "count": self.count,
        }


# state setup
state = []


def send(cmd: str, bin: int):
    print("sending")
    c = f"{cmd} {str(bin)}"
    print(c)
    ser.write(c.encode("utf-8"))


def sort(bin: int):
    send("sort", bin)


def blink(bin: int):
    for _ in range(5):
        open(bin)
        sleep(2)
        close(bin)
        sleep(1)


def open(bin: int):
    send("open", bin)


def close(bin: int):
    send("close", bin)


# checks for mail
def mailThread():
    while True:
        try:
            if "mail" in str(ser.readline()):
                print("mail!")
                otherOCR()
        except Exception as e:
            print(e)
            print("fuck")


def otherOCR():
    global state
    # take a picture and convert to pil
    # image = cam.get_image()
    # pygame.image.save(image, "temp.jpg")
    # im = Image.open("temp.jpg")
    im = Image.open("test.png")

    # run tesseract
    txt = pytesseract.image_to_string(im)
    print(txt)

    for user in state:
        print(user.name, user.uid, user.slot)
        if user.name in txt or user.uid in txt:
            # pyserial to arduino?
            user.count += 1
            sort(user.slot)
            break


@app.route("/ocr")
def ocr():
    global state
    # take a picture and convert to pil
    # image = cam.get_image()
    # pygame.image.save(image, "temp.jpg")
    # im = Image.open("temp.jpg")
    im = Image.open("test.png")

    # run tesseract
    txt = pytesseract.image_to_string(im)

    for user in state:
        if user.name in txt or user.uid in txt:
            # pyserial to arduino?
            user.count += 1
            break
    return jsonify({"data": txt})


@app.route("/state", methods=["GET", "PUT"])
def handle_state():
    global state
    if request.method == "GET":
        return jsonify(states=[s.serialize() for s in state])
    elif request.method == "PUT":
        return put_state()


# wipe state and replace
def put_state():
    global state
    body = request.json
    state = []
    for user in body:
        state.append(User(user["name"], user["uid"], user["slot"], user["count"]))

    return jsonify(states=[s.serialize() for s in state])


@app.route("/clear-state", methods=["POST"])
def clear_state():
    global state
    body = request.json
    prev = state
    for user in state:
        if user.name == body["name"]:
            user.count = 0
            blink(user.slot)
            return jsonify(states=[s.serialize() for s in prev])


if __name__ == "__main__":
    t = threading.Thread(target=mailThread, args=(), daemon=True)
    t.start()
    app.run(host="0.0.0.0")
