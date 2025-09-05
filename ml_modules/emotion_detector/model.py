from tensorflow.keras.models import load_model


def load_emotion_model(path="ml_modules/emotion_detector/emotion_model.h5"):
    try:
        model = load_model(path)
        return model
    except Exception as e:
        print("Error loading model:", e)
        return None
