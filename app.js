/**
 * Clasificador de Animales con Google Teachable Machine
 * URL del modelo: https://teachablemachine.withgoogle.com/models/3DI5L_6Ec/
 */

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/3DI5L_6Ec/";
const modelURL = MODEL_URL + "model.json";
const metadataURL = MODEL_URL + "metadata.json";

// Mapeo de iconos/emojis para las clases del modelo
const CLASS_EMOJIS = {
  "Perros": "🐶",
  "Gatos": "🐱",
  "Conejos": "🐰",
  "Hamsters": "🐹"
};

// Variables de estado
let model = null;
let webcam = null;
let isWebcamRunning = false;
let animationFrameId = null;
let classLabels = [];

// Elementos DOM
const modelStatusEl = document.getElementById("model-status");
const statusTextEl = document.getElementById("status-text");

const tabWebcamBtn = document.getElementById("tab-webcam");
const tabUploadBtn = document.getElementById("tab-upload");
const webcamView = document.getElementById("webcam-view");
const uploadView = document.getElementById("upload-view");

const webcamContainer = document.getElementById("webcam-container");
const webcamPlaceholder = document.getElementById("webcam-placeholder");
const btnToggleWebcam = document.getElementById("btn-toggle-webcam");
const webcamBtnText = document.getElementById("webcam-btn-text");
const webcamBtnIcon = document.getElementById("webcam-btn-icon");

const dropzone = document.getElementById("dropzone");
const dropzoneContent = document.getElementById("dropzone-content");
const fileInput = document.getElementById("file-input");
const btnSelectFile = document.getElementById("btn-select-file");
const btnClearImage = document.getElementById("btn-clear-image");
const imagePreview = document.getElementById("image-preview");

const topPredictionBox = document.getElementById("top-prediction");
const topEmojiEl = topPredictionBox.querySelector(".top-emoji");
const topLabelEl = topPredictionBox.querySelector(".top-label");
const topPercentageEl = topPredictionBox.querySelector(".top-percentage");
const predictionsListEl = document.getElementById("predictions-list");

/**
 * Inicialización de la aplicación
 */
async function initApp() {
  setupTabs();
  setupFileUpload();
  await loadModel();
}

/**
 * Cargar el modelo desde Teachable Machine
 */
async function loadModel() {
  try {
    updateStatus("loading", "Descargando modelo de Teachable Machine...");
    
    // Carga de TensorFlow.js y Teachable Machine
    model = await tmImage.load(modelURL, metadataURL);
    classLabels = model.getClassLabels();
    
    // Construir la lista de barras en el DOM
    buildPredictionList();

    updateStatus("ready", "¡Modelo listo para clasificar!");
    btnToggleWebcam.disabled = false;
    btnToggleWebcam.addEventListener("click", toggleWebcam);
  } catch (error) {
    console.error("Error al cargar el modelo:", error);
    updateStatus("error", "Error al cargar el modelo. Revisa tu conexión a internet.");
  }
}

/**
 * Actualizar el estado visual del modelo
 */
function updateStatus(state, message) {
  modelStatusEl.className = `status-indicator ${state}`;
  statusTextEl.textContent = message;
}

/**
 * Renderizar las barras para cada clase disponible en el modelo
 */
function buildPredictionList() {
  predictionsListEl.innerHTML = "";

  classLabels.forEach((label) => {
    const emoji = CLASS_EMOJIS[label] || "🐾";

    const item = document.createElement("div");
    item.className = "prediction-item";
    item.id = `pred-item-${sanitizeId(label)}`;

    item.innerHTML = `
      <div class="prediction-info">
        <span class="class-title">
          <span class="class-icon">${emoji}</span>
          <span>${label}</span>
        </span>
        <span class="class-percent" id="pred-val-${sanitizeId(label)}">0%</span>
      </div>
      <div class="bar-wrapper">
        <div class="bar-fill" id="pred-bar-${sanitizeId(label)}" style="width: 0%;"></div>
      </div>
    `;

    predictionsListEl.appendChild(item);
  });
}

/**
 * Configurar cambio de pestañas (Cámara / Subir foto)
 */
function setupTabs() {
  tabWebcamBtn.addEventListener("click", () => {
    if (tabWebcamBtn.classList.contains("active")) return;
    tabWebcamBtn.classList.add("active");
    tabUploadBtn.classList.remove("active");
    webcamView.classList.add("active");
    uploadView.classList.remove("active");
  });

  tabUploadBtn.addEventListener("click", () => {
    if (tabUploadBtn.classList.contains("active")) return;
    tabUploadBtn.classList.add("active");
    tabWebcamBtn.classList.remove("active");
    uploadView.classList.add("active");
    webcamView.classList.remove("active");

    // Si la cámara estaba encendida al cambiar de pestaña, pausarla
    if (isWebcamRunning) {
      stopWebcam();
    }
  });
}

/**
 * Alternar encendido / apagado de la cámara web
 */
async function toggleWebcam() {
  if (isWebcamRunning) {
    stopWebcam();
  } else {
    await startWebcam();
  }
}

/**
 * Iniciar la cámara web
 */
async function startWebcam() {
  btnToggleWebcam.disabled = true;
  webcamBtnText.textContent = "Iniciando cámara...";

  try {
    const flip = true; // Efecto espejo
    const width = 360;
    const height = 360;
    
    webcam = new tmImage.Webcam(width, height, flip);
    await webcam.setup(); // Solicitar permiso al usuario
    await webcam.play();

    // Reemplazar marcador por el canvas de la cámara
    webcamPlaceholder.classList.add("hidden");
    
    // Limpiar canvas anteriores si hubiese
    const existingCanvas = webcamContainer.querySelector("canvas");
    if (existingCanvas) existingCanvas.remove();

    webcamContainer.appendChild(webcam.canvas);

    isWebcamRunning = true;
    btnToggleWebcam.disabled = false;
    btnToggleWebcam.classList.remove("btn-primary");
    btnToggleWebcam.classList.add("btn-danger");
    webcamBtnText.textContent = "Detener cámara";
    webcamBtnIcon.textContent = "⏹";

    // Iniciar bucle de predicción
    loopWebcam();
  } catch (err) {
    console.error("Error al iniciar la cámara:", err);
    btnToggleWebcam.disabled = false;
    webcamBtnText.textContent = "Iniciar cámara";
    alert("No se pudo acceder a la cámara web. Asegúrate de otorgar permisos de cámara y que ninguna otra app la esté usando.");
  }
}

/**
 * Detener la cámara web
 */
function stopWebcam() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (webcam) {
    webcam.stop();
  }

  const canvas = webcamContainer.querySelector("canvas");
  if (canvas) canvas.remove();

  webcamPlaceholder.classList.remove("hidden");

  isWebcamRunning = false;
  btnToggleWebcam.classList.remove("btn-danger");
  btnToggleWebcam.classList.add("btn-primary");
  webcamBtnText.textContent = "Iniciar cámara";
  webcamBtnIcon.textContent = "▶";

  resetPredictions();
}

/**
 * Ciclo de predicción continua para la cámara
 */
async function loopWebcam() {
  if (!isWebcamRunning) return;

  webcam.update();
  await predict(webcam.canvas);
  animationFrameId = window.requestAnimationFrame(loopWebcam);
}

/**
 * Configuración de carga y arrastre de imágenes
 */
function setupFileUpload() {
  btnSelectFile.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("click", (e) => {
    if (e.target !== btnClearImage) fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
  });

  // Drag and Drop
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageFile(file);
    }
  });

  btnClearImage.addEventListener("click", (e) => {
    e.stopPropagation();
    clearUploadedImage();
  });
}

/**
 * Procesar archivo de imagen seleccionado
 */
function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    imagePreview.src = event.target.result;
    imagePreview.onload = async () => {
      imagePreview.classList.remove("hidden");
      dropzoneContent.classList.add("hidden");
      btnClearImage.classList.remove("hidden");

      if (model) {
        await predict(imagePreview);
      }
    };
  };
  reader.readAsDataURL(file);
}

/**
 * Limpiar imagen subida y restablecer vista
 */
function clearUploadedImage() {
  fileInput.value = "";
  imagePreview.src = "";
  imagePreview.classList.add("hidden");
  dropzoneContent.classList.remove("hidden");
  btnClearImage.classList.add("hidden");
  resetPredictions();
}

/**
 * Realizar predicción con el modelo
 * @param {HTMLCanvasElement|HTMLImageElement} inputElement
 */
async function predict(inputElement) {
  if (!model) return;

  const predictions = await model.predict(inputElement);
  renderPredictions(predictions);
}

/**
 * Actualizar interfaz con los resultados de la predicción
 */
function renderPredictions(predictions) {
  let highestProb = -1;
  let topClass = null;

  predictions.forEach((p) => {
    const label = p.className;
    const probability = p.probability;
    const percentage = (probability * 100).toFixed(1);

    if (probability > highestProb) {
      highestProb = probability;
      topClass = label;
    }

    const safeId = sanitizeId(label);
    const valEl = document.getElementById(`pred-val-${safeId}`);
    const barEl = document.getElementById(`pred-bar-${safeId}`);
    const itemEl = document.getElementById(`pred-item-${safeId}`);

    if (valEl) valEl.textContent = `${percentage}%`;
    if (barEl) barEl.style.width = `${percentage}%`;

    if (itemEl) {
      if (probability > 0.45 && label === topClass) {
        itemEl.classList.add("winner");
      } else {
        itemEl.classList.remove("winner");
      }
    }
  });

  // Actualizar Tarjeta Principal
  if (topClass && highestProb > 0.3) {
    const emoji = CLASS_EMOJIS[topClass] || "🐾";
    const percentStr = (highestProb * 100).toFixed(1) + "%";
    
    topPredictionBox.classList.remove("empty");
    topEmojiEl.textContent = emoji;
    topLabelEl.textContent = topClass;
    topPercentageEl.textContent = percentStr;
  } else {
    topPredictionBox.classList.add("empty");
    topEmojiEl.textContent = "🐾";
    topLabelEl.textContent = "Baja certeza / Sin detección";
    topPercentageEl.textContent = "--%";
  }
}

/**
 * Restablecer interfaz de predicciones
 */
function resetPredictions() {
  topPredictionBox.classList.add("empty");
  topEmojiEl.textContent = "🐾";
  topLabelEl.textContent = "Esperando entrada...";
  topPercentageEl.textContent = "--%";

  classLabels.forEach((label) => {
    const safeId = sanitizeId(label);
    const valEl = document.getElementById(`pred-val-${safeId}`);
    const barEl = document.getElementById(`pred-bar-${safeId}`);
    const itemEl = document.getElementById(`pred-item-${safeId}`);

    if (valEl) valEl.textContent = "0%";
    if (barEl) barEl.style.width = "0%";
    if (itemEl) itemEl.classList.remove("winner");
  });
}

/**
 * Sanitizar string para usar en IDs HTML
 */
function sanitizeId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

// Iniciar al cargar el DOM
document.addEventListener("DOMContentLoaded", initApp);
