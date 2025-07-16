const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController");
const upload = require("../utils/uploadMiddleware");

router.post("/category", upload.single("image"), controller.createCategory);
router.get("/category", controller.getAllCategories);


router.post('/logo', upload.single('logoImage'),controller.createLogo);
router.get('/logo', controller.getAllLogos);
router.get('/logo/:id', controller.getLogoById);
router.put('/logo/:id',upload.single('logoImage'), controller.updateLogo);
router.delete('/logo/:id', controller.deleteLogo);



router.post("/banner", upload.single("bannerImage"), controller.createBanner);
router.get("/banner", controller.getAllBanners);
router.get("/banner/:id",controller.getBannerById);
router.put("/banner/:id", upload.single("bannerImage"),controller.updateBanner);
router.delete("/banner/:id", controller.deleteBanner);

module.exports = router;
