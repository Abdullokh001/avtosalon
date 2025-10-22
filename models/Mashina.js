import mongoose from 'mongoose';

const mashinaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mashina nomi majburiy'],
    trim: true,
    minlength: [2, 'Mashina nomi kamida 2 ta belgidan iborat bo\'lishi kerak']
  },
  model: {
    type: String,
    required: [true, 'Model majburiy'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Yil majburiy'],
    min: [1900, 'Yil 1900 dan katta bo\'lishi kerak'],
    max: [new Date().getFullYear() + 1, 'Yil kelgusi yildan oshmasligi kerak']
  },
  price: {
    type: Number,
    required: [true, 'Narx majburiy'],
    min: [0, 'Narx manfiy bo\'lishi mumkin emas']
  },
  color: {
    type: String,
    trim: true
  },
  mileage: {
    type: Number,
    min: [0, 'Probeg manfiy bo\'lishi mumkin emas']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Tavsif 1000 ta belgidan oshmasligi kerak']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category majburiy']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Mashina', mashinaSchema);
