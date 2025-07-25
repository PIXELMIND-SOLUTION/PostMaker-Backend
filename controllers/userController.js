const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { generateTempToken, verifyTempToken } = require('../utils/jws');

let registerToken = null;
let tempForgotToken = null;
let verifiedForgotPhone = null;

const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, confirmPassword } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = '1234';
    registerToken = generateTempToken({ fullName, email, phoneNumber, password: hashedPassword, otp });
    return res.status(200).json({ message: "OTP sent ✅", otp, token: registerToken });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed ❌", error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp || otp !== '1234' || !registerToken) return res.status(400).json({ message: "Invalid OTP" });
    const decoded = verifyTempToken(registerToken);
    const user = await User.create({
      fullName: decoded.fullName,
      email: decoded.email,
      phoneNumber: decoded.phoneNumber,
      password: decoded.password,
      isVerified: true
    });
    registerToken = null;
    return res.status(201).json({ message: "User registered successfully ✅", userId: user._id });
  } catch (err) {
    return res.status(400).json({ message: "OTP verification failed ❌", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });
    return res.status(200).json({
      message: "Login successful ✅",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed ❌", error: err.message });
  }
};

const sendForgotOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });
    const otp = '1234';
    tempForgotToken = generateTempToken({ phoneNumber, otp });
    return res.status(200).json({ message: "OTP sent ✅", otp });
  } catch (err) {
    return res.status(500).json({ message: "OTP send failed ❌", error: err.message });
  }
};

const verifyForgotOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp || otp !== '1234' || !tempForgotToken) return res.status(400).json({ message: "Invalid OTP" });
    const decoded = verifyTempToken(tempForgotToken);
    verifiedForgotPhone = decoded.phoneNumber;
    tempForgotToken = null;
    return res.status(200).json({ message: "OTP verified ✅" });
  } catch (err) {
    return res.status(400).json({ message: "OTP verification failed ❌", error: err.message });
  }
};

const resetForgotPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    if (!verifiedForgotPhone) return res.status(400).json({ message: "OTP verification required" });
    if (newPassword !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
    const user = await User.findOne({ phoneNumber: verifiedForgotPhone });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    verifiedForgotPhone = null;
    return res.status(200).json({ message: "Password reset successful ✅" });
  } catch (err) {
    return res.status(500).json({ message: "Password reset failed ❌", error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: 'Profile fetched ✅',
      user: {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Profile fetch failed', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: 'Profile updated ✅',
      user: {
        userId: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found ❌' });

    res.status(200).json({ message: 'Profile deleted successfully ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete profile ❌', error: err.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const address = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found ❌' });

    user.address = address;
    await user.save();

    res.status(200).json({
      message: 'Address added successfully ✅',
      address: user.address
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add address ❌', error: err.message });
  }
};

const getAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('address');
    if (!user) return res.status(404).json({ message: 'User not found ❌' });

    res.status(200).json({
      message: 'Address fetched successfully ✅',
      address: user.address
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch address ❌', error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const newAddress = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { address: newAddress } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found ❌' });

    res.status(200).json({
      message: 'Address updated successfully ✅',
      address: user.address
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update address ❌', error: err.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found ❌' });

    user.address = {};
    await user.save();

    res.status(200).json({ message: 'Address deleted successfully ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete address ❌', error: err.message });
  }
};

const postLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found ❌' });

    if (user.latitude || user.longitude) {
      return res.status(400).json({ message: 'Location already exists. Use PUT to update.' });
    }

    user.latitude = latitude;
    user.longitude = longitude;
    await user.save();

    res.status(201).json({
      message: 'Location added successfully ✅',
      location: {
        latitude: user.latitude,
        longitude: user.longitude
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add location ❌', error: err.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { latitude, longitude },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found ❌' });

    res.status(200).json({
      message: 'Location updated successfully ✅',
      location: {
        latitude: user.latitude,
        longitude: user.longitude
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update location ❌', error: err.message });
  }
};

const getLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('latitude longitude');
    if (!user) return res.status(404).json({ message: 'User not found ❌' });

    res.status(200).json({
      message: 'Location fetched ✅',
      location: {
        latitude: user.latitude,
        longitude: user.longitude
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch location ❌', error: err.message });
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  sendForgotOtp,
  verifyForgotOtp,
  resetForgotPassword,
  getProfile,
  updateProfile,
  deleteProfile,
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
  postLocation,
  updateLocation,
  getLocation
};
