import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'kavindi.jayawardena@example.com';
    const password = 'admin123';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword, type: 'admin' } },
      { new: true, upsert: true }
    );
    
    console.log('ADMIN_RESET_SUCCESS');
    console.log('Email:', user.email);
    console.log('Password: admin123');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

resetAdmin();
