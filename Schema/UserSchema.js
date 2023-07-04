import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type: String,
        require :true,
    },
    username:{
        type: String,
        unique: true,
        require :true,
    },
    email:{
        type: String,
        unique: true,
        require :true,
    },
    password:{
        type: String,
        require :true,
    },
    emailAuthenticated: {
        type: Boolean,
        require: true
    }
})

const UserSchema = mongoose.model("users",userSchema);
export default UserSchema