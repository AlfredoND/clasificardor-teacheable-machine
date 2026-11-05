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
- **Optimizado para producción con Vite:** Código minificado y empaquetado en la carpeta `dist/`.

---

## 🛠️ Comandos de desarrollo y Build

El proyecto cuenta con scripts configurados para desarrollo y producción:

### 1. Generar la build de producción
```bash
npm run build
```
Genera la carpeta optimizada y lista para desplegar en `dist/` (compatible automáticamente con Vercel, Netlify, GitHub Pages, etc.).

### 2. Previsualizar la build de producción
```bash
npm run preview
```

### 3. Servidor de desarrollo
```bash
npm run dev
```

---

## 🚀 Despliegue en Vercel

1. Sube tu proyecto a GitHub (o ejecuta `npx vercel`).
2. Si lo conectas en la plataforma web de Vercel:
   - **Framework Preset**: *Vite*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. ¡Tu sitio estará listo en HTTPS con acceso automático a la cámara web!
