import mongoose from "mongoose";
// Defining Schema
const AdsSchema = new mongoose.Schema({
    ad_headline:{type: String , required:true , trim:true},
    ad_multimedia:{type: String , required:true , trim:true},
    ad_detail:{type: String , required:true , trim:true},
    ad_description:{type: String , required:true , trim:true},
    ad_url:{type: String , required:true , trim:true},
    ad_scheduledtime:{type: String , required:true , trim:true},
    ad_expirationtime:{type: String , required:true , trim:true},
    ad_location:{type: String , required:true , trim:true},
    ad_creator:{type: String , required:true , trim:true},
})

//Model Create
const AdsModel = mongoose.model("ads",AdsSchema);

export default AdsModel