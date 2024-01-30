import mongoose from "mongoose";

const connectDb = async (DATABSE_URL)=>{
    try{
      const DB_OPTIONS = {
         dbName: "scootersondb"
      }
      await mongoose.connect(DATABSE_URL,DB_OPTIONS);
      // console.log('connected successfully') // remove in production
    } catch(error){
        // console.log(error)
    }
};
export {connectDb}