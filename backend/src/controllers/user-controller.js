import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
export const userCltr = {};
import jwt from "jsonwebtoken";

userCltr.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
    });
  }

  const { email, password, name, role } = req.body;

  try {
    const user = new User({ email, password, name, role });
    const salt = await bcryptjs.genSalt();
    const hash = await bcryptjs.hash(password, salt);
    user.password = hash;
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email is already taken" });
    }
    return res.status(500).json({ error: "something went wrong" });
  }
};

userCltr.login = async (req, res) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ errors: "invalid email or password" });
    }
    const isVerified = await bcryptjs.compare(password, user.password);
    if (!isVerified) {
      return res.status(400).json({ message: "inavlid email or password" });
    }
    const tokenData = { userId: user._id };
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const userData = user.toObject();
    delete userData.password;
    console.log("Login response:", { token, user: userData });
    return res.json({ token: token, user: userData });
  } catch (err) {
    console.log(err);
  }
};

userCltr.getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select("-password");
    return res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
