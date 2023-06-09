import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true
  }
});

export default mongoose.model('User', userSchema)