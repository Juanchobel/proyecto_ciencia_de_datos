/* ---------------------------------------------------
   NAVEGACIÓN ENTRE SECCIONES + PERSISTENCIA
--------------------------------------------------- */
const navLinks = document.querySelectorAll('.nav-section');
const sections = document.querySelectorAll('.page-section');

function mostrarSeccion(idSeccion) {
    sections.forEach(sec => {
        sec.classList.toggle('d-none', sec.id !== idSeccion);
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === idSeccion);
    });
}

// Guardar sección al navegar
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const destino = link.dataset.section;
        mostrarSeccion(destino);
        localStorage.setItem("seccionActiva", destino);
    });
});

// Recuperar sección activa al recargar
const ultima = localStorage.getItem("seccionActiva");
mostrarSeccion(ultima ? ultima : "inicio");


/* ---------------------------------------------------
   WIZARD DE MODELOS
--------------------------------------------------- */
let pasoActual = 1;

const etiquetaPaso = document.getElementById('etiqueta-paso');

const pillPaso1 = document.getElementById('pill-paso-1');
const pillPaso2 = document.getElementById('pill-paso-2');
const pillPaso3 = document.getElementById('pill-paso-3');

const vistaPaso1 = document.getElementById('paso-1');
const vistaPaso2 = document.getElementById('paso-2');
const vistaPaso3 = document.getElementById('paso-3');

const selectModelo = document.getElementById('select-modelo');

const inputMedInc = document.getElementById('input-medinc');
const inputHouseAge = document.getElementById('input-houseage');
const inputAveRooms = document.getElementById('input-averooms');
const inputAveBedrms = document.getElementById('input-avebedrms');
const inputPopulation = document.getElementById('input-population');
const inputAveOccup = document.getElementById('input-aveoccup');
const inputLatitude = document.getElementById('input-latitude');
const inputLongitude = document.getElementById('input-longitude');

const resumenEntrada = document.getElementById('resumen-entrada');
const resultadoPrediccion = document.getElementById('resultado-prediccion');

const btnPaso1Siguiente = document.getElementById('btn-paso-1-siguiente');
const btnPaso2Atras = document.getElementById('btn-paso-2-atras');
const btnPaso2Siguiente = document.getElementById('btn-paso-2-siguiente');
const btnPaso3Atras = document.getElementById('btn-paso-3-atras');
const btnCalcular = document.getElementById('btn-calcular');

function actualizarWizard() {

    [vistaPaso1, vistaPaso2, vistaPaso3].forEach(v => {
        v.classList.add('d-none');
        v.classList.remove('fade-step');
    });

    const vistas = {1: vistaPaso1, 2: vistaPaso2, 3: vistaPaso3};
    const vistaActual = vistas[pasoActual];
    vistaActual.classList.remove('d-none');
    vistaActual.classList.add('fade-step');

    etiquetaPaso.textContent =
        pasoActual === 1 ? "Paso 1 de 3: Selección del modelo" :
        pasoActual === 2 ? "Paso 2 de 3: Ingreso de variables" :
                           "Paso 3 de 3: Predicción";

    pillPaso1.className = "nav-link wizard-pill";
    pillPaso2.className = "nav-link wizard-pill";
    pillPaso3.className = "nav-link wizard-pill";

    if (pasoActual === 1) {
        pillPaso1.classList.add('active');
    }
    if (pasoActual === 2) {
        pillPaso1.classList.add('done');
        pillPaso2.classList.add('active');
    }
    if (pasoActual === 3) {
        pillPaso1.classList.add('done');
        pillPaso2.classList.add('done');
        pillPaso3.classList.add('active');
    }
}

actualizarWizard();


/* ---------------------------------------------------
   ACCIONES DE LOS BOTONES DEL WIZARD
--------------------------------------------------- */

btnPaso1Siguiente.addEventListener("click", () => {
    if (!selectModelo.value) {
        alert("Seleccione un modelo antes de continuar.");
        return;
    }
    pasoActual = 2;
    actualizarWizard();
});


btnPaso2Atras.addEventListener("click", () => {
    pasoActual = 1;
    actualizarWizard();
});


btnPaso2Siguiente.addEventListener("click", () => {
    const campos = [
        inputMedInc, inputHouseAge, inputAveRooms, inputAveBedrms,
        inputPopulation, inputAveOccup, inputLatitude, inputLongitude
    ];

    let valid = true;

    campos.forEach(c => {
        if (!c.value || isNaN(c.value)) {
            c.classList.add('input-error');
            c.classList.remove('input-ok');
            valid = false;
        } else {
            c.classList.add('input-ok');
            c.classList.remove('input-error');
        }
    });

    if (!valid) {
        alert("Por favor completa correctamente todos los campos.");
        return;
    }

    const datos = {
        modelo: selectModelo.value,
        MedInc: parseFloat(inputMedInc.value),
        HouseAge: parseFloat(inputHouseAge.value),
        AveRooms: parseFloat(inputAveRooms.value),
        AveBedrms: parseFloat(inputAveBedrms.value),
        Population: parseFloat(inputPopulation.value),
        AveOccup: parseFloat(inputAveOccup.value),
        Latitude: parseFloat(inputLatitude.value),
        Longitude: parseFloat(inputLongitude.value)
    };

    resumenEntrada.textContent = JSON.stringify(datos, null, 2);

    pasoActual = 3;
    actualizarWizard();
});


btnPaso3Atras.addEventListener("click", () => {
    pasoActual = 2;
    actualizarWizard();
});


/* ---------------------------------------------------
   CONEXIÓN REAL AL BACKEND (Flask)
--------------------------------------------------- */

btnCalcular.addEventListener("click", () => {

    const modeloSeleccionado = selectModelo.value;

    const features = [
    parseFloat(inputLongitude.value),      // longitude  
    parseFloat(inputLatitude.value),       // latitude  
    parseFloat(inputHouseAge.value),       // housing_median_age  
    parseFloat(inputAveRooms.value),       // total_rooms  
    parseFloat(inputAveBedrms.value),      // total_bedrooms  
    parseFloat(inputPopulation.value),     // population  
    parseFloat(inputAveOccup.value),       // households  
    parseFloat(inputMedInc.value)          // median_income  
];


    resultadoPrediccion.className = "alert alert-secondary";
    resultadoPrediccion.textContent = "Calculando predicción en el servidor...";

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            modelo: modeloSeleccionado,
            features: features
        })
    })
    .then(r => r.json())
    .then(data => {

        if (data.error) {
            resultadoPrediccion.className = "alert alert-danger";
            resultadoPrediccion.textContent = "Error: " + data.error;
            return;
        }

        const valor = Number(data.prediccion);

        resultadoPrediccion.className = "alert alert-info";
        resultadoPrediccion.innerHTML = `
            <strong>Predicción del modelo</strong><br>
            Modelo utilizado: <code>${modeloSeleccionado}</code><br>
            Valor estimado de la vivienda: 
            <strong>$ ${valor.toFixed(0)}</strong>
        `;
    })
    .catch(error => {
        resultadoPrediccion.className = "alert alert-danger";
        resultadoPrediccion.textContent = "No se pudo conectar con el servidor.";
    });

});
