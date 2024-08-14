import Listing from "../models/listing.model.js";


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