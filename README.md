# Sistema de Predicción de Valor de Viviendas en California

## Integrantes del Grupo

| Nombre Completo | Documento de Identidad (C.C) |
| :--- | :--- |
| Andrés Darío Torres Valencia | 1.094.925.522 |
| Mateo Ramírez Ospina | 1.002.592.335 |
| Valentina Corrales Sedas | 1.193.119.474 |
| Juan Camilo Vargas Ospina | 1.193.082.457 |

---

## Descripción del Proyecto

Este proyecto implementa un sistema completo de predicción del valor mediano de viviendas basado en el dataset California Housing (1997).

El sistema está desarrollado como una solución Full-Stack compuesta por:

- Frontend en HTML, CSS y JavaScript.
- API REST construida con Flask que recibe datos desde el frontend y procesa las predicciones.
- Tres modelos de Machine Learning:
  - K-Nearest Neighbors (KNN)
  - Regresión Lineal
  - Red Neuronal Artificial (MLP)

El usuario ingresa características de una vivienda y obtiene una predicción del valor mediano en tiempo real.

---

## Pasos para Desplegar la Aplicación

### 1. Requisitos

- Python 3.9 o superior  
- Pip  
- VS Code (opcional)  
- Extensión Live Server para el frontend  

---

### 2. Instalación de dependencias del backend

Ubicarse en la carpeta backend/ y ejecutar:

```bash
pip install flask flask-cors numpy pandas scikit-learn joblib
```

### 3. Ejecución del servidor Flask

Desde la carpeta backend/ ejecutar:

````bash
python appdate.py
`````

El backend queda disponible en:

http://127.0.0.1:5000/

### 4. Flujo de Predicción
Una vez que el Frontend y el Backend estén activos:

1.  usuario ingresa las variables económicas y demográficas de la vivienda en la interfaz web.

2.  El Frontend envía estos datos en formato JSON a la API de Flask.

3.  Backend realiza la transformación de los datos y la predicción utilizando el modelo seleccionado (cargado desde archivos .pkl).

4.  El resultado es devuelto al Frontend y se muestra en pantalla.




