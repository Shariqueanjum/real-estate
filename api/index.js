import express from "express"
import mongoose from "mongoose";
import cors from "cors" ;
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import path from "path";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL,{
     connectTimeoutMS: 30000, // increase timeout to 30 seconds
     socketTimeoutMS: 45000, // increase socket timeout
})
.then(()=>{
     console.log("connected to DB :)" )
})
.catch((error)=>{
     console.log(error)
})

const __dirname = path.resolve();

const app=express();

app.use(express.json());

app.use(cookieParser());

const corsOptions = {
     origin: 'http://localhost:5173',
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allows all standard HTTP methods
     allowedHeaders: 'Content-Type, Authorization',  // Allows all headers
     credentials: true,    // If you want to allow cookies and authentication headers
   };

app.use(cors(corsOptions));


app.use("/api/user" , userRouter);
app.use("/api/auth" , authRouter);
app.use("/api/listing" , listingRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
   });



app.use((err, req, res, next) => {
     const statusCode = err.statusCode || 500;
     const message = err.message || 'Internal Server Error';
     return res.status(statusCode).json({
       success: false,
       statusCode,
       message,
     });
   });




app.listen(3000,()=>{
     console.log("Server is running on port 3000");
})