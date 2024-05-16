import jwt from 'jsonwebtoken';
import { constants } from '../constants.js';
import { logger } from '../controller/logger.js';

async function validateToken(req){
    let token;

    let authHeader =  req.headers.Authorization || req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer")) {
        
        token = authHeader.split(" ")[1];
        const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
            if (err) {
                logger.log('error', `validateToken function: User access denied. Reason: ${err.message}`)
                return {status:constants.UNAUTHORIZED, msg:'User is not authorized'}
            }

            //token is valid, get user detail
            logger.log('info', `validateToken function: User token successfully validated and acceess granted`);
            return {status:constants.SUCCESS, msg: decoded};
        });
        return result;
    }
    logger.log('info', `validateToken function: Access denied because user did not provide token for validation`);
    return {status: constants.UNAUTHORIZED, msg: "Access token not provided"}
}

export{validateToken}