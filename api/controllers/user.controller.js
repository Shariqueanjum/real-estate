import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js"

export const test =(req,res)=>{
    res.json({
        message:"It's working"
    })


};


export const updateUserInfo = async (req,res,next)=>{

    
    
    if(req.user.id !== req.params.id) return next(errorHandler(401 , "You are not allowed to update other's account"));
    
    try {
       if(req.body.password){
           req.body.password = bcryptjs.hashSync(req.body.password , 10);
       } 

       console.log("i am the id",req.params.id)

   
       
       const updatedUser = await User.findByIdAndUpdate(req.params.id ,{
           $set:{
              username : req.body.username,
              email    : req.body.email ,
              password : req.body.password,
              avatar : req.body.avatar ,

           },
       },{new:true})
       
       const {password , ...rest} = updatedUser._doc ;

       res.status(200).json(rest);


    } 
    catch (error) {
         next(error);
    }







}