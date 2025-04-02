import express from "express";
import { getAllServices, createService, deleteService, getServiceById, updateService } from "../controllers/serviceController.js";

const serviceRouter = express.Router();

serviceRouter.get("/", getAllServices);
serviceRouter.get("/:id", getServiceById);
serviceRouter.post("/add", createService);
serviceRouter.put("/update/:id", updateService);
serviceRouter.delete("/delete/:id", deleteService);
export default serviceRouter;