import { buildSchema } from "graphql";

export default buildSchema(`
    schema {
        query: RootQuery
        mutation: RootMutation
    }

    type RootQuery {
        blogs: [Blogs!]!
    }

    type RootMutation {
        createUser(userInput: UserInput): Status
    }

    type Status {
        message: String
        value: Boolean
    }

    input UserInput {
        fullname: String!
        email: String!
        password: String!
    }

    type Blogs {
        title: String!
    }
`);
