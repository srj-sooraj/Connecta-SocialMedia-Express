import mongoose from "mongoose";

export default async function connection() {
    const db = await mongoose.connect(process.env.MONGO_URL)
    console.log('Database connected');
    return db
    
}