import express from "express"
import mongoose from "mongoose";
import cors from "cors" ;
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
     console.log("connected to DB :)" )
})
.catch((error)=>{
     console.log(error)
})

const app=express();

app.use(express.json());

const corsOptions = {
     origin: 'http://localhost:5173',
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allows all standard HTTP methods
     allowedHeaders: 'Content-Type, Authorization',  // Allows all headers
     credentials: true,    // If you want to allow cookies and authentication headers
   };

app.use(cors(corsOptions));


app.use("/api/user" , userRouter);
app.use("/api/auth" , authRouter);


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