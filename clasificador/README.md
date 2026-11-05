# Clasificador de Animales con Teachable Machine

Sitio web simple y moderno (HTML, CSS y JavaScript) que utiliza un modelo de visión por computadora entrenado en **Google Teachable Machine**.

## 🔗 Modelo utilizado
- **URL del Modelo:** `https://teachablemachine.withgoogle.com/models/3DI5L_6Ec/`
- **Clases reconocidas:**
  - 🐶 **Perros**
  - 🐱 **Gatos**
  - 🐰 **Conejos**
  - 🐹 **Hamsters**

---

## ✨ Características
- **Cámara web en tiempo real:** Clasificación continua frame a frame.
- **Subida de fotos / Arrastrar y soltar (Drag & Drop):** Permite seleccionar o arrastrar imágenes estáticas (JPG, PNG, WebP) desde tu dispositivo.
- **Visualización interactiva:**
  - Indicador de estado de carga del modelo.
  - Tarjeta destacada con el animal detectado y su porcentaje de confianza.
  - Barras de progreso animadas para cada una de las 4 clases.
- **Diseño responsivo:** Funciona perfectamente en computadoras de escritorio y dispositivos móviles.

---

## 🚀 Cómo ejecutar el proyecto

### Opción 1: Con un servidor local (Recomendado para usar la cámara web)
Los navegadores modernos restringen el acceso a la cámara web a entornos seguros (`http://localhost` o `https://`). Para habilitar la cámara, puedes iniciar un servidor local rápido con Python:

1. Abre una terminal en esta carpeta (`c:\Users\osn.lab603\Downloads\clasificador`).
2. Ejecuta:
   ```bash
   python -m http.server 8000
   ```
3. Abre tu navegador en:
   [http://localhost:8000](http://localhost:8000)

### Opción 2: Abrir directamente `index.html`
Si solo deseas probar clasificando imágenes desde tu disco (sin cámara web):
- Haz doble clic sobre el archivo `index.html` para abrirlo directamente en tu navegador (Chrome, Edge, Firefox, Safari).

---

## 📁 Estructura de archivos
- [`index.html`](index.html): Estructura del sitio web y carga de librerías TensorFlow.js y Teachable Machine.
- [`style.css`](style.css): Estilos modernos, diseño responsivo, animaciones y temas.
- [`app.js`](app.js): Lógica de conexión con el modelo, gestión de la cámara web, arrastre de archivos y renderizado de resultados.
