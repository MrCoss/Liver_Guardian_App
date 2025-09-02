import os
import sys
import logging
import traceback
import joblib
import gdown
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# ---------------------------------------------------
# Configuration & Logging
# ---------------------------------------------------

# Define the local path for the model and its Google Drive URL
MODEL_PATH = os.getenv("MODEL_PATH", "RandomForest_best.joblib")
MODEL_URL = os.getenv(
    "MODEL_URL",
    "https://drive.google.com/uc?export=download&id=1UR6hvy_tcW7lThVYMA49PMB2EsZmw8OU"
)

# Set up clean, informative logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# --- App Initialization ---
app = Flask(__name__)
# Allow requests only from your React app's development server
CORS(app, resources={r"/predict": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})
model = None

# ---------------------------------------------------
# Model Loader
# ---------------------------------------------------

def download_and_load_model(force_reload=False):
    """
    Loads the model from the local disk. If it doesn't exist or if force_reload is True,
    it downloads the model from Google Drive first.
    """
    global model
    try:
        if not os.path.exists(MODEL_PATH) or force_reload:
            logging.info(f"⬇️ Model not found locally. Downloading to {MODEL_PATH}...")
            gdown.download(MODEL_URL, MODEL_PATH, quiet=False)
            logging.info("✅ Model downloaded successfully.")

        model = joblib.load(MODEL_PATH)
        logging.info("✅ Model loaded into memory successfully.")
    except Exception as e:
        logging.error(f"❌ Critical error loading model: {e}")
        logging.debug(traceback.format_exc())
        model = None

# ---------------------------------------------------
# API Routes
# ---------------------------------------------------

@app.route("/")
def home():
    """A simple health-check endpoint to confirm the API is running."""
    return jsonify({"status": "ok", "message": "LiverGuardian API is active and ready."})

@app.route("/predict", methods=["POST"])
def predict():
    """
    Receives patient data, preprocesses it for the model,
    and returns a cirrhosis stage prediction.
    """
    global model
    if model is None:
        logging.error("Prediction requested but model is not loaded.")
        return jsonify({"error": "Model is not available on the server."}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request: No JSON data received."}), 400

        logging.info(f"➡️ Received prediction request with data: {data}")

        # The exact list of one-hot encoded columns the model was trained on.
        # This is crucial for consistent predictions.
        all_feature_names = [
            "Age", "Ascites", "Hepatomegaly", "Spiders", "Edema", "Bilirubin",
            "Cholesterol", "Albumin", "Copper", "Alk_Phos", "SGOT",
            "Tryglicerides", "Platelets", "Prothrombin", "Status_C", "Status_CL",
            "Status_D", "Drug_D-penicillamine", "Drug_Placebo", "Sex_F", "Sex_M"
        ]

        # Convert incoming JSON to a pandas DataFrame
        input_df = pd.DataFrame([data])
        # Perform one-hot encoding on categorical features
        input_df_encoded = pd.get_dummies(input_df)
        # Align columns to match the model's training data, filling missing ones with 0
        input_df_aligned = input_df_encoded.reindex(columns=all_feature_names, fill_value=0)
        
        # Make the prediction
        prediction = model.predict(input_df_aligned)
        predicted_stage = int(prediction[0])

        logging.info(f"⬅️ Prediction successful. Predicted Stage: {predicted_stage}")
        return jsonify({"predicted_stage": predicted_stage})

    except Exception as e:
        logging.error(f"❌ An error occurred during prediction: {e}")
        logging.debug(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred."}), 500

# ---------------------------------------------------
# Application Startup
# ---------------------------------------------------

if __name__ == "__main__":
    download_and_load_model()
    if model is None:
        logging.critical("❌ Model could not be loaded. The application cannot start.")
        sys.exit(1)

    port = int(os.environ.get("PORT", 8080))
    logging.info(f"🚀 Starting Flask server on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)