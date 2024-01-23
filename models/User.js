import mongoose from "mongoose";

// Defining Schema

const userSchema = new mongoose.Schema({
    name:{type: String , required:true , trim:true},
    email:{type: String , required:true , trim:true},
    password:{type: String , required:true , trim:true},
    type:{type: String , required:true , trim:true},
    location:{type: String , trim:true},
    
})

//Model Create
const UserModel = mongoose.model("user",userSchema);

export default UserModel