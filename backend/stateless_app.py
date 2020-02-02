
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
import jsonpickle

detector = MTCNN(steps_threshold=[0.3, 0.35, 0.35])
model = VGGFace(model='resnet50', include_top=False, input_shape=(224, 224, 3), pooling='avg')
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

def extract_face(filename, required_size=(224, 224),file_bool=True):
	# load image from file
	if file_bool:
		pixels = pyplot.imread(filename)
	else:
		pixels = filename
	# create the detector, using default weights
	# detect faces in the image
	results = detector.detect_faces(pixels)
	# extract the bounding box from the first face
	x1, y1, width, height = results[0]['box']
	x2, y2 = x1 + width, y1 + height
	# extract the face
	face = pixels[y1:y2, x1:x2]
	# resize pixels to the model size
	image = Image.fromarray(face)
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

app = Flask(__name__) #create the Flask app

@app.route('/json-example', methods=['POST']) #GET requests will be blocked
def json_example():
    req_data = request.get_json()

    name = req_data['name']
    image = req_data['image']

    #convert string of image data to uint8
    img = [np.frombuffer(base64.b64decode(image), np.uint8).reshape(224, 224, 3)]
    # decode image
    embedding_vector = get_embeddings(img,file_bool=False)

    response = {'message': 'image received. size={}x{}'.format(embedding_vector.shape[1], embedding_vector.shape[0])}
    response_pickled = jsonpickle.encode(response)
    return Response(response=response_pickled, status=200, mimetype="application/json")


if __name__ == '__main__':
    app.run(debug=True, port=5000,use_reloader=False) #run app in debug mode on port 5000