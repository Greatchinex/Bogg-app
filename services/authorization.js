import { AuthenticationError } from "apollo-server-express";
import { skip } from "graphql-resolvers";

/*
    Functions to protect Various resolvers based on permission levels
*/

// Check if user is logged in
export const isAuthenticated = (_, __, { logged_in_user, Id }) =>
  logged_in_user ? skip : new AuthenticationError("Authorization Denied");
