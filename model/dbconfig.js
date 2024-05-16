import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();



async function connect(){
    mongoose.connect(process.env.CONNECTION_STRING);
}

export{connect};