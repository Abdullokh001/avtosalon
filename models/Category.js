import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category nomi majburiy'],
    trim: true,
    unique: true,
    minlength: [2, 'Category nomi kamida 2 ta belgidan iborat bo\'lishi kerak']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Tavsif 500 ta belgidan oshmasligi kerak']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Category', categorySchema);
