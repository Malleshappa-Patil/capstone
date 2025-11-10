# importing packages
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import numpy as np
import requests
import uvicorn
import json
import os

# ✅ FastAPI app instance
app = FastAPI(title="Tomato Disease Detection API")

# ✅ Allowing requests from frontend
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ TensorFlow Serving endpoint (explicitly version 2)
endpoint = "http://localhost:8605/v1/models/tomato_disease_detection_model/versions/2:predict"

# ✅ Class names (exact training order)
CLASS_NAMES = [
    "Bacterial-spot",
    "Early-blight",
    "Healthy",
    "Late-blight",
    "Leaf-mold",
    "Mosaic-virus",
    "Septoria-leaf-spot",
    "Yellow-leaf-curl-virus",
]

# ✅ Remedies file path (optional)
REMEDIES_PATH = os.path.join(os.path.dirname(__file__), "remedies.json")
try:
    with open(REMEDIES_PATH, "r") as f:
        remedies_data = json.load(f)
        print(f"✅ remedies.json loaded successfully from: {REMEDIES_PATH}")
except Exception as e:
    remedies_data = {}
    print(f"⚠️ Error loading remedies.json: {e}")


# ✅ Image preprocessing
def preprocess_image(image: Image.Image):
    """
    Resize, normalize, and prepare image for TensorFlow Serving.
    Ensures type consistency and avoids JSON serialization bugs.
    """
    image = image.convert("RGB")
    image = image.resize((224, 224))
    img_array = np.asarray(image, dtype=np.float32) / 255.0
    # Optionally add mean/std normalization if model trained that way:
    # img_array = (img_array - 0.5) / 0.5
    img_batch = np.expand_dims(img_array, axis=0)
    return img_batch.tolist()


# ✅ Health check
@app.get("/ping")
async def ping():
    """Check backend + TensorFlow Serving health."""
    try:
        resp = requests.get("http://localhost:8605/v1/models/tomato_disease_detection_model")
        info = resp.json()
    except Exception:
        info = {"error": "TensorFlow Serving not reachable"}
    return {"status": "Backend OK", "tf_serving": info}


# ✅ Predict endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        img = Image.open(BytesIO(file_bytes))
        img_batch = preprocess_image(img)

        # Send request to TensorFlow Serving
        payload = {"instances": img_batch}
        response = requests.post(endpoint, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"TF Serving Error: {response.text}")

        data = response.json()
        if "predictions" not in data:
            raise HTTPException(status_code=500, detail="Invalid model response")

        predictions = np.array(data["predictions"][0], dtype=np.float32)

        # sanity check for uniform outputs
        if np.allclose(predictions, predictions[0], atol=1e-6):
            print("⚠️ Model returned uniform probabilities; check model integrity or input format.")

        pred_idx = int(np.argmax(predictions))
        pred_class = CLASS_NAMES[pred_idx]
        pred_conf = float(np.max(predictions))
        remedy_info = remedies_data.get(pred_class, {"note": "No remedy found"})

        print(f"🔍 Predictions: {predictions}")
        print(f"✅ Class: {pred_class}, Confidence: {pred_conf}")

        return {
            "pred_class": pred_class,
            "pred_conf": round(pred_conf, 4),
            "remedy": remedy_info,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Diagnostic endpoint (optional)
@app.get("/debug_model")
async def debug_model():
    """Returns info from TensorFlow Serving to verify version and status."""
    try:
        resp = requests.get("http://localhost:8605/v1/models/tomato_disease_detection_model")
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reach TF Serving: {e}")


# ✅ Run app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
