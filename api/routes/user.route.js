import express from "express"
import { test, updateUserInfo , deleteUserInfo , getUserListings } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();


router.get("/test",test);

router.post("/update/:id" , verifyToken , updateUserInfo) ;

router.delete("/delete/:id" , verifyToken , deleteUserInfo) ;

router.get("/listings/:id" , verifyToken , getUserListings) ;


export default router ;