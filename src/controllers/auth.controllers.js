import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
   
   const passwordHash = await bcrypt.hash(password, 10);
   
    const newUser = new User({
        username,
        email,
        password: passwordHash,
    });

    const userSaved = await newUser.save();

    res.json({
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
        createdAt: userSaved.createdAt,
        updatedAt: userSaved.updatedAt,
    })
  } catch (error) {
    console.log("Error en el registro de usuario: ", error);
  }
};

export const login = (req, res) => res.send("mi primer consulta jaja");
