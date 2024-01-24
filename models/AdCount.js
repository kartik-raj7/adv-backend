import mongoose from "mongoose";

// Defining Schema

const AdsCountSchema = new mongoose.Schema({
    ad_id:{type: String , required:true , trim:true},
    ad_view:{type: Number , required:true },
    ad_clicks:{type: Number , required:true },
    clicked_by:{type: [String] , required:true },
})

//Model Create
const AdsMetricsModel = mongoose.model("admetrics",AdsCountSchema);

export default AdsMetricsModel