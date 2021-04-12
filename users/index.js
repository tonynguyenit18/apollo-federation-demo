const { gql, ApolloServer } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada",
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete",
  },
];

const types = gql`
  type Query {
    me(id: ID = "1"): User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;
const resolvers = {
  Query: {
    me: (parent, args) => {
      return users.find((user) => user.id === args.id);
    },
  },
  User: {
    __resolveReference(object) {
      return users.find((user) => user.id === object.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs: types, resolvers: resolvers }]),
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
