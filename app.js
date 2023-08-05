import express from "express";
import * as dotenv from "dotenv";
import dbConnection from "./db.js";
import AuthRouter from "./Controllers/AuthController.js";
import ConnectMongoDBSession from "connect-mongodb-session";
import session from "express-session";
import BookRouter from "./Controllers/BookController.js";
import { isAuth } from "./Middlewares/isAuth.js";


//database and dotenc initialisation
const app = express();
dotenv.config();

//middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const MongoStore = new ConnectMongoDBSession(session)
const store = new MongoStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
})

app.use(session({
  secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: store,
}))


//home route
app.get("/", (req, res) => {
  return res.redirect("/register");
});

//register route
app.get("/register", (req, res) => {
  return res.render("register");
});

//login route
app.get("/login", (req, res) => {
  return res.render("login");
});

// //change-password route
app.get("/change-password", (req, res) => {
  return res.render("change-password");
});

//forget-password route
app.get("/forget-password",(req,res)=>{
  return res.render("forgot-password")
})

//resend verification link
app.get(("/resend-verification") , (req,res) =>{
 return res.render("resend-verification")
})
// //dashboard route
app.get(("/dashboard"),isAuth,(req,res)=>{
 return res.render("dashboard")
})

//routes
app.use("", AuthRouter);
app.use("",BookRouter)

const PORT = process.env.PORT;
app.listen(PORT, (req, res) => {
  console.log(`Server Working on port ${PORT}`);
});

//db connection function
dbConnection();


// THb9CO8DgLWAkYuILVzQPNaVYfO4SDwo
// 3ApYzbWdZYyWM5-Sh9Em1I81V5deUrwQ