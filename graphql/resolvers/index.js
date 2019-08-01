import authResolver from "./auth";
import blogResolver from "./blog";

const graphQlResolvers = {
  ...authResolver,
  ...blogResolver
};

export default graphQlResolvers;
