from .utils import preprocess_face
from .model import load_emotion_model
import numpy as np

# List of emotion labels from the FER-2013 dataset
EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]


def predict_emotion(image_path):
    model = load_emotion_model()
    if model is None:
        return "Model not loaded", 0.0

    face = preprocess_face(image_path)
    if face is None:
        return "No face detected", 0.0

    preds = model.predict(face)[0]
    top = np.argmax(preds)
    return EMOTIONS[top], float(preds[top])
