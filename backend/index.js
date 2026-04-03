import express from "express";
import cors from "cors";
import morgan from "morgan";
import firebaseApp from "./firebase.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Main route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Tic-Codeflux Backend Service!",
    firebase_status: "Initialized using environment credentials."
  });
});

// Example route using Firebase
app.get("/health-check", (req, res) => {
  res.json({
    status: "Healthy",
    time: new Date().toISOString(),
    firebase_app_name: firebaseApp.name
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health-check`);
});
