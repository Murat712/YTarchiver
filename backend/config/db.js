import mongoose from 'mongoose';
import { DB_URI } from './env.js';

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to database');
    } catch (error) {
        console.log('Connect database has failed', error.message);
        throw error;
    }
};

export default connectDB;
