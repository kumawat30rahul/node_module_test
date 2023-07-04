import mongoose  from "mongoose";

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Database connected succesfully");
    })
    .catch((error)=>{
        console.log(error);
    })
}

export default dbConnection