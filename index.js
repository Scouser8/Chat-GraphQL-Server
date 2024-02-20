// import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import { schema } from "./schema.js";

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });

// console.log(`🚀  Server ready at: ${url}`);

import { createServer } from "node:http";
import { createPubSub, createYoga } from "graphql-yoga";

import { schema } from "./schema.js";

const pubsub = createPubSub();
// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
  schema,
  subscriptions: {
    path: "/subscriptions",
  },
  context: { pubsub },
});

// Pass it into a server to hook into request handlers.
const server = createServer(yoga);

// Start the server and you're done!
server.listen(4000, () => {
  console.info("🚀 Server is running on http://localhost:4000/graphql");
});
