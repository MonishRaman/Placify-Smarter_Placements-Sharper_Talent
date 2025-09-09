import cv2
import numpy as np


def preprocess_face(image_path):
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    if len(faces) == 0:
        return None
    (x, y, w, h) = faces[0]
    face = gray[y : y + h, x : x + w]
    face = cv2.resize(face, (48, 48)) / 255.0
    return np.expand_dims(face, axis=(0, -1))
