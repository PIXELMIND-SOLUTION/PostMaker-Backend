import Job from '../models/jobModel.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// ➕ CREATE Job
export const createJob = async (req, res) => {
  try {
    const { companyName, role, locationName, longitude, latitude } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Delete local file after upload

    const job = new Job({
      image: result.secure_url,
      companyName,
      role,
      locationName,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });

    await job.save();
    return res.status(201).json({ success: true, message: "Job created ✅", job });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Job creation failed ❌", error: err.message });
  }
};

// 📖 GET All Jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    return res.status(200).json({ success: true, jobs });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Fetch failed ❌", error: err.message });
  }
};

// 📖 GET Job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Fetch failed ❌", error: err.message });
  }
};

// ✏️ UPDATE Job
export const updateJob = async (req, res) => {
  try {
    const { companyName, role, locationName, longitude, latitude } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Upload new image if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      job.image = result.secure_url;
    }

    job.companyName = companyName || job.companyName;
    job.role = role || job.role;
    job.locationName = locationName || job.locationName;
    if (longitude && latitude) {
      job.location.coordinates = [parseFloat(longitude), parseFloat(latitude)];
    }

    await job.save();
    return res.status(200).json({ success: true, message: "Job updated ✅", job });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Update failed ❌", error: err.message });
  }
};

// 🗑️ DELETE Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.status(200).json({ success: true, message: "Job deleted ✅" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Deletion failed ❌", error: err.message });
  }
};
