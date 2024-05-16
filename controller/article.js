import {Article} from "../model/article.js";
import {constants} from '../constants.js';
import {validateNewArticle} from "../validation/articleValidation.js";
import {validateToken} from "../validation/accessTokenValidation.js";
import { logger } from "./logger.js";


//Calculate read time
//Formula: It is calculated as (number of words in an article / 200 words per minute).
function calculateReadTime(doc){
    const words = doc.split(' ');
    const estimate = words.length/200;
    const read_time = Math.ceil(Math.floor(estimate)+((estimate%1)*0.60))
    return read_time;
}
// @des: create new article
// @route: Post /api/blog/article/new
// @access: private
async function newArticle(req, res){
    let article = {}; 
    
    const accessToken = await validateToken(req);
    if (accessToken.status !=200) {
        return res.status(accessToken.status).json({ message: accessToken.msg, error:1});
    }

    try {
        //Validate required inputs
        article = await validateNewArticle(req.body);
    } catch (error) {
        return res.status(constants.VALIDATION_ERROR).json({ message: error.message, error:1});
    }

    try {

         // Check if article already exist
         const found = await Article.findOne({title: article.title});

        //if  not found, account does not exist
        if (found) {
            logger.log('info', `newArticle function: A user try to create an article with an already existing title.`);
            return res.status(constants.VALIDATION_ERROR).json({ message: "Article title already exist.", error:1});
        }
        
        //I'm combining the article title and body so i calculate 
        //reading time based on this two fields
        const words = `${article.title} ${article.body}`;
        article.reading_time = calculateReadTime(words);
        

        //Link this article to the user that creates it
        article.user_id = accessToken.msg.user.id;
        //Create this article
        article = await Article.create(article);
        if (article) {
            res.status(constants.SUCCESS_CREATED).json({ message: article, error:0});
        }else{
            throw new Error("Article data not valid")
        }
        logger.log('info', `newArticle function: new article was created`);
    } catch (error) {
        
        res.status(constants.FORBIDDEN).json({ message: "Article creation failed", error:1});
        logger.log('error', `newArticle function: Article creation failed. Reason: ${error.message}`);
    }
}

// @des: get list of all published articles
// @route: GET /api/blog/article/list
// @access: public
async function getAllPublishedBlogs(req, res){
    let article = {}; 

    try {

        let filter = {state: 'published'}; //check if we are filtering by article state,
        let sortby = {};
        let startDoc = 0;//doc starts at 0
        let limit = 20;
        
        //if yes, include it
        if (req.query.search) {
            let fields = req.query.search.split(',');
            filter = {...filter, [fields[0]]:fields[1].toLowerCase()};
        }
        
        //if yes include it
        if (req.query.sortby) {
            let fields = req.query.sortby.split(',');
            sortby = {[fields[0]]:Number(fields[1])};
        }
        
        if (req.query && req.query.page) {
            startDoc = (req.query.page-1);//doc starts at 0
        }
        if (req.query && req.query.per_page) {
            limit = req.query.per_page
        }

        //I'm returning total articles so frontend can build their pagination
        //with based on it
        const totalArticles = await Article.find(filter).countDocuments();

        const article = await Article.find({ author: 'Shedrack', state: 'published' }).sort(sortby).skip(startDoc).limit(req.query.per_page);
        //if  not found, account does not exist
        if (article.length>0) {
            res.status(constants.SUCCESS).json({ message: article, error:0, totalArticles: totalArticles});
        }else{
            res.status(constants.SUCCESS).json({ message: 'No blog found', error:0});
        }

        logger.log('info', `getAllPublishedBlogs function: published blog successfully returned to both login and not login users`);
    } catch (error) {
        res.status(constants.FORBIDDEN).json({ message: "Article could not be retreived ", error:1});
        logger.log('error', `getAllPublishedBlogs function: Articles could not to return to both login and not login users. Reason: ${error.message}`);
    }
}



// @des: get a published article details
// @route: GET /api/blog/article/id
// @access: public
async function getPublishedBlogDetails(req, res){
    try {
         let publishedBlogs = await Article.find({_id:req.params.id, state:'published'});

        //if  blog, update the count and return the
        //updated blog
        if (publishedBlogs) {
            publishedBlogs = await Article.findOneAndUpdate({_id:req.params.id, read_count: (publishedBlogs[0].read_count+1)});
            publishedBlogs = await Article.findById(req.params.id);
            
            res.status(constants.SUCCESS).json({ message: publishedBlogs, error:0});
        }else{
            res.status(constants.SUCCESS).json({ message: 'No blog has been published yet', error:0});
        }
        logger.log('info', `getPublishedBlogDetails function: Articles detail retreived for both login and not login users.`);
    } catch (error) {
        res.status(constants.NOT_FOUND).json({ message: "Failed to retreive blog detail", error:1});
        logger.log('error', `getPublishedBlogDetails function: Articles detail could not be returned. Reason: ${error.message}`);
    }
}


