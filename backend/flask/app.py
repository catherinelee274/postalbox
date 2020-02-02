#!/usr/bin/python

from flask import Flask, request, jsonify

import os
import pygame, sys

from pygame.locals import *
import pygame.camera

# ocr
from PIL import Image
import pytesseract

app = Flask(__name__)

# pygame camera init
# pygame.init()
# pygame.camera.init()
# width = 640
# height = 480
# cam = pygame.camera.Camera("/dev/video0", (width, height))
# cam.start()


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


@app.route("/ocr")
def ocr():
    global state
    # take a picture and convert to pil
    # image = cam.get_image()
    # str_img = pygame.image.tostring(image, "RGBA", False)
    # im = Image.frombytes("RGBA", (1280, 720), str_img)
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


if __name__ == "__main__":
    app.run(debug=True)
