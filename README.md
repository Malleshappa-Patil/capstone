# Enhancing Agricultural Productivity with AI-Based Tomato Leaf Disease Prediction

This repository contains two user-facing clients and a shared prediction backend:

- `web-page/` – React web dashboard for uploading tomato leaf images.
- `app-page/` – Expo/React Native mobile application.
- `apis/local/` – FastAPI service that forwards images to the TensorFlow Serving model in `models/`.

Both clients expect the FastAPI service to be reachable; run it once and then choose the client you want to launch.

## 1. Start the Prediction API (required for both clients)

1. Open a terminal and install Python dependencies:
	```bash
	cd apis/local
	pip install -r requirements.txt
	```
2. Run the API so it is reachable on your LAN:
	```bash
	uvicorn main:app --host 0.0.0.0 --port 8001 --reload
	```
3. Note the machine’s IP address (for example `http://<your-ip>:8001`). Both the web and mobile apps must point to this URL.

> **Tip:** The API exposes `/ping` for quick health checks.

## 2. Run the Web Client (`web-page/`)

1. In a new terminal, install dependencies:
	```bash
	cd web-page
	npm install
	```
2. Configure the API endpoint (optional if default `http://localhost:8000/predict` works for your setup). Update `src/home.js` or add an environment variable so that `API_URL` matches the FastAPI host (`http://<your-ip>:8001/predict`).
3. Start the development server:
	```bash
	npm start
	```
4. Visit the URL printed in the terminal (typically `http://localhost:3000`) and upload a tomato leaf image. The page shows prediction details and remedies once the backend responds.

## 3. Run the Mobile App (`app-page/`)

1. Install dependencies:
	```bash
	cd app-page
	npm install
	```
2. Copy the sample environment file and point it to the FastAPI host:
	```bash
	cp .env.example .env
	# edit EXPO_PUBLIC_API_BASE_URL=http://<your-ip>:8001
	```
3. Start Expo:
	```bash
	npm run start
	```
4. Scan the QR code with Expo Go (or press `i`/`a` for the iOS/Android simulators). The app runs a `/ping` check; once the banner indicates the API is reachable, select a tomato leaf image to obtain predictions.

> **Note:** Ensure your phone/emulator and the machine running FastAPI share the same network.

## Troubleshooting

- If uploads fail with “Network request failed,” confirm the API URL matches your LAN IP and that port `8001` is open.
- Run `npm run lint` inside `app-page/` to verify React Native code quality.
- TensorFlow Serving artifacts live under `models/`; make sure the server process configured in `apis/local/main.py` can reach them.

