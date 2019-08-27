import { gql } from "apollo-server-express";

export default gql`
  schema {
    query: RootQuery
    mutation: RootMutation
  }

  type RootQuery {
    login(phoneNumber: String!, password: String!): UserData!
    userProfile(userId: ID!): UserProfile!
    viewBlogs: [Blog!]!
  }

  type RootMutation {
    createUser(userInput: UserInput): Status
    createBlog(blogInput: BlogInput): Blog
    updateBlog(blogId: ID!, body: String, title: String): updatedBlog
    deleteBlog(blogId: ID!): Status
    uploadImage(fileName: String!): String!
  }

  type Status {
    message: String!
    value: Boolean!
  }

  input UserInput {
    fullName: String!
    email: String!
    password: String!
    phoneNumber: String!
  }

  type UserData {
    userId: ID!
    token: String!
    tokenEXpiration: Int!
  }

  type UserProfile {
    _id: ID!
    email: String!
    fullName: String!
    phoneNumber: String!
    createdBlogs: [Blog!]
  }

  type Blog {
    _id: ID!
    title: String!
    body: String!
    image: String
    createdAt: String!
    updatedAt: String!
    createdBy: UserProfile!
  }

  input BlogInput {
    title: String!
    body: String!
    image: String
  }

  type updatedBlog {
    title: String
    body: String
    image: String
    createdAt: String!
    updatedAt: String!
  }
`;
