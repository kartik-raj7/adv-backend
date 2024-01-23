import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors';
import { connectDb } from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js'
dotenv.config()

const app = express();
const port = process.env.port
const DATABASE_URL = process.env.DATABASE_URL;
app.get('/', function (req, res) {
    res.send('Hello World')
  })
  //CORS POLICY//
  app.use(cors());
  connectDb(DATABASE_URL)
  ///
  app.use(express.json())
  ///Load routes
  app.use("/api/user" ,userRoutes)
  

  app.listen(port)