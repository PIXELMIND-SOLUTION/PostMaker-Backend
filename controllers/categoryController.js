const Category = require("../models/categoryModel");
const Logo =require('../models/logModel')
const Banner = require("../models/bannerModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Image is required" });

    const uploaded = await cloudinary.uploader.upload(file.path, { folder: "categories" });
    fs.unlinkSync(file.path);

    const category = await Category.create({ categoryName, imageUrl: uploaded.secure_url });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // ✅ Mongoose method
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    console.error('❌ Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Create Logo Category
exports.createLogo = async (req, res) => {
  try {
    const { categoryName, logoName } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ success: false, message: 'logoImage is required' });

    const uploaded = await cloudinary.uploader.upload(file.path, { folder: 'logos' });
    fs.unlinkSync(file.path);

    const newLogo = await Logo.create({
      categoryName,
      logoName,
      logoImage: uploaded.secure_url
    });

    res.status(201).json({ success: true, data: newLogo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all logos
exports.getAllLogos = async (req, res) => {
  try {
    const logos = await Logo.find();
    res.status(200).json({ success: true, data: logos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get logo by ID
exports.getLogoById = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) return res.status(404).json({ success: false, message: 'Logo not found' });
    res.status(200).json({ success: true, data: logo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Logo
exports.updateLogo = async (req, res) => {
  try {
    const { categoryName, logoName } = req.body;
    const file = req.file;

    const logo = await Logo.findById(req.params.id);
    if (!logo) return res.status(404).json({ success: false, message: 'Logo not found' });

    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path, { folder: 'logos' });
      fs.unlinkSync(file.path);
      logo.logoImage = uploaded.secure_url;
    }

    if (categoryName) logo.categoryName = categoryName;
    if (logoName) logo.logoName = logoName;

    const updatedLogo = await logo.save();
    res.status(200).json({ success: true, data: updatedLogo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Logo
exports.deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findByIdAndDelete(req.params.id);
    if (!logo) return res.status(404).json({ success: false, message: 'Logo not found' });
    res.status(200).json({ success: true, message: 'Logo deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


//Banner


exports.createBanner = async (req, res) => {
  try {
    const file = req.file?.path;
    if (!file) return res.status(400).json({ success: false, message: "Image is required" });

    const result = await cloudinary.uploader.upload(file, { folder: "banners" });
    const newBanner = new Banner({ bannerImage: result.secure_url });
    await newBanner.save();

    res.status(201).json({ success: true, message: "Banner uploaded", data: newBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const file = req.file?.path;
    if (!file) return res.status(400).json({ success: false, message: "New image required" });

    const result = await cloudinary.uploader.upload(file, { folder: "banners" });
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { bannerImage: result.secure_url },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Banner updated", data: updatedBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

    res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};