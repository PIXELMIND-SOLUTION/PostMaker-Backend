const express = require('express');
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');

// ➕ Create notification
router.post('/notification', createNotification);

// 📥 Get all notifications
router.get('/notifications', getAllNotifications);

// ✅ Mark a notification as read
router.put('/notification/read/:id', markAsRead);

// ❌ Delete a notification
router.delete('/notification/:id', deleteNotification);

module.exports = router;
