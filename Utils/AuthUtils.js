import validator from "validator";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const cleanUpAndValidate = ({ name, email, username, password }) => {
  return new Promise((resolve, reject) => {
    if (!email || !password || !name || !username) {
      reject("Missing credentials");
    }

    if (typeof email !== "string") {
      reject("Invalid Email");
    }
    if (typeof username !== "string") {
      reject("Invalid Username");
    }
    if (typeof password !== "string") {
      reject("Invalid password");
    }

    if (username.length <= 2 || username.length > 50)
      reject("Username length should be 3-50");

    if (password.length <= 2 || password.length > 25)
      reject("Password length should be 3-25");

    if (!validator.isEmail(email)) {
      reject("Invalid Email format");
    }
    resolve();
  });
};

const generateJWTToken = (email) => {
  const JWT_TOKEN = jwt.sign(email, process.env.SECRET_KEY);
  return JWT_TOKEN;
};

const emailVerificationToken = ({email,verificationToken}) => {
  console.log("called");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user:"rahul005kumawat@gmail.com",
      pass: process.env.SECRET_MAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: "Module Test",
    to: email,
    subject: "Email Verification token for module test",
    html: `Click <a href="https://nodemoduletest-production.up.railway.app/verification/${verificationToken}">Here!!</a>`,
  }
  transporter.sendMail(mailOptions, function (err, response) {
    if (err) throw err;
    console.log("Mail was sent succeessfully to user");
  });
}

const forgotpasswordEmailVerification=({email,verificationToken})=>{
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user:"rahul005kumawat@gmail.com",
      pass: process.env.SECRET_MAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: "Module Test",
    to: email,
    subject: "Email Verification token for module test forgot password",
    html: `Click <a href="https://nodemoduletest-production.up.railway.app/forgotPasswordVerification/${verificationToken}">Here!!</a>`,
  }
  transporter.sendMail(mailOptions, function (err, response) {
    if (err) throw err;
    console.log("Mail was sent succeessfully to user");
  });
}
export{ cleanUpAndValidate,generateJWTToken,emailVerificationToken,forgotpasswordEmailVerification };