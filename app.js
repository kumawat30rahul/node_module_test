import express from "express";
import * as dotenv from "dotenv";
import dbConnection from "./db.js";
import AuthRouter from "./Controllers/AuthController.js";
import session from "express-session";
import mongoDbSession from "connect-mongodb-session";


//database and dotenc initialisation
const app = express();
dotenv.config();

//middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const mongo_db_session = mongoDbSession(session);
const store = new mongo_db_session({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//home route
app.get("/", (req, res) => {
  return res.send(true);
});

//register route
app.get("/auth/register", (req, res) => {
  return res.render("register");
});

//login route
app.get("/auth/login", (req, res) => {
  return res.render("login");
});

//change-password route
app.get("/auth/change-password", (req, res) => {
  return res.render("changingPassword");
});

//forget-password route
app.get("/auth/forget-password",(req,res)=>{
  return res.render("forgot-password")
})

//dashboard route


//routes
app.use("/auth", AuthRouter);

const PORT = process.env.PORT;
app.listen(PORT, (req, res) => {
  console.log(`Server Working on port ${PORT}`);
});

//db connection function
dbConnection();
