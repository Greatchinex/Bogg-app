import { buildSchema } from "graphql";

export default buildSchema(`
    schema {
        query: RootQuery
        mutation: RootMutation
    }

    type RootQuery {
        login(phoneNumber: String!, password: String!): UserData!
    }

    type RootMutation {
        createUser(userInput: UserInput): Status
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
`);
