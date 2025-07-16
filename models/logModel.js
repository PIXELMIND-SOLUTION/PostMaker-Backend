const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  logoName: {
    type: String,
    required: true
  },
  logoImage: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Logo', categorySchema);
