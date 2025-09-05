import librosa


def analyze_prosody(audio_path):
    y, sr = librosa.load(audio_path)

    pitch = librosa.yin(y, fmin=50, fmax=300)
    energy = librosa.feature.rms(y=y).mean()

    return {
        "avg_pitch": float(pitch.mean()),
        "pitch_variance": float(pitch.std()),
        "energy": float(energy),
    }
