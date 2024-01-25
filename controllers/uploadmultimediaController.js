import cloudinary from 'cloudinary';
import dataUriToBuffer from 'data-uri-to-buffer';
cloudinary.config({
  cloud_name: process.env.API_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

class UploadController {
  static handleMultimediaUpload = async (req, res) => {
    console.log(req.body)
    try {
      if (req.body.ad_multimedia) {
        const cloudinaryResponse = await cloudinary.uploader.upload(req.body.ad_multimedia);
        req.body.ad_multimedia = { url: cloudinaryResponse.secure_url };
        res.status(201).send({ "status": "success", "message": "Image Uploaded successfully","link":cloudinaryResponse.secure_url });
      } else {
        res.status(400).send({ "status": "failure", "message": "Could not upload" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ "status": "failure", "message": "Internal server error" });
    }
  }
}

export default UploadController;

