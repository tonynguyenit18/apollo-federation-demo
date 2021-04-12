const { buildFederatedSchema } = require("@apollo/federation");
const { ApolloServer, gql } = require("apollo-server");

const reviews = [
  {
    id: "1",
    authorID: "1",
    product: { upc: "1" },
    body: "Love it!",
  },
  {
    id: "2",
    authorID: "1",
    product: { upc: "2" },
    body: "Too expensive.",
  },
  {
    id: "3",
    authorID: "2",
    product: { upc: "3" },
    body: "Could be better.",
  },
  {
    id: "4",
    authorID: "2",
    product: { upc: "1" },
    body: "Prefer something else.",
  },
];

const types = gql`
  type Query {
    reviews: [Review]
  }
  type Review {
    id: ID!
    body: String
    author: User
    product: Product
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
  }

  extend type Product @key(fields: "upc") {
    upc: String! @external
    reviews: [Review]
  }
`;

const resolvers = {
  Query: {
    reviews: () => reviews,
  },

  Review: {
    author: (review, args) => {
      return { id: review.authorID}
    },
    product: (review) => {
      console.log(products.find((p) => p.upc === review.product.upc));
      return products.find((p) => p.upc === review.product.upc);
    },
  },

  User: {
    reviews: (user) => {
      return reviews.filter((review) => review.authorID === user.id);
    },
  },
  Product: {
    reviews: (product) => {
      return reviews.filter((review) => review.product.upc === product.upc);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs: types, resolvers: resolvers }]),
});
server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
