import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

const dueDateSchema = new mongoose.Schema({
  image: { type: String, required: true },
  dueDate: { type: Date, required: true }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const DueDate = mongoose.model('DueDate', dueDateSchema);

export { Category, DueDate };
