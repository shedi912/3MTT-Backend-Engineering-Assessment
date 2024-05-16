import express from "express";
import cors from "cors"; //only installed due to core error
import cookieParser from "cookie-parser";
// import session from "express-session";
import {userRoute} from "./routes/user.js";
import {articleRoute} from "./routes/article.js";

// import bodyParser from "body-parser";
import dotenv from 'dotenv';
import { connect } from "./model/dbconfig.js";
dotenv.config();

const app = express();
app.use(express.json()); //makes it possible to answer json request

app.use(cors());

connect(); //create mongodb connection
//root middleare
app.use("/api/users", userRoute);
app.use('/api/blog', articleRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

