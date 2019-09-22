import { gql } from "apollo-server-express";

export default gql`
  schema {
    query: RootQuery
    mutation: RootMutation
  }

  type RootQuery {
    login(phoneNumber: String!, password: String!): UserData!
    userProfile(userId: ID!): UserProfile!
    viewBlogs: [Blog!]
  }

  type RootMutation {
    createUser(
      fullName: String!
      email: String!
      password: String!
      phoneNumber: String!
    ): Status
    createBlog(title: String!, body: String!, image: String): Blog
    updateBlog(blogId: ID!, body: String, title: String): Blog
    deleteBlog(blogId: ID!): Status
  }

  type Status {
    message: String!
    value: Boolean!
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
`;
