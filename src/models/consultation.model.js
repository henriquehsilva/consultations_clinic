import mongoose from 'mongoose';

let consultationSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Consultation', consultationSchema)