import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

///Route Level Middleware - To Protect Route
router.use('/changepassword',checkUserAuth)
router.use('/userprofile',checkUserAuth)

///Public Routes///
router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/send-recovery-email',UserController.sendRecoveryEmail)
router.post('/reset-password/:id/:token',UserController.userPasswordReset)


///Protected Routes
router.post('/changepassword',UserController.changeUserPassword)
router.get('/userprofile',UserController.userProfile)

export default router