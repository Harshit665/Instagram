// here we write the code for listening the server
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"

dotenv.config({})

const app = express();

app.get("",(req,res)=>{
    res.status(200).json({
        message:"i am coming from backend",
        success:true
    })
})

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}))
const corsOption = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOption));

const PORT = process.env.PORT || 3000

//yha  par apni API aayegi
app.use("/api/v1/user",userRoute);

app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running in the port ${process.env.PORT}`);
})