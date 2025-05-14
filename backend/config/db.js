const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://omardhaif3:Dh_77021061r@cluster0.wnpyz1y.mongodb.net/injoy?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
