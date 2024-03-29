import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors';
import { connectDb } from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js'
import multer from 'multer';
import cron from 'node-cron'
import { deleteExpiredJobs } from './public/javascripts/CheckJobs.js';
dotenv.config()
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
const app = express();
const port = process.env.port
const DATABASE_URL = process.env.DATABASE_URL;
app.get('/', function (req, res) {
    res.send('Hello World')
  })
  //CORS POLICY//
  app.use(cors());
  app.use(upload.any()); 
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  connectDb(DATABASE_URL)
  ///
  cron.schedule('0 */6 * * *', () => {
    deleteExpiredJobs();
  });
  app.use(express.json())
  app.use("/api/user" ,userRoutes)
  

  app.listen(port)