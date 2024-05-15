import User from "../models/user.model.js";
import bcrypt from "bcrypt";
// import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
   
   const passwordHash = await bcrypt.hash(password, 10);
   
    const newUser = new User({
        username,
        email,
        password: passwordHash,
    });
// saving the user
    const userSaved = await newUser.save();
     //create token
     const token = await createAccessToken({ 
      id: userSaved._id,
    });

    res.cookie("token", token, {
        //    httpOnly: process.env.NODE.ENV !== "development",
        //    secure: true,
        //    sameSite: "none",
    });

    res.json({
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
          })
  } catch (error) {
    console.log("Error en el registro de usuario: ", error);
  }
};

export const login = (req, res) => res.send("mi primer consulta jaja");
