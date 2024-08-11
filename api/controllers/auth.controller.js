import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";



export const signUp =async (req,res,next)=>{

    try{
    const {username , password , email} = req.body;

    const hashedPassword = bcryptjs.hashSync(password,10);

    const newUser = new User({username,email,password:hashedPassword});

    
        await newUser.save();
        res.status(201).json('User created successfully!');
    }
    catch (error) {
        next(error);
    }
    
}


export const signIn = async (req,res,next)=>{
 try {
     
    const {email,password} =req.body;

    const validUser = await  User.findOne({email});
    if(!validUser) return next(errorHandler(404,'User not found'));

    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword) return  next(401,'Invalid Credentials');
    const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);

    const {password : pass , ...rest} = validUser._doc;

    res.cookie('access_token', token , {httpOnly:true}).status(200).json(rest);


 } 
 catch (error) {
   next(error); 
 }

} ;



export const google = async(req,res,next)=>{
    try {
        const validUser = await User.findOne({email:req.body.email})
        if(validUser){
            const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
            const {password:pass , ...rest} = validUser._doc;

            res.cookie('access_token', token , {httpOnly:true} ).status(200).json(rest);
        }
        else{
           const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) ;
           const hashedPassword = bcryptjs.hashSync(generatedPassword,10);

           const {name} = req.body;

           const uniqueName = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) ;

           const newUser = new User({
                username : uniqueName,
                email : req.body.email ,
                password : hashedPassword,
                avatar : req.body.photo
           })
          
           await newUser.save();

           const {password:pass , ...rest} = newUser._doc ;
           const token = jwt.sign({id:newUser._id} , process.env.JWT_SECRET) ;
            
           res.cookie('access_token' , token , {httpOnly : true}).status(200).json(rest);
        }
    } 
    catch (error) {
        next(error);
    }




}


export const signOut = (req,res,next)=>{
     try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
     } 
     catch (error) {
        next(error);
     }  

    



}