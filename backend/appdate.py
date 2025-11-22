from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Cargar modelos
knn_model = joblib.load('knn_model.pkl')
reg_model = joblib.load('regression_model.pkl')
mls_model = joblib.load('mlp_model.pkl')

# Columnas esperadas por los modelos
COLUMNAS = [
    'longitude', 'latitude', 'housing_median_age',
    'total_rooms', 'total_bedrooms', 'population',
    'households', 'median_income',
    'ocean_proximity_INLAND',
    'ocean_proximity_ISLAND',
    'ocean_proximity_NEAR BAY',
    'ocean_proximity_NEAR OCEAN'
]

@app.route('/')
def home():
    return "Servidor Flask funcionando"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON recibido"}), 400

    modelo = data.get("modelo")
    features = data.get("features")



    if not modelo or not features:

        return jsonify({"error": "Campos 'modelo' y 'features' requeridos"}), 400

    try:
        # 1️⃣ Convertir features del frontend en DataFrame
        df = pd.DataFrame([features], columns=[
            'longitude', 'latitude', 'housing_median_age',
            'total_rooms', 'total_bedrooms', 'population',
            'households', 'median_income'
        ])

        # 2️⃣ Crear dummies vacías para columnas no enviadas
        for col in COLUMNAS:
            if col not in df.columns:
                df[col] = 0

        # 3️⃣ Reordenar columnas exactamente como espera el modelo
        df = df[COLUMNAS]



        # 4️⃣ Seleccionar modelo
        if modelo == 'knn':
            pred = knn_model.predict(df)[0]
        elif modelo == 'regresion':
            pred = reg_model.predict(df)[0]
        elif modelo == 'mls':
            pred = mls_model.predict(df)[0]
        else:
            return jsonify({"error": "Modelo inválido"}), 400
    

        return jsonify({"prediccion": float(pred)})

    except Exception as e:

        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
