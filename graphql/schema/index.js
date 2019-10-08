import { gql } from "apollo-server-express";

export default gql`
  scalar Date

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type Query {
    login(phoneNumber: String!, password: String!): Status
    userProfile(userId: ID!): UserProfile!
    viewBlogs: [Blog!]
  }

  type Mutation {
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

  type Subscription {
    new_blog: Blog
    update_blog: Blog
  }

  type Status {
    message: String!
    value: Boolean!
    user: UserProfile!
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
    createdAt: Date!
    updatedAt: Date!
    createdBy: UserProfile!
  }
`;
