import {User} from "../model/user.js";
import {constants} from '../constants.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {validateUserSignup} from "../validation/userSignupValidation.js";
import { logger } from "./logger.js";


// @des: User is sign up into the app
// @route: Post /api/users/signup/
// @access: public
async function signUp(req, res){
    let user = {}; 

    try {
        //Validate required inputs
        user = await validateUserSignup(req.body);
    } catch (error) {
        return res.status(constants.VALIDATION_ERROR).json({ message: error.message, error:1});
    }

    try {
        const {email, first_name, last_name, password} = user; //only extract this input

        // Email must be unique
        const found = await User.findOne({email});
       
        //if  not found, account does not exist
        if (found) {
            return res.status(constants.VALIDATION_ERROR).json({ message: "User already exist", error:1});
        }

        //encrypt the user password
        const hashPassword = await bcrypt.hash(password, 10);
        
        //Create this user
        user = await User.create({email, first_name, last_name, password:hashPassword});
        if (user) {
            res.status(constants.SUCCESS_CREATED).json({ message: 'Success', error:0});
        }else{
            throw new Error("User data not valid")
        }
        logger.log('error', `signUp function: A user created an account`);
        
    } catch (error) {
        res.status(constants.VALIDATION_ERROR).json({ message: "Sign up failed", error:1});
        logger.log('error', `signUp function: User could not create account. Reason: ${error.message}`);
    }
}


// @des: User is sign in into the app
// @route: Post /api/users/signin/
// @access: public
async function signIn(req, res){
    const {email, password} = req.body; //extract inputs

    try {
        // check if account exist
        const user = await User.findOne({email});
       
        //if  not found, account does not exist
        if (!user) {
            return res.status(constants.VALIDATION_ERROR).json({ message: "Account not found on our system", error:1});
        }
        

        //encrypt the user password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(constants.VALIDATION_ERROR).json({ message: "email or password is incorrect", error:1});
        }

        //Generate a token
        const accessToken = jwt.sign({
            user:{
                email:user.email,
                id: user.id
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "1h"}
        );
        
        res.status(constants.SUCCESS).json({ message: 'Success', accessToken: accessToken, error:0});
        logger.log('info', "signIn function: User successfully log in");
    } catch (error) {
        res.status(constants.UNAUTHORIZED).json({ message: "Sign in failed", error:1});
        logger.log('error', `signIn function: User login failed. Reason: ${error.message}`);
    }
}


export{signUp, signIn}