import { mergeTypes, fileLoader } from "merge-graphql-schemas";

const typesArray = fileLoader(__dirname);

export default mergeTypes(typesArray, { all: true });
