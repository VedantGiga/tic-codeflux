import { Router } from "express";
import {
  getPatients,
  createPatient,
  getPatient,
  getPatientByNumber,
  updatePatient,
  deletePatient,
} from "../controllers/patients.controller.js";
import {
  getMedicines,
  createMedicine,
  createMedicinesBatch,
  updateMedicine,
  deleteMedicine,
  getPatientDashboard,
} from "../controllers/medicines.controller.js";
import { getPatientLogs } from "../controllers/logs.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/", getPatients);
router.post("/", createPatient);
router.get("/number/:patientNumber", getPatientByNumber);
router.get("/:patientId", getPatient);
router.put("/:patientId", updatePatient);
router.delete("/:patientId", deletePatient);

router.get("/:patientId/dashboard", getPatientDashboard);
router.get("/:patientId/logs", getPatientLogs);
router.get("/:patientId/medicines", getMedicines);
router.post("/:patientId/medicines", createMedicine);
router.post("/:patientId/medicines/batch", createMedicinesBatch);
router.put("/:patientId/medicines/:medicineId", updateMedicine);
router.delete("/:patientId/medicines/:medicineId", deleteMedicine);

export default router;
