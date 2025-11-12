# # importing packages
# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from PIL import Image
# from io import BytesIO
# import numpy as np
# import requests
# import uvicorn
# from fastapi.responses import JSONResponse

# app = FastAPI()  # creating FastAPI instance

# @app.get("/")
# def read_root():
#     return {"status": "Tomato Disease Detection API is running!"}

# # allowing requests from port 3000
# origins = [
#     'http://localhost',
#     'http://localhost:3000'
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=['*'],
#     allow_headers=['*']
# )

# # using version name
# endpoint = "http://localhost:8605/v1/models/tomato_disease_detection_model:predict"

# # using version number
# # endpoint = 'http://localhost:8605/v1/models/tomato_disease_detection_model/labels/2:predict'
# # using latest model
# # endpoint = 'http://localhost:8605/v1/models/tomato_disease_detection_model:predict'

# # declaring class names
# class_names = ['Bacterial-spot', 'Early-blight', 'Healthy', 'Late-blight',
#                'Leaf-mold', 'Mosaic-virus', 'Septoria-leaf-spot', 'Yellow-leaf-curl-virus']


# # testing connection
# @app.get('/ping')
# async def ping():  # asynchronous and non-blocking
#     return 'Ready!'


# # predicting image
# @app.post('/predict')
# async def predict(file: UploadFile = File(...)):
#     file_bytes = await file.read()  # preventing blocking
#     img = Image.open(BytesIO(file_bytes))  # converting bytes to image
#     img_array = np.array(img)  # converting image to numpy array
#     img_batch = np.expand_dims(img_array, axis=0)  # creating image batch for prediction

#     # image prediction
#     json_data = {
#         'instances': img_batch.tolist()
#     }
#     response = requests.post(endpoint, json=json_data)
#     try:
#         resp_json = response.json()
#     except Exception as e:
#         print('Error decoding TF-Serving response:', response.text)
#         from fastapi.responses import JSONResponse
#         return JSONResponse(status_code=502, content={'error':'failed to decode TF-Serving response','detail':str(e),'raw':response.text})

#     # support multiple possible response shapes
#     if 'predictions' in resp_json:
#         pred = resp_json['predictions'][0]
#     elif 'outputs' in resp_json:
#         pred = resp_json['outputs'][0]
#     elif 'result' in resp_json:
#         pred = resp_json['result'][0]
#     else:
#         print('Unexpected TF-Serving response:', resp_json)
#         from fastapi.responses import JSONResponse
#         return JSONResponse(status_code=502, content={'error':'unexpected TF-Serving response','raw':resp_json})

#     pred_class = class_names[np.argmax(pred)]  # getting predicted class
#     pred_conf = np.max(pred)  # getting prediction confidence
#     return {
#         'pred_class': pred_class,
#         'pred_conf': float(pred_conf)
#     }


# if __name__ == '__main__':
#     uvicorn.run(app, host='localhost', port=8000)


# importing packages
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from io import BytesIO
import numpy as np
import requests
import uvicorn
import json
import os

app = FastAPI()  # creating FastAPI instance

@app.get("/")
def read_root():
    return {"status": "Tomato Disease Detection API is running!"}

# allowing requests from port 3000
origins = [
    'http://localhost',
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# TensorFlow Serving endpoint
endpoint = "http://localhost:8605/v1/models/tomato_disease_detection_model:predict"

# declaring class names
class_names = [
    'Bacterial-spot',
    'Early-blight',
    'Healthy',
    'Late-blight',
    'Leaf-mold',
    'Mosaic-virus',
    'Septoria-leaf-spot',
    'Yellow-leaf-curl-virus'
]

# load remedies.json file dynamically
REMEDIES_PATH = os.path.join(os.path.dirname(__file__), "newremedies.json")
with open(REMEDIES_PATH, "r") as f:
    remedies_data = json.load(f)

@app.get('/ping')
async def ping():
    return 'Ready!'

@app.post('/predict')
async def predict(file: UploadFile = File(...)):
    file_bytes = await file.read()
    img = Image.open(BytesIO(file_bytes))
    img_array = np.array(img)
    img_batch = np.expand_dims(img_array, axis=0)

    # prepare json data for TensorFlow Serving
    json_data = {'instances': img_batch.tolist()}

    # send to TF-Serving endpoint
    response = requests.post(endpoint, json=json_data)
    try:
        resp_json = response.json()
    except Exception as e:
        print('Error decoding TF-Serving response:', response.text)
        return JSONResponse(
            status_code=502,
            content={
                'error': 'failed to decode TF-Serving response',
                'detail': str(e),
                'raw': response.text
            }
        )

    # handle different prediction key formats
    if 'predictions' in resp_json:
        pred = resp_json['predictions'][0]
    elif 'outputs' in resp_json:
        pred = resp_json['outputs'][0]
    elif 'result' in resp_json:
        pred = resp_json['result'][0]
    else:
        print('Unexpected TF-Serving response:', resp_json)
        return JSONResponse(
            status_code=502,
            content={'error': 'unexpected TF-Serving response', 'raw': resp_json}
        )

    pred_class = class_names[np.argmax(pred)]
    pred_conf = float(np.max(pred))

    # fetch remedy for predicted disease
    remedy = remedies_data.get(pred_class, "No remedy information available.")

    return {
        'pred_class': pred_class,
        'pred_conf': pred_conf,
        'remedy': remedy
    }

if __name__ == '__main__':
    uvicorn.run(app, host='localhost', port=8000)
