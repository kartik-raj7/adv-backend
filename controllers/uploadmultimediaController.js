import cloudinary from 'cloudinary';
import dataUriToBuffer from 'data-uri-to-buffer';
import UserModel from '../models/User.js';
import MultimediaModel from '../models/AdMultimedia.js';
cloudinary.config({
  cloud_name: process.env.API_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

class UploadController {
  static handleMultimediaUpload = async (req, res) => {
    const user = await UserModel.findOne({ email: req.user.email });
    const uploadFileToCloudinary = async (file, folder) => {
      const options = { folder, resource_type: 'auto' };
      try {
        const response = await cloudinary.v2.uploader.upload(file, options);
        return response;
      } catch (error) {
        throw error;
      }
    };
    try {
      if (req.body.ad_multimedia) {
        const cloudinaryResponse = await uploadFileToCloudinary(req.body.ad_multimedia);
        req.body.ad_multimedia = { url: cloudinaryResponse.secure_url };
        const newImageUpload = new MultimediaModel({
          url: cloudinaryResponse.url,
          secure_url: cloudinaryResponse.secure_url,
          asset_id: cloudinaryResponse.asset_id,
          public_id: cloudinaryResponse.public_id,
          format: cloudinaryResponse.format,
          resource_type: cloudinaryResponse.resource_type,
          creator: user.email,
      })
      await newImageUpload.save();
        res.status(201).send({ "status": "success", "message": cloudinaryResponse.resource_type=='image'?"Image uploaded successfully":"Video uploaded successfully","link":cloudinaryResponse.secure_url });
      } else {
        res.status(400).send({ "status": "failure", "message": "Could not upload multimedia" });
      }
    } catch (error) {
      res.status(404).send({ "status": "failure", "message": "Something went wrong" });
    }
  }
  static getMultimedia = async (req, res) => {
    const user = await UserModel.findOne({ email: req.user.email });
    try {
        if (!user) {
            res.status(400).send({ "status": "failure", "message": "Invalid request" });
        }
        if (user.type === 'Content Creator') {
            const ads = await MultimediaModel.find({ creator: user.email }, { url: 1, resource_type: 1, format: 1 });
            res.status(200).send({ "status": "success", "data": ads });
        } else {
          const allAds = await MultimediaModel.find({}, { url: 1, resource_type: 1, format: 1 });
            res.status(200).send({ "status": "success", "data": allAds });
        }
    } catch (error) {
        // console.log(error);
        res.status(404).send({ "status": "failure", "message": "Something went wrong" });
    }
}
}

export default UploadController;

