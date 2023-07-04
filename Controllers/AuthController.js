import express from "express";
import jwt from 'jsonwebtoken'
import {
  cleanUpAndValidate,
  emailVerificationToken,
  generateJWTToken,
  forgotpasswordEmailVerification
} from "../Utils/AuthUtils.js";
import { userModel } from "../Models/UserModel.js";
import UserSchema from "../Schema/UserSchema.js";

const AuthRouter = express.Router();

//register route
AuthRouter.post("/register", async (req, res) => {
  const { name, email, password, username } = req.body;
  console.log(req.body);
  await cleanUpAndValidate({ name, email, password, username })
    .then(async () => {
      try {
        await userModel.verifyEmailAndUsername({ username, email });
      } catch (error) {
        return res.send({
          status: 400,
          message: "Error Occured",
          error: error,
        });
      }
      const userObj = new userModel({
        username,
        name,
        email,
        password,
      });

      try {
        const userDb = await userObj.registerUser();
        const verificationToken = generateJWTToken(email);
        console.log(verificationToken);
        //sent mail function
        emailVerificationToken({ email, verificationToken });

        return res.send({
          status: 200,
          message:
            "Registeration done, Link has been sent to your email id plz verify before login",
        });
      } catch (error) {
        return res.send({
          status: 500,
          message: "Database Error",
          error: error,
        });
      }
    })
    .catch((error) => {
      return res.send({
        status: 400,
        message: "Client Error",
        error: error,
      });
    });
});

//login route
AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Credentials Missing",
    });
  }

 


  try {
    
    const userDb = await userModel.loginUser({ loginId, password });
    console.log(userDb._id);
    console.log(req.session.id);

    // implementing session based authentication
    req.session.isAuth = true;

    req.session.user = {
      email: userDb.email,
      username: userDb.username,
      userId: userDb._id,
    };

    return res.redirect("/auth/dashboard")
  } catch (error) {
    return res.send({
      status: 500,
      message: "Error Occured",
      error: error,
    });
  }
});

// const verificationToken = generateJWTToken(loginId);
// console.log(verificationToken);
//sent mail function
// emailVerificationToken({ loginId, verificationToken });

// return res.send({
//   status: 200,
//   message:
//     "Link has been sent forgot password",
// });

AuthRouter.post("/forget-password", async (req,res)=>{
  console.log(req.body);
  const {loginId} = req.body
  console.log("thid is login id========",loginId);
  try {
    const userDb = await UserSchema.findOne({email: loginId})
    console.log(userDb);
    if(userDb){
      const verificationToken = generateJWTToken(loginId);
      console.log(verificationToken);
      //sent mail function
      forgotpasswordEmailVerification({email: loginId, verificationToken });
    }else{
      return res.send({
        status: 400,
        message: "User Not found"
      })
    }
    alert("link sent")
  } catch (error) {
    return res.send({
      status: 400,
      message: "User Not found with this email",
      error: error
    })
  }

})

AuthRouter.post("/change-password",async (req,res)=>{
  console.log(req.body);
  const {loginId,newpassword} = req.body
  if (!loginId || !newpassword) {
    return res.send({
      status: 400,
      message: "Credentials Missing",
    });
  }
  try {
    const userDb = await userModel.forgotPassword({loginId,newpassword})
    
    return res.redirect("/auth/login")
  } catch (error) {
    return res.send({
      status: 400,
      message: "password not changed",
      error: error
    })
  }
})

AuthRouter.get("/verification/:token",(req,res)=>{
  const verificationToken = req.params.token;
  console.log(verificationToken);
  jwt.verify(verificationToken,process.env.SECRET_KEY,async(err,decoded)=>{
    try {
      const userDb = await UserSchema.findOneAndUpdate(
        { email: decoded },
        { emailAuthenticated: true }
      );
      console.log(userDb);
      return res.status(200).redirect("/auth/login");
      
    } catch (error) {
      res.send({
        status: 500,
        message: "database error",
        error: error,
      });
  }
})
})
AuthRouter.get("/forgotPasswordVerification/:token",(req,res)=>{
  const verificationToken = req.params.token;
  console.log(verificationToken);
  jwt.verify(verificationToken,process.env.SECRET_KEY,async(err,decoded)=>{
    try {
      const userDb = await UserSchema.findOneAndUpdate(
        { email: decoded },
        { emailAuthenticated: true }
      );
      console.log(userDb);
      return res.status(200).redirect("/auth/change-password");
      
    } catch (error) {
      res.send({
        status: 500,
        message: "database error",
        error: error,
      });
  }
})
})

export default AuthRouter;
