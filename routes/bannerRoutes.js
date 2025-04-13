import express from "express";
import multer from "multer";
import { getAllSlides, createSlide, deleteSlide, updateSlide } from "../controllers/SlideBanner.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

router.get("/", getAllSlides);
router.post("/add", upload.single("image"), createSlide);
router.delete("/delete/:id", deleteSlide);
router.put("/update/:id", updateSlide);

export default router;
