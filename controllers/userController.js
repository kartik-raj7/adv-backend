import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
       }catch (error){
           res.status(403).send({
            "status":'failed',"message":"Wrong Email or password"
           })

       }
    }
}
export default UserController