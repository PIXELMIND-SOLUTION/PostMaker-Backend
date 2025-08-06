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
  createContainer,
  getAllContainers,
  getContainerById,
  updateContainer,
  deleteContainer
} from "../controllers/categoryController.js";

import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';

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

router.post("/container", upload.single("image"), createContainer);
router.get("/container", getAllContainers);
router.get("/container/:id", getContainerById);
router.put("/container/:id", upload.single("image"), updateContainer);
router.delete("/container/:id", deleteContainer);

router.post('/job', upload.single('image'), createJob);
router.get('/job', getAllJobs);
router.get('/job/:id', getJobById);
router.put('/job/:id', upload.single('image'), updateJob);
router.delete('/job/:id', deleteJob);

export default router;
