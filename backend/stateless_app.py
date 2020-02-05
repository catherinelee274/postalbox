
from matplotlib import pyplot
from PIL import Image
from numpy import asarray
from scipy.spatial.distance import cosine
from mtcnn.mtcnn import MTCNN
from keras_vggface.vggface import VGGFace
from keras_vggface.utils import preprocess_input
import os
from flask import Flask, request, Response #import main Flask class and request object
import numpy as np
import binascii
import base64
import io
from flask_cors import CORS
import json
import tensorflow as tf

global detector
detector = MTCNN(steps_threshold=[0.3, 0.35, 0.35])
"""
global model
    # this is key : save the graph after loading the model
global graph
graph = tf.get_default_graph()
"""
global model
model = VGGFace(model='resnet50', include_top=False, input_shape=(224, 224, 3), pooling='avg')
global graph
graph = tf.get_default_graph()

#os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

def extract_face(filename, required_size=(224, 224),file_bool=True):
    # load image from file
    if file_bool:
        pixels = pyplot.imread(filename)
    else:
        pixels = filename
    # create the detector, using default weights
    # detect faces in the image
    face_array = None
    
    global graph
    global detector
    with graph.as_default():
        results = detector.detect_faces(pixels)
        # extract the bounding box from the first face
        x1, y1, width, height = results[0]['box']
        x2, y2 = x1 + width, y1 + height
        # extract the face
        face = pixels[y1:y2, x1:x2]
        # resize pixels to the model size
        try:
            image = Image.fromarray(face)
        except ValueError as e:
            image = Image.fromarray(pixels)
        image = image.resize(required_size)
        face_array = asarray(image)
    return face_array

# extract faces and calculate face embeddings for a list of photo files
def get_embeddings(filenames,file_bool=True):
    if file_bool:
        faces = [extract_face(f) for f in filenames]
    else:
        faces = [extract_face(f,file_bool=False) for f in filenames]
    # extract faces
    # convert into an array of samples
    samples = asarray(faces, 'float32')
    # prepare the face for the model, e.g. center pixels
    samples = preprocess_input(samples, version=2)
    # create a vggface model
    # perform prediction
    yhat = model.predict(samples)
    return yhat

# determine if a candidate face is a match for a known face
def is_match(known_embedding, candidate_embedding, thresh=0.5):
    # calculate distance between embeddings
    score = cosine(known_embedding, candidate_embedding)
    if score <= thresh:
        print('>face is a Match (%.3f <= %.3f)' % (score, thresh))
    else:
        print('>face is NOT a Match (%.3f > %.3f)' % (score, thresh))


def get_embeddings_clean(img, use_alwaysai=False):
        # detections = req_data['detections']
    #convert string of image data to uint8
    #img = np.frombuffer(base64.b64decode(image), np.uint8).reshape(224, 224, 3)
    # convert string of jpeg data to uint8
    face = None
    embedding_vector = []
    
    if use_alwaysai:
        largest_face = None
        largest_area = None
        detections = [
            {
                "width": 100,
                "height": 100,
                "start_x": 0,
                "end_x": 224,
                "start_y": 0,
                "end_y": 224
            }
        ]

        for detection in detections:
            area = detection["height"] * detection["width"]
            if largest_area is None or area > largest_area:
                largest_face = detection
        if largest_face is not None:
            face = img[largest_face["start_y"]:largest_face["end_y"],
                       largest_face["start_x"]:largest_face["end_x"]]

    else:
        face = extract_face(img, file_bool=False)
    
    if face is not None:
        samples = asarray([face], 'float32')
        # prepare the face for the model, e.g. center pixels
        samples = preprocess_input(samples, version=2)
        # create a vggface model
        # perform prediction
        global graph
        global model
        with graph.as_default():
            yhat = model.predict(samples)
            embedding_vector = list(yhat.flatten().astype(float))
    return embedding_vector
        

app = Flask(__name__) #create the Flask app
CORS(app)

@app.route('/get-embedding', methods=['POST'])
def get_embedding():
    if request.is_json:
        req_data = request.get_json()
    else:
        data = request.data
        req_data = json.loads(data)
    image = req_data['image']
    
    if 'data:image/jpeg;base64,' in image:
        image = image[len("data:image/jpeg;base64,"):]
    
    img = asarray(Image.open(io.BytesIO(base64.b64decode(image))))
    #convert string of image data to uint8
    #img = [np.frombuffer(base64.b64decode(image), np.uint8).reshape(224,224,3)]
    # decode image
    embedding_vector = get_embeddings_clean(img)
    
    response = {'message': 'image received', 'embedding': embedding_vector}
    response_pickled = json.dumps(response)
    return Response(response=response_pickled, status=200,
                    mimetype="application/json")


@app.route('/json-example', methods=['POST']) #GET requests will be blocked
def json_example():
    req_data = request.get_json()

    name = req_data['name']
    image = req_data['image']

    #convert string of image data to uint8
    img = [np.frombuffer(base64.b64decode(image), np.uint8).reshape(224,224,3)]
    # decode image
    embedding_vector = get_embeddings(img,file_bool=False)

    response = {'message': 'image received. size={}x{}'.format(embedding_vector.shape[1], embedding_vector.shape[0])}
    response_pickled = json.dumps(response)
    return Response(response=response_pickled, status=200, mimetype="application/json")


if __name__ == '__main__':
    app.run(debug=False, port=4000, use_reloader=False, host='0.0.0.0') #run app in debug mode on port 5000