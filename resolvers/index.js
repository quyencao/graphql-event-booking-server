import { mergeResolvers } from "merge-graphql-schemas";

import eventResolver from "./eventResolver";
import userResolver from "./userResolver";
import bookingResolver from "./bookingResolver";

const resolvers = [eventResolver, userResolver, bookingResolver];

export default mergeResolvers(resolvers);
