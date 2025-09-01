import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import gdown
import traceback
import logging
import sys

# ---------------------------------------------------
# Configuration & Logging
# ---------------------------------------------------
MODEL_PATH = os.getenv("MODEL_PATH", "RandomForest_best.joblib")  # Local model path
MODEL_URL = os.getenv(
    "MODEL_URL",
    "https://drive.google.com/uc?export=download&id=1UR6hvy_tcW7lThVYMA49PMB2EsZmw8OU"
)

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
)

app = Flask(__name__)

# Allow only React dev server for CORS
CORS(app, resources={r"/predict": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})

model = None

# ---------------------------------------------------
# Model Loader
# ---------------------------------------------------
def download_and_load_model(force_reload=False):
    """Loads model from disk or downloads if missing."""
    global model
    try:
        if not os.path.exists(MODEL_PATH) or force_reload:
            logging.info(f"⬇️ Downloading model to {MODEL_PATH}...")
            gdown.download(MODEL_URL, MODEL_PATH, quiet=False)
            logging.info("✅ Model downloaded successfully.")

        model = joblib.load(MODEL_PATH)
        logging.info("✅ Model loaded into memory.")
    except Exception as e:
        logging.error(f"❌ Could not load model: {e}")
        logging.debug(traceback.format_exc())
        model = None


# ---------------------------------------------------
# Routes
# ---------------------------------------------------
@app.route("/")
def home():
    return jsonify({"message": "✅ LiverGuardian API is running!"})


@app.route("/predict", methods=["POST"])
def predict():
    global model
    if model is None:
        logging.error("Prediction requested but model is not loaded.")
        return jsonify({"error": "Model is not loaded on the server."}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request: No JSON body received."}), 400

        logging.info(f"Incoming data: {data}")

        all_feature_names = [
            "Age", "Ascites", "Hepatomegaly", "Spiders", "Edema", "Bilirubin",
            "Cholesterol", "Albumin", "Copper", "Alk_Phos", "SGOT",
            "Tryglicerides", "Platelets", "Prothrombin", "Status_C", "Status_CL",
            "Status_D", "Drug_D-penicillamine", "Drug_Placebo", "Sex_F", "Sex_M"
        ]

        input_df = pd.DataFrame([data])
        input_df_encoded = pd.get_dummies(input_df)
        input_df_aligned = input_df_encoded.reindex(columns=all_feature_names, fill_value=0)

        prediction = model.predict(input_df_aligned)
        predicted_stage = int(prediction[0])

        logging.info(f"✅ Prediction result: {predicted_stage}")
        return jsonify({"predicted_stage": predicted_stage})

    except Exception as e:
        logging.error(f"❌ Prediction error: {e}")
        logging.debug(traceback.format_exc())
        return jsonify({"error": "An unexpected server error occurred."}), 500


# ---------------------------------------------------
# App Startup
# ---------------------------------------------------
if __name__ == "__main__":
    download_and_load_model()
    if model is None:
        logging.critical("❌ Model failed to load. Shutting down server.")
        sys.exit(1)

    logging.info("🚀 Starting Flask server on port 8080...")
    app.run(host="0.0.0.0", port=8080, debug=False)
