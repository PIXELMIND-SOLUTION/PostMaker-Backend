import express from "express";
import multer from "multer";
import {
    createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
   createDueDate,
  getAllDueDates,
  getDueDateById,
  updateDueDateById,
  deleteDueDateById,
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/categoryController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* ----------------------------- CATEGORY ROUTES ----------------------------- */
router.post("/category", upload.single("image"), createCategory);
router.get("/category", getAllCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", upload.single("image"), updateCategory);
router.delete("/category/:id", deleteCategory);

/* ----------------------------- DUEDATE ROUTES ----------------------------- */
// ➕ CREATE DueDate (with image)
router.post("/due-date", upload.single("image"), createDueDate );

// 📥 GET All DueDates
router.get("/due-date", getAllDueDates );

// 📥 GET DueDate by ID
router.get("/due-date/:id", getDueDateById );

// 📝 UPDATE DueDate by ID (with optional image)
router.put("/due-date/:id", upload.single("image"), updateDueDateById );

// ❌ DELETE DueDate by ID
router.delete("/due-date/:id", deleteDueDateById);
/* ----------------------------- BANNER ROUTES ----------------------------- */
router.post("/banner", upload.array("bannerImage", 10), createBanner);
router.get("/banner", getAllBanners);
router.get("/banner/:id", getBannerById);
router.put("/banner/:id", upload.array("bannerImage", 10), updateBanner);
router.delete("/banner/:id", deleteBanner);

export default router;