// @des: Published a blog
// @route: PUT /api/blog/article/publish/id
// @access: private
async function publishBlog(req, res){

    const accessToken = await validateToken(req);
    if (accessToken.status !=200) {
        return res.status(accessToken.status).json({ message: accessToken.msg, error:1});
    }

    //get this blog that belong to this current long in user
    const found = await Article.find({_id:req.params.id, user_id:accessToken.msg.user.id});

    //if  not found, account does not exist
    if (!found) {
        return res.status(constants.NOT_FOUND).json({ message: 'Blog not found', error:0});
    }
    
    try {
         let publishedBlogs = await Article.findByIdAndUpdate(req.params.id, {state:'published'});

        //if blog was published, return updated blog
        if (publishedBlogs) {
            publishedBlogs = await Article.findById(req.params.id);
            logger.log('info', `publishBlog function: blog successfully published`);
            return res.status(constants.SUCCESS).json({ message: publishedBlogs, error:0});
        }
        
        throw new Error('Blog not found');
        
    } catch (error) {
        res.status(constants.NOT_FOUND).json({ message: "Update failed", error:1});
        logger.log('error', `publishBlog function:Blog could not be published. Reason: ${error.message}`);
    }
}


// @des: Owner updating his article
// @route: PUT /api/blog/article/update/id
// @access: private
async function updateArticle(req, res){
    let article = {}; 
    
    const accessToken = await validateToken(req);
    if (accessToken.status !=200) {
        return res.status(accessToken.status).json({ message: accessToken.msg, error:1});
    }

    try {
        //Validate required inputs
        article = await validateNewArticle(req.body);
    } catch (error) {
        return res.status(constants.VALIDATION_ERROR).json({ message: error.message, error:1});
    }

    try {

         // Check if article already exist
         const found = await Article.find({title: article.title});

        //If this title exist and is not the same blog
        //flag as duplicate
        if (found && found._id !== article._id) {
            logger.log('info', `updateArticle function:Article could not be updated, title aready exist. Reason: ${error.message}`);
            return res.status(constants.VALIDATION_ERROR).json({ message: "Article title already exist.", error:1});
        }
        
        //I'm combining the article title and body so i calculate 
        //reading time based on this two fields
        const words = `${article.title} ${article.body}`;
        article.reading_time = calculateReadTime(words);
        
        //Update this current user aticle
        article = await Article.findByIdAndUpdate({_id:req.params.id, user_id:accessToken.msg.user.id}, article);
        
        if (article) {
            article = await Article.findById(req.params.id);
            res.status(constants.SUCCESS_CREATED).json({ message: article, error:0});
        }else{
            throw new Error("Article not updated")
        }
        logger.log('info', `updateArticle function: Article updated.`);
    } catch (error) {
        res.status(constants.FORBIDDEN).json({ message: "Article update failed", error:1});
        logger.log('error', `updateArticle function:article could not be updated. Reason: ${error.message}`);
    }
}

// @des: Deleting an article
// @route: DELETE /api/blog/article/delete/id
// @access: private
async function deleteArticle(req, res){
    const accessToken = await validateToken(req);
    if (accessToken.status !=200) {
        return res.status(accessToken.status).json({ message: accessToken.msg, error:1});
    }

    try {
        //Validate required inputs
        const article = await Article.findOneAndDelete({_id:req.params.id, user_id:accessToken.msg.user.id});
        if (article) {
            logger.log('info', `deleteArticle function:Article deletion successful.`);
            return res.status(constants.SUCCESS).json({ message: "Article deleted", error:0});
        }
        throw new Error('Article was not deleted');
    } catch (error) {
        res.status(constants.NOT_FOUND).json({ message: error.message, error:1});
        logger.log('error', `deleteArticle function:Article failed to delete. Reason: ${error.message}`);
    }
}

// @des: get all articles that belong to the current user
// @route: Get /api/blog/owner_article/list?page=1&per_page=2
// @access: private
async function getOwnerArticles(req, res){

    const accessToken = await validateToken(req);
    if (accessToken.status !=200) {
        return res.status(accessToken.status).json({ message: accessToken.msg, error:1});
    }

    try {
        //By default, on show this user articles: both draft and published
        const filter = {user_id:accessToken.msg.user.id};
        //check if we are filtering by article state,
        //if yes, include it
        if (req.query.state) {
            filter.state = req.query.state.toLowerCase().replaceAll("'", '');
        }

        //I'm returning total articles so frontend can build their pagination
        //with based on it
        const totalArticles = await Article.find(filter).countDocuments();
    
        const startDoc = (req.query.page-1);//doc starts at 0
        const article = await Article.find(filter).skip(startDoc).limit(req.query.per_page);
        if (article) {
            logger.log('info', `getOwnerArticles function: An article owner retreive articles`);
            return res.status(constants.SUCCESS).json({ message: article, error:0, totalArticles: totalArticles});
        }
        throw new Error('No article found');
    } catch (error) {
        res.status(constants.NOT_FOUND).json({ message: error.message, error:1});
        logger.log('error', `getOwnerArticles function:owner could not retreive articles. Reason: ${error.message}`);
    }
}

export{newArticle, getAllPublishedBlogs, getPublishedBlogDetails,
    publishBlog, updateArticle, getOwnerArticles, deleteArticle}