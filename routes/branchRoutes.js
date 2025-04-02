import express from "express";
import {getAllBranches,createBranch,updateBranch,deleteBranch,getBranchById} from "../controllers/branchController.js";

const branchRouter = express.Router();

branchRouter.get("/list",getAllBranches);
branchRouter.get("/:id",getBranchById);
branchRouter.post("/add",createBranch);
branchRouter.put("/update/:id",updateBranch);
branchRouter.delete("/delete/:id",deleteBranch);
export default branchRouter;
