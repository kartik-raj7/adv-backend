import AdsModel from "../models/Ads.js";
import UserModel from "../models/User.js";
import AdsMetricsModel from "../models/AdCount.js";
import MultimediaModel from "../models/AdMultimedia.js";
import cloudinary from "cloudinary";
class AdController {
  static PostAd = async (req, res) => {
    const {
      ad_headline,
      ad_multimedia,
      ad_detail,
      ad_description,
      ad_url,
      ad_scheduledtime,
      ad_expirationtime,
      ad_location,
    } = req.body;
    console.log(req.body);
    if (
      ad_headline &&
      (ad_multimedia || ad_url) &&
      ad_detail &&
      ad_description &&
      ad_scheduledtime &&
      ad_expirationtime &&
      ad_location
    ) {
      const user = await UserModel.findOne({ email: req.user.email });
      var cloudinaryResponse;
      if (!ad_url) {
        cloudinaryResponse = await cloudinary.uploader.upload(ad_multimedia);
      }
      if (user.type === "Advertiser") {
        try {
          const newad = new AdsModel({
            ad_headline: ad_headline,
            ad_multimedia: cloudinaryResponse?.url
              ? cloudinaryResponse.url
              : ad_url,
            ad_detail: ad_detail,
            ad_description: ad_description,
            ad_url: ad_url,
            ad_scheduledtime: ad_scheduledtime,
            ad_expirationtime: ad_expirationtime,
            ad_location: ad_location,
            ad_creator: user.name,
          });
          await newad.save();
          if (!ad_url) {
            const newImageUpload = new MultimediaModel({
              url: cloudinaryResponse.url,
              secure_url: cloudinaryResponse.secure_url,
              asset_id: cloudinaryResponse.asset_id,
              public_id: cloudinaryResponse.public_id,
              format: cloudinaryResponse.format,
              resource_type: cloudinaryResponse.resource_type,
              creator: user.email,
            });
            await newImageUpload.save();
          }
          const adMetrics = new AdsMetricsModel({
            ad_id: newad._id,
            ad_clicks: 0,
            ad_view: 0,
            clicked_by: [],
          });
          await adMetrics.save();
          res
            .status(201)
            .send({ status: "success", message: "Add created successfully" });
        } catch (error) {
          console.log(error);
          res
            .status(400)
            .send({ status: "failed", message: "Failed to create ad" });
        }
      } else {
        res
          .status(403)
          .send({
            status: "failed",
            message: "Only Advertiser are permitted to post Ad",
          });
      }
    } else {
      res
        .status(400)
        .send({ status: "failed", message: "Failed to create ad" });
    }
  };
  static getAds = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.user.email });
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }
      if (user.type == "Advertiser") {
        const ads = await AdsModel.find({ ad_creator: req.user.email });
        const adsWithMetrics = await Promise.all(
          ads.map(async (ad) => {
            const metrics = await AdsMetricsModel.findOne({ ad_id: ad._id });        
            const adObject = ad.toObject();
            const metricsObject = metrics ? metrics.toObject() : null;
            delete adObject.__v;
            if (metricsObject) {
              delete metricsObject.__v;
            }
            return {
              ...adObject,
              metrics: metricsObject,
            };
          })
        );
        res.status(200).json({ status: "success", data: adsWithMetrics });
      } else {
        const allAds = await AdsModel.find({});
        const currentLiveAds = allAds.filter((ad)=>{
          const  currentDate = new Date();
            const scheduledDate = new Date(ad.ad_scheduledtime.slice(0, 10));
            const expirationDate = new Date(ad.ad_expirationtime.slice(0, 10));
            return currentDate>=scheduledDate&&currentDate<expirationDate;
        }).map((ad)=>{
          const adObject = ad.toObject();
          delete adObject.__v;
          return adObject;
        })
      
        res.status(200).json({ status: "success", data: currentLiveAds });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "failed", message: "Failed to retrieve ads" });
    }
  };
  static editAds = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.user.email });
      const { id } = req.params;
      const {
        ad_headline,
        ad_multimedia,
        ad_detail,
        ad_description,
        ad_url,
        ad_scheduledtime,
        ad_expirationtime,
        ad_location,
      } = req.body;
      if (!user || user.type !== "Advertiser") {
        console.log(user);
        return res
          .status(404)
          .json({
            status: "failed",
            message: "Create an Advertiser Profile to get this functionality",
          });
      }
      if (Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ status: "failed", message: "No fields provided for update" });
      }
      const check = await AdsModel.findOne({ _id: id });
      if (check.ad_creator === user.email) {
        const updateObject = {};
        if (ad_headline) updateObject.ad_headline = ad_headline;
        if (ad_multimedia) updateObject.ad_multimedia = ad_multimedia;
        if (ad_detail) updateObject.ad_detail = ad_detail;
        if (ad_description) updateObject.ad_description = ad_description;
        if (ad_url) updateObject.ad_url = ad_url;
        if (ad_scheduledtime) updateObject.ad_scheduledtime = ad_scheduledtime;
        if (ad_expirationtime)
          updateObject.ad_expirationtime = ad_expirationtime;
        if (ad_location) updateObject.ad_location = ad_location;
        const updatedAd = await AdsModel.findOneAndUpdate(
          { _id: id, ad_creator: req.user.email },
          { $set: updateObject },
          { new: true }
        );

        if (!updatedAd) {
          return res
            .status(404)
            .json({
              status: "failed",
              message:
                "Ad not found or you don't have permission to edit this ad",
            });
        }

        res
          .status(200)
          .json({
            status: "success",
            message: "Ad updated successfully",
            ad: updatedAd,
          });
      } else {
        return res
          .status(404)
          .json({
            status: "failed",
            message:
              "Ad not found or you don't have permission to edit this ad",
          });
      }
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ status: "failed", message: "Failed to update ad" });
    }
  };
  static deleteAds = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.user.email });
      const { id } = req.params;
      if (!user || user.type !== "Advertiser") {
        return res
          .status(404)
          .json({
            status: "failed",
            message: "Create an Advertiser Profile to get this functionality",
          });
      }
      const adToDelete = await AdsModel.findOne({
        _id: id,
        ad_creator: user.email,
      });
      if (!adToDelete) {
        return res
          .status(404)
          .json({
            status: "failed",
            message:
              "Ad not found or you don't have permission to delete this ad",
          });
      }
      const deletedAd = await AdsModel.findOneAndDelete({
        _id: id,
        ad_creator: user.email,
      });
      if (!deletedAd) {
        return res
          .status(404)
          .json({ status: "failed", message: "Ad not found" });
      }
      res
        .status(200)
        .json({
          status: "success",
          message: "Ad deleted successfully",
          ad: deletedAd,
        });
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ status: "failed", message: "Failed to delete ad" });
    }
  };
  static adsMetrics = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.user.email });
      const { views, clicks } = req.body;
      if (
        !user ||
        !Array.isArray(views) ||
        !Array.isArray(clicks) ||
        !user.type == "Client"
      ) {
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid request format" });
      }
      for (const view of views) {
        const { ad_id, count } = view;
        const currentViews = await AdsMetricsModel.findOne({ ad_id }).select(
          "ad_view"
        );
        const newViewsCount = currentViews
          ? currentViews.ad_view + count
          : count;
        await AdsMetricsModel.updateOne(
          { ad_id },
          { $set: { ad_view: newViewsCount } }
        );
      }
      for (const click of clicks) {
        const { ad_id, count } = click;
        const currentClicks = await AdsMetricsModel.findOne({ ad_id }).select(
          "ad_clicks"
        );
        const newClicksCount = currentClicks
          ? currentClicks.ad_clicks + count
          : count;
        await AdsMetricsModel.updateOne(
          { ad_id },
          { $set: { ad_clicks: newClicksCount } }
        );
      }
      res
        .status(200)
        .json({ status: "success", message: "Ad updated successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ status: "failed", message: "Failed to delete ad" });
    }
  };
}
export default AdController;
