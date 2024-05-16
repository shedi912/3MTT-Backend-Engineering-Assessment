import Joi from 'joi';

// Validate vehicle order request input
async function validateNewArticle(user){
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow(''), 
        author: Joi.string().allow(''),
        tags: Joi.string().allow(''),  
        body: Joi.string().required(),

        });
    
    try {
        return await schema.validateAsync(user);
    } catch (error) {
       throw Error(error.details[0].message);
    }
}

export{validateNewArticle}
