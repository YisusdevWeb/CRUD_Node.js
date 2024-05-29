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
    });
  } catch (error) {
    console.log("Error en el registro de usuario: ", error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ message: "user not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return res.status(400).json({
        message: ["password incorrect"],
      });
    }

    //create token
    const token = await createAccessToken({
      id: userFound._id,
    });

    res.cookie("token", token, {
      //    httpOnly: process.env.NODE.ENV !== "development",
      //    secure: true,
      //    sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
