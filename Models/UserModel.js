import UserSchema from "../Schema/UserSchema.js";
import bcrypt from "bcrypt";

const userModel = class {
  username;
  name;
  email;
  password;

  constructor({ name, email, username, password }) {
    (this.name = name),
      (this.email = email),
      (this.username = username),
      (this.password = password);
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT_ROUND)
      );

      const User = new UserSchema({
        name: this.name,
        email: this.email,
        username: this.username,
        password: hashedPassword,
        emailAuthenticated: false
      });

      try {
        const userDb = await User.save();

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyEmailAndUsername({username,email}){
    return new Promise(async (resolve,reject)=>{
        try {
            const userDb = await UserSchema.findOne({
                $or: [{email},{username}]
            })

            if(userDb && userDb.email === email){
                 reject("Email Already Exists")
            }

            if(userDb && userDb.username === username){
                reject("Username already exists")
            }

            return resolve()
        } catch (error) {
            return reject(error)
        }
    })
  }



  static loginUser({loginId,password}){
    return new Promise(async (resolve, reject) => {
        //finding the user with loginId
        try {
          const userDb = await UserSchema.findOne({
            $or: [{ email: loginId }, { username: loginId }],
          });
  
          if (!userDb) {
            return reject("User does not exit");
          }
  
          //matching the password
          const isMatch = await bcrypt.compare(password, userDb.password);
  
          if (!isMatch) {
            reject("Password Does not matched");
          }
  
          resolve(userDb);
        } catch (error) {
          reject(error);
        }
      });
  }

  static forgetPassword({loginId,newpassword}){
    return new Promise(async (resolve,reject)=>{
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });

        if (!userDb) {
          return reject("User does not exit");
        }

        const hashedPassword = await bcrypt.hash(
          newpassword,
          parseInt(process.env.SALT_ROUND)
        );

        userDb.password = hashedPassword

        await userDb.save()

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    })
  }
};

export { userModel };
