import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await User.findOne({ type: 'admin' });
    if (admin) {
      console.log('---ADMIN_DATA_START---');
      console.log('Email:', admin.email);
      console.log('Name:', admin.name);
      console.log('---ADMIN_DATA_END---');
    } else {
      console.log('No admin user found in database.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
