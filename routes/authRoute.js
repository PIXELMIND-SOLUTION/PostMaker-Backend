import express from 'express';
import {
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
  getLocation,
  deleteLocation
} from '../controllers/userController.js';

const router = express.Router();

// Auth
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

// Forgot Password
router.post('/forgot/send-otp', sendForgotOtp);
router.post('/forgot/verify-otp', verifyForgotOtp);
router.post('/forgot/reset-password', resetForgotPassword);

// Profile
router.get('/user/:userId', getProfile);
router.put('/user/:userId', updateProfile);
router.delete('/user/:userId', deleteProfile);

// Address
router.post('/user/:userId/address', addAddress);
router.get('/user/:userId/address', getAddress);
router.put('/user/:userId/address', updateAddress);
router.delete('/user/:userId/address', deleteAddress);

// Location
router.post('/user/:userId/location', postLocation);
router.put('/user/:userId/location', updateLocation);
router.get('/user/:userId/location', getLocation);
router.delete('/location/:userId', deleteLocation);


export default router;
