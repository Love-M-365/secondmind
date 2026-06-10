import '../config/env.js';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import Memory from '../models/memory.model.js';
import { queryModel } from '../services/gemini.service.js';

const runCheck = async () => {
  console.log('=== SECONDMIND DIAGNOSTIC RUN ===');
  
  try {
    // 1. Test database connection
    console.log('1. Connecting to MongoDB Atlas / Local...');
    await connectDB();
    console.log('DB Connect: SUCCESS\n');

    // 2. Test User Model insertion/sync
    console.log('2. Syncing mock test user...');
    const testEmail = 'verify@secondmind.ai';
    let user = await User.findOne({ email: testEmail });
    if (!user) {
      user = await User.create({
        firebaseUid: 'verify_mock_uid_12345',
        name: 'Verification Bot',
        email: testEmail,
        photoUrl: ''
      });
      console.log('Created new test user:', user.email);
    } else {
      console.log('Test user already exists:', user.email);
    }
    console.log('User model sync: SUCCESS\n');

    // 3. Test Gemini API connection
    console.log('3. Fetching response from Google Gemini AI...');
    const testPrompt = 'Say "SecondMind AI is ready" in exactly 4 words.';
    const response = await queryModel(testPrompt, false);
    console.log(`Gemini response: "${response.trim()}"`);
    console.log('AI Layer query: SUCCESS\n');

    console.log('=== DIAGNOSTICS COMPLETED SUCCESSFULLY ===');
    process.exit(0);
  } catch (error) {
    console.error('\n!!! DIAGNOSTIC FAILURE !!!');
    console.error(error);
    process.exit(1);
  }
};

runCheck();
