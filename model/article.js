
import mongoose, { Mongoose } from "mongoose";

const ArticleSchema = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {type: String, required: [true, "Article title required"], 
        unique: [true, "Article title already exist"]
    },
    description: {type: String},
    author: {type: String},
    state: {type: String, default:'draft'},
    read_count: {type: Number, default:0},
    reading_time: {type: Number},
    tags: {type: String},
    body: {
        type: String, 
        required: [true, "Please add Article body"]
    }
},
{
    timestamps: true
}
);

const ArticleModel = mongoose.model("Article", ArticleSchema);

export {ArticleModel as Article}
