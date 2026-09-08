import mongoose from 'mongoose';

// Defines the connection to the database
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/myshop');
    console.log('MongoDB is connected...');
  } catch (err) {
    console.log('Error MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
