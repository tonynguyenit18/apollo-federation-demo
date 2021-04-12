const { buildFederatedSchema } = require("@apollo/federation");
const { ApolloServer, gql } = require("apollo-server");

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100,
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000,
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50,
  },
];

const typeDefs = gql`
  type Query {
    topProducts(first: Int = 5): [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
  }
`;

const resolvers = {
  Query: {
    topProducts: (something, args) => {
      return products.slice(0, args.first);
    },
  },
  Product: {
    __resolverReference: (parent, args) => {
      console.log(parent);
      return parent;
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs: typeDefs, resolvers: resolvers }]),
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
