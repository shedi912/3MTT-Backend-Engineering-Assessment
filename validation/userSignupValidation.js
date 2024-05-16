import Joi from 'joi';
import {constants} from '../constants.js';

// Change column name to something users can understand
function buildErrorMessage(msg){
    
    if(msg.includes('first_name')){
        return msg.replace('first_name', 'First name');
    }else if(msg.includes('last_name')){
        return msg.replace('last_name', 'Last name');
    }

    return msg;
}

// Validate vehicle order request input
async function validateUserSignup(user){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        first_name: Joi.string().required(), 
        last_name: Joi.string().required(),  
        password: Joi.string().min(3).required()
        });
    
    try {
        return await schema.validateAsync(user);
    } catch (error) {
       throw Error(buildErrorMessage(error.details[0].message));
    }
}

export{validateUserSignup}
