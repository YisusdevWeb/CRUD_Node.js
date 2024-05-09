import mongoose from 'mongoose'

export const connectDB = async() =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/nodetask")
     console.log("connected DB")
    }
    catch (error) {
        console.log(error);
    }
}