import express from "express";
import {
  createCharger,
  getAllChargers,
  updateCharger,
  deleteCharger,
} from "../controllers/chargerController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware); // Protect all below routes
router.post("/", createCharger);
router.get("/", getAllChargers);
router.put("/:id", updateCharger);
router.delete("/:id", deleteCharger);

export default router;
