import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";


export const createListing = async (req,res,next)=>{
     try {
          console.log("i m inside create listing");
          const newListing =  await Listing.create(req.body);
          res.status(201).json(newListing);
     }
      catch (error) {
        next(error);
     }


};

export const deleteListing = async (req,res,next)=>{

        console.log("inside delete listing");
        
       const listing = await Listing.findById(req.params.id);

       if(!listing) return (next(errorHandler(404,'Listing not found')));

       if(req.user.id !== listing.userRef){
            return next(errorHandler(401 , 'You are only allowed to delete your own listings'));
       }

       try {
          await Listing.findByIdAndDelete(req.params.id);
          res.status(200).json('Listing deleted Successfully!');
       } 
       catch (error) {
           next(error);
       }




};


export const updateListing = async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404, 'Listing not Found'));

    if(req.user.id !== listing.userRef) return next(errorHandler(401 , 'You are only allowed to edit your own listings')); 

    try {
        const updateListing = await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(updateListing);
    } 
    catch (error) {
        next(error);
    }



};


export const getListing = async ( req,res,next)=>{
     try {
        const listing = await Listing.findById(req.params.id);
        if(!listing) return next(errorHandler(404 , 'Listing not found'));

        res.status(200).json(listing);
     }
      catch (error) {
         next(error);
     }


};


export const getListings = async(req,res,next)=>{
   
    try {
        
    } 
    catch (error) {
        
    }
   

}