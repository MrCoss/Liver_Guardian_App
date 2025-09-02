# Liver Guardian App

Liver Guardian App is a fullstack application for analyzing and predicting liver-related health conditions. The project integrates a Python backend with a machine learning model and a modern frontend built with React and Tailwind CSS, providing an interactive interface for users to input clinical data and receive predictions.

https://github.com/user-attachments/assets/361a24df-dc8f-4460-9272-bc9e6453d452



---

## Project Structure

```
liver-guardian-app/
│-- backend/                  # Python backend
│   ├-- venv/                 # Virtual environment (ignored)
│   ├-- app.py                # Main backend app
│   ├-- requirements.txt      # Python dependencies
│   └-- RandomForest_best.joblib # Trained ML model (ignored)
│
│-- src/                      # Frontend source code
│   ├-- App.jsx               # Main React component
│   ├-- index.css             # Styling
│   └-- main.jsx              # Frontend entry point
│
│-- public/                   # Public assets
│-- node_modules/             # Node packages (ignored)
│-- dist/                     # Frontend build output (ignored)
│-- .gitignore                # Ignored files
│-- README.md                 # Project documentation
│-- package.json              # Node project config
│-- package-lock.json         # Node lock file
│-- tailwind.config.js        # Tailwind configuration
│-- postcss.config.js         # PostCSS configuration
│-- vite.config.js            # Vite build configuration
```

---

## Features

* Python backend with ML model integration
* React + Tailwind CSS frontend for user interaction
* Predictive analysis for liver conditions
* Structured reports and validation metrics
* Cross-platform support (Windows/Linux/Mac)

---

## Installation

### Backend

1. Navigate to backend folder:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

### Frontend

1. Navigate to project root:

```bash
cd ../
```

2. Install Node dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

---

## Usage

* Open frontend in browser (Vite dev server) to interact with the app.
* Backend endpoints serve predictions using the ML model.
* Frontend sends input data to backend and displays predictions.

---

## Reports

All validation metrics, logs, and outputs are handled in the backend. Any generated files should be excluded from GitHub via `.gitignore`.

---

## Future Enhancements

* Deploy backend API to cloud (AWS/GCP/Heroku)
* Add user authentication
* Implement dynamic dashboards for insights
* Allow retraining models with new data via frontend

---

## Contributing

Fork the repository, create a branch for your feature or fix, and submit a pull request.

---

## License

MIT License. See LICENSE file for details.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
