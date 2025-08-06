import mongoose from 'mongoose';

const containerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

const Container = mongoose.model('Container', containerSchema);

export default Container;
