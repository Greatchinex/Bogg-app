import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../models/users";

export default {
  createUser: async args => {
    try {
      // Check for existing user
      const userCheck = await User.findOne({
        email: args.userInput.email
      });

      if (userCheck) {
        throw new Error("User With Email Already Exists");
      }

      // Hash User Password Before saving user to DB
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      // Create user
      const newUser = new User({
        fullName: args.userInput.fullName,
        email: args.userInput.email,
        password: hashedPassword,
        phoneNumber: args.userInput.phoneNumber
      });

      // Save user to DB
      const savedUser = await newUser.save();

      // Response
      return {
        message: "User Was Created Successfully",
        value: true
      };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ phoneNumber, password }) => {
    try {
      // Check if user exist in DB
      const user = await User.findOne({ phoneNumber: phoneNumber });
      if (!user) {
        throw new Error("Incorrect Phone Number Or Password");
      }
      // If User Exists then Compare Passwords
      const equalPassword = await bcrypt.compare(password, user.password);
      if (!equalPassword) {
        throw new Error("Incorrect Phone Number Or Password");
      }
      // Create token for user
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: "1h"
      });
      return {
        userId: user._id,
        token,
        tokenEXpiration: 1
      };
    } catch (err) {
      throw err;
    }
  },
  userProfile: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Authorization Denied");
    }
    const userProfile = await User.findOne({ _id: args.userId });

    return {
      ...userProfile._doc
    };
  }
};
