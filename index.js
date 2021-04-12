const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "users", url: "http://localhost:4002/graphql" },
    { name: "products", url: "http://localhost:4000/" },
    { name: "reviews", url: "http://localhost:4001/" },
  ],
});

const server = new ApolloServer({
  gateway: gateway,
  subscriptions: false,
});

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
