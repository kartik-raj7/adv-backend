import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/middleware.js";
import AdController from "../controllers/adController.js";
import UploadController from "../controllers/uploadmultimediaController.js";
import MultimediaModel from "../models/AdMultimedia.js";

///Route Level Middleware - To Protect Route
router.use('/changepassword',checkUserAuth)
router.use('/userprofile',checkUserAuth)
router.use('/postad',checkUserAuth)
router.use('/getads',checkUserAuth)
router.use('/ad/:id',checkUserAuth)
router.use('/admetric',checkUserAuth)
router.use('/uploadmedia',checkUserAuth)
router.use('/allmedia',checkUserAuth)
///Public Routes///
router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/send-recovery-email',UserController.sendRecoveryEmail)
router.post('/reset-password/:id/:token',UserController.userPasswordReset)


///Protected Routes
router.post('/changepassword',UserController.changeUserPassword)
router.get('/userprofile',UserController.userProfile)
router.post('/postad',AdController.PostAd)
router.get('/getads',AdController.getAds)
router.patch('/ad/:id',AdController.editAds)
router.delete('/ad/:id',AdController.deleteAds)
router.post('/admetric',AdController.adsMetrics)
router.post('/uploadmedia',UploadController.handleMultimediaUpload)
router.get('/allmedia',UploadController.getMultimedia)

export default router