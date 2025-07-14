import express from "express";
import GalleryControllers from "../controllers/GalleryControllers.js";
import userUpload from "../multerConfig/GalleryuserConfig.js";

const router = new express.Router();

// user routes
router.post("/galleryregister", userUpload.array("userimg"), GalleryControllers.ImageUpload);
router.get("/gallerygetUser", GalleryControllers.getUserdata);

export default router;