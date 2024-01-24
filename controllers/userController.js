import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from "../config/emailconfig.js";

class UserController{
    static userRegistration = async(req,res)=>
    {
          const {name,email,password,type,location} = req.body
          const user = await UserModel.findOne({email:email})
          if(user){
            res.status(400).send({"status":"failed","message":"Email already exists"})
          }else{
            if(name&&email&&password&&type){
               if(type=='Client'){
                if(location){   
                try{ 
                    const salt  = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password,salt);
                    const newuser= new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        type:type,
                        location:location
                    })
                    await newuser.save()
                    const saved_user = await UserModel.findOne({email:email})
                    ///generate JWT Token
                    const token = jwt.sign({userID:saved_user._id},
                        process.env.JWT_SECRET_KEY,{expiresIn:'7d'})
                        res.status(201).send({"status":"success","message":"Registration successful","token":token})
                }catch(error){
                    res.status(400).send({"status":"failed","message":"Registration unsuccessful try again"})
                }
                }
                else{
                    res.status(400).send({"status":"failed","message":"Please provide location"})
                }
               }
               else{
                try{ 
                    const salt  = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password,salt);
                    const newuser= new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        type:type,
                        location:location
                    })
                    await newuser.save()
                    const saved_user = await UserModel.findOne({email:email})
                    ///generate JWT Token
                    const token = jwt.sign({userID:saved_user._id}, process.env.JWT_SECRET_KEY,{expiresIn:'7d'})
                        res.status(201).send({"status":"success","message":"Registration successful","token":token})
                }catch(error){
                    res.status(400).send({"status":"failed","message":"Registration unsuccessful try again"})
                }
               }

            }
            else{
                res.status(400).send({"status":"failed","message":"Please fill in all the fields"})
            }
          }
    }
    static userLogin = async(req,res)=>{
       try{
        const {email,password} = req.body
        if(email && password){
            const user = await UserModel.findOne({email:email})
            if(user != null){
              const isMatch = await bcrypt.compare(password,user.password)
              if(user.email===email && isMatch){
                const saved_user = await UserModel.findOne({email:email})
                ///generate JWT Token
                const token = jwt.sign({userID:saved_user._id}, process.env.JWT_SECRET_KEY,{expiresIn:'7d'})
                res.status(201).send({
                    "status":'success',"message":"Login successful",
                    "token":token})
              }
              else{
                res.status(403).send({
                    "status":'failed',"message":"Wrong Email or password"
                   })
              }
            }
        }
        else{
            res.status(403).send({
                "status":'failed',"message":"Wrong Email or password"
               })
        }
       }catch (error){
           res.status(403).send({
            "status":'failed',"message":"Wrong Email or password"
           })

       }
    }
    static changeUserPassword = async (req ,res) =>{
       const {password ,password_confirmation} = req.body
       if( password && password_confirmation){
         if(password!=password_confirmation){
            res.status(400).send({
                "status":"failed","message":"New Password and Confirm New Password doesnt match"
            })
         }
         else{
            const salt = await bcrypt.genSalt(10)
            const newHashPassword  = await bcrypt.hash(password,salt)
            await UserModel.findByIdAndUpdate(req.user._id,{
                $set:{
                    password: newHashPassword
                }
            })
            res.status(201).send({
                "status":'success',"message":"Password Changed Successfully"})
         }
       }
       else{
        res.status(400).send({
            "status":"failed","message":"All the fields are required"
        })
       }
 }
   static userProfile = async (req,res)=>{
     res.status(200).send({ "user": req.user})
   }
   static sendRecoveryEmail = async (req,res)=>{
     const {email} = req.body
     if(email){
        const user = await UserModel.findOne({email:email})
        if(user){
            const secret = user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({userID:user._id},secret,{
            expiresIn:'15m'})
            const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
             let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "GeekShop - Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`
        })
            res.status(201).send({
                "status":"success", "message":"Link to reset your password has been successfully sent to your email","infor":info})
        }
        else{
            res.status(403).send({
                "status":"failed", "message":"Email doesn't exists"})
        }
     }
     else{
     res.status(403).send({
        "status":"failed", "message":"Email doesn't exists"})
     }
   }
   static userPasswordReset = async (req,res)=>{
     const {password,password_confirmation} = req.body
     const {id,token} = req.params
     const user =  await UserModel.findById(id)
     const new_secret = user._id + process.env.JWT_SECRET_KEY
     try{
       jwt.verify(token,new_secret)
       if(password&&password_confirmation){
         if(password==password_confirmation){
            const salt = await bcrypt.genSalt(10)
            const newHashPassword  = await bcrypt.hash(password,salt)
            await UserModel.findByIdAndUpdate(user._id,{
                $set:{
                    password: newHashPassword
                }
            })
            res.status(201).send({"status":'success',"message":"Password Changed Successfully"})
         }
         else{
            res.status(400).send({
                "status":"failed","message":"Password do not match"
            })
         }
       }
       else{
        res.status(400).send({
            "status":"failed","message":"All the fields are required"
        })
       }
     } catch(error){
        res.send({ "status": "failed", "message": "Invalid Token" })
     }
   }
}
export default UserController