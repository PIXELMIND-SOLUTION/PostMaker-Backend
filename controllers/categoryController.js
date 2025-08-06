import { Category, DueDate } from "../models/categoryModel.js";
import Banner from "../models/bannerModel.js";
import Container from '../models/containerModel.js';
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



// ➕ Create Container
export const createContainer = async (req, res) => {
  try {
    const { name, link } = req.body;
    const file = req.file;

    if (!name || !link || !file) {
      return res.status(400).json({ success: false, message: "Name, link, and image are required." });
    }

    const uploaded = await cloudinary.uploader.upload(file.path, { folder: "containers" });
    fs.unlinkSync(file.path); // delete local file

    const container = await Container.create({
      name,
      link,
      imageUrl: uploaded.secure_url
    });

    res.status(201).json({ success: true, data: container });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📥 Get All Containers
export const getAllContainers = async (req, res) => {
  try {
    const containers = await Container.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: containers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📥 Get Single Container by ID
export const getContainerById = async (req, res) => {
  try {
    const container = await Container.findById(req.params.id);
    if (!container) return res.status(404).json({ message: "Container not found" });
    res.status(200).json({ success: true, data: container });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Container
export const updateContainer = async (req, res) => {
  try {
    const { name, link } = req.body;
    const file = req.file;
    const container = await Container.findById(req.params.id);

    if (!container) return res.status(404).json({ message: "Container not found" });

    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path, { folder: "containers" });
      fs.unlinkSync(file.path);
      container.imageUrl = uploaded.secure_url;
    }

    if (name) container.name = name;
    if (link) container.link = link;

    await container.save();

    res.status(200).json({ success: true, data: container });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ❌ Delete Container
export const deleteContainer = async (req, res) => {
  try {
    const container = await Container.findByIdAndDelete(req.params.id);
    if (!container) return res.status(404).json({ message: "Container not found" });
    res.status(200).json({ success: true, message: "Container deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
