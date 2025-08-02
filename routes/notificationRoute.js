import express from 'express';
import {
  createNotification,
  getAllNotifications,
  markAsRead,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// ➕ Create notification
router.post('/notification', createNotification);

// 📥 Get all notifications
router.get('/notifications', getAllNotifications);

// ✅ Mark a notification as read
router.put('/notification/read/:id', markAsRead);

// ❌ Delete a notification
router.delete('/notification/:id', deleteNotification);

export default router;
