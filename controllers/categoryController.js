import { Category, DueDate } from "../models/categoryModel.js";
import Banner from "../models/bannerModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ➕ Create Category
export const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const file = req.file;
    if (!categoryName || !file) {
      return res.status(400).json({ message: "Category name and image are required." });
    }

    const uploaded = await cloudinary.uploader.upload(file.path, { folder: "categories" });
    fs.unlinkSync(file.path); // delete local file

    const category = await Category.create({
      categoryName,
      imageUrl: uploaded.secure_url,
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📥 Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📥 Get Single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Category
export const updateCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const file = req.file;
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ message: "Category not found" });

    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path, { folder: "categories" });
      fs.unlinkSync(file.path);
      category.imageUrl = uploaded.secure_url;
    }

    if (categoryName) category.categoryName = categoryName;

    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ❌ Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------------------- Banner ---------------------------- */

// ➕ Create banner with multiple images
export const createBanner = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    const uploadedImages = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'banners'
      });
      uploadedImages.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    const newBanner = await Banner.create({ bannerImage: uploadedImages });

    res.status(201).json({ success: true, message: "Banner uploaded", data: newBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📥 Get all banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📥 Get banner by ID
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update banner images (replace with new images)
export const updateBanner = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "New images are required" });
    }

    const uploadedImages = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'banners'
      });
      uploadedImages.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { bannerImage: uploadedImages },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({ success: true, message: "Banner updated", data: updatedBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------------------- DueDate ---------------------------- */

// ➕ Create DueDate
export const createDueDate = async (req, res) => {
  try {
    const { dueDate } = req.body;
    const file = req.file?.path;
    if (!file || !dueDate) {
      return res.status(400).json({ success: false, message: "Image and due date are required." });
    }

    const uploadedImage = await cloudinary.uploader.upload(file, {
      folder: "dueDates"
    });
    fs.unlinkSync(file);

    const newDueDate = await DueDate.create({
      image: uploadedImage.secure_url,
      dueDate
    });

    res.status(201).json({ success: true, data: newDueDate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllDueDates = async (req, res) => {
  try {
    const dueDates = await DueDate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: dueDates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getDueDateById = async (req, res) => {
  try {
    const dueDate = await DueDate.findById(req.params.id);
    if (!dueDate) {
      return res.status(404).json({ success: false, message: "DueDate not found" });
    }
    res.status(200).json({ success: true, data: dueDate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateDueDateById = async (req, res) => {
  try {
    const { dueDate } = req.body;
    const file = req.file?.path;

    const updateData = {};

    if (dueDate) updateData.dueDate = dueDate;

    if (file) {
      const uploadedImage = await cloudinary.uploader.upload(file, {
        folder: "dueDates"
      });
      fs.unlinkSync(file);
      updateData.image = uploadedImage.secure_url;
    }

    const updated = await DueDate.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "DueDate not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteDueDateById = async (req, res) => {
  try {
    const deleted = await DueDate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "DueDate not found" });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
