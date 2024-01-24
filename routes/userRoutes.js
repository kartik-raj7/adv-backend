import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
import AdController from "../controllers/adController.js";

///Route Level Middleware - To Protect Route
router.use('/changepassword',checkUserAuth)
router.use('/userprofile',checkUserAuth)
router.use('/postad',checkUserAuth)
router.use('/getads',checkUserAuth)
router.use('/ad/:id',checkUserAuth)
router.use('/admetric',checkUserAuth)
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

export default router