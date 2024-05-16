import express from "express";
const router = express.Router();

//import controller functions
import {signUp, signIn} from "../controller/user.js";


//Route request to the appropriate controller based on the request method
router.route("/signup/").post(signUp);
router.route("/signin/").post(signIn);

//ensure that we can access this variable from other files
export{router as userRoute};
