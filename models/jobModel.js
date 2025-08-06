import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  locationName: {
    type: String,
    required: true, // e.g., "Bangalore, India"
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      default: [0, 0]
    }
  }
}, { timestamps: true });

// 🔍 Geo Index for location field
jobSchema.index({ location: '2dsphere' });

export default mongoose.model('Job', jobSchema);
