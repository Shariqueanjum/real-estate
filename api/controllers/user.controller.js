import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js"
import Listing from "../models/listing.model.js";


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

      // console.log("i am the id",req.params.id)

   
       
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


};


export const deleteUserInfo = async (req,res,next)=>{
       
    if(req.user.id !== req.params.id ) return next(errorHandler(401,'Not allowed to delete others account'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } 
    catch (error) {
        next(error) ;
    }




};


export const getUserListings = async (req,res,next)=>{
    
    if(req.user.id === req.params.id){
         try {
            const allListings = await Listing.find({userRef : req.params.id});
             res.status(200).json(allListings);
         } 
         catch (error) {
             next(error)
         }
    }
    else{
        next(errorHandler(401 , 'You can only see your own listings'))
    }


};


export const getUserDetails = async (req,res,next)=>{
     console.log('hey i am inside controller');
     
    try {
        const userFound = await User.findById(req.params.id);
        if(!userFound) return next(errorHandler(404 , 'User not found'));
        const {password , ...rest} = userFound._doc;
        
        res.status(200).json(rest);

    } 
    catch (error) {
        next(error);
    }


};