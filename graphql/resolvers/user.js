import {
  ApolloError,
  UserInputError,
  AuthenticationError
} from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { combineResolvers } from "graphql-resolvers";

import User from "../../models/users";
import { isAuthenticated } from "../../services/authorization";

export default {
  createUser: async (_, args) => {
    try {
      // Check for existing user
      const userCheck = await User.findOne({
        email: args.email
      });

      if (userCheck) {
        throw new UserInputError("User With Email Already Exists");
      }

      // Hash User Password Before saving user to DB
      const hashedPassword = await bcrypt.hash(args.password, 12);

      // Create user
      const newUser = new User({
        fullName: args.fullName,
        email: args.email,
        password: hashedPassword,
        phoneNumber: args.phoneNumber
      });

      // Save user to DB
      const savedUser = await newUser.save();

      // Response
      return {
        message: "User Was Created Successfully",
        value: true,
        user: savedUser
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  login: async ({ phoneNumber, password }) => {
    try {
      // Check if user exist in DB
      const user = await User.findOne({ phoneNumber: phoneNumber });
      if (!user) {
        throw new UserInputError("Incorrect Phone Number Or Password");
      }
      // If User Exists then Compare Passwords
      const equalPassword = await bcrypt.compare(password, user.password);
      if (!equalPassword) {
        throw new UserInputError("Incorrect Phone Number Or Password");
      }
      // Create token for user
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: "7d"
      });

      // Response
      return {
        message: token,
        value: true,
        user: user
      };
    } catch (err) {
      throw err;
    }
  },
  userProfile: combineResolvers(isAuthenticated, async (_, args) => {
    const userProfile = await User.findOne({ _id: args.userId });

    return userProfile;
  })
};
