import express from "express";
const router = express.Router();

//import controller functions
import {newArticle, getAllPublishedBlogs, getPublishedBlogDetails,
    publishBlog, updateArticle, getOwnerArticles,
    deleteArticle} from "../controller/article.js";


//Route request to the appropriate controller based on the request method
router.route("/article/new").post(newArticle);
router.route("/article/list").get(getAllPublishedBlogs);
router.route("/article/:id").get(getPublishedBlogDetails);
router.route("/article/publish/:id").put(publishBlog);
router.route("/article/update/:id").put(updateArticle);
router.route("/owner_article/list/").get(getOwnerArticles);
router.route("/article/delete/:id").delete(deleteArticle);

//ensure that we can access this variable from other files
export{router as articleRoute};
