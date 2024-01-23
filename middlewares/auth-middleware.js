import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

var checkUserAuth = async(req,res,next)=>{
    let token
    const {authorization} = req.headers;
    if (authorization && authorization.startsWith('Bearer')){
    try{
        //Get Token From Header
        token = authorization.split(' ')[1]
 
        ///Verify Token///
        const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)

        //Get User from Token
        req.user = await UserModel.findById(userID).select('-_id -password -__v');
        console.log('here');
        // req.user = await UserModel.findById(userID).select("-password")//return data with password
        next();

    } catch(error) {
    //   console.log(error)
      res.status(403).send({
        "status":"failed","message":"Unauthorized User"
      })
   
    }   
}
 if(!token){
    res.status(403).send({
        "status":"failed","message":"Unauthorized User No token"
      })
 }
}
export default checkUserAuth