import { mergeResolvers } from "merge-graphql-schemas";

import eventResolver from "./eventResolver";
import userResolver from "./userResolver";

const resolvers = [eventResolver, userResolver];

export default mergeResolvers(resolvers);
