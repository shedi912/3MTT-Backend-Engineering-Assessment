
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: [true, "Email is required"], 
        unique: [true, "email already exist"]
    },
    first_name: {
        type: String, 
        required: [true, "Please add first name"]
    },
    last_name: {
        type: String, 
        required: [true, "Please add last name"]
    },
    password: {
        type: String, 
        required: [true, "Please add password"]}
}, {
    timestamps: true
}
);

const UserModel = mongoose.model("User", UserSchema);

export {UserModel as User}