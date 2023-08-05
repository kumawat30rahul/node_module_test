import mongoose from "mongoose";

const schema = mongoose.Schema;

const bookSchema = new schema({
    title:{
        type: String,
        unique: true,
        require :true,
    },
    author:{
        type: String,
        require :true,
    },
    price:{
        type: String,
        require :true,
    },
    category:{
        type: String,
        require :true,
    },
    userkaname: {
        type: String,
        require: true,
    }

})

const Books = mongoose.model("books", bookSchema);

export default Books