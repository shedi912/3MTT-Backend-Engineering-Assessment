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

//This must be set else, session will never, ever work
// app.use(cors({
//   origin:["http://localhost:5173"],
//   methods: ["POST", "GET", "DELETE", "PUT"],
//   credentials: true
// }));
app.use(cors());
app.use(cookieParser());

connect(); //create mongodb connection

// app.use(session({
//   name: 'newtestname',
//   secret: process.env.ACCESS_TOKEN_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,
//     maxAge: 1000 * 60 * 60 *24
//   }
// }))


// route middleware

app.use("/api/users", userRoute);
app.use('/api/blog', articleRoute);
// app.use(errorHandler); //custom error handler

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

