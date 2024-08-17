import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
};

export default connectDB;