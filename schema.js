import { createSchema } from "graphql-yoga";

const messages = [];

const subscribers = [];

const onMessagesUpdates = (cb) => subscribers.push(cb);

const typeDefs = `#graphql
    type Message {
        id: ID!
        content: String!
        username: String!
        mentionedUsers: [String]!
    }
    type Query {
        messages: [Message!]
    }
    type Mutation {
        postMessage(username: String!, content: String!, mentionedUsers: [String]! ): ID!
    }
    type Subscription {
        messages: [Message!]
    }
`;

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { username, content, mentionedUsers }) => {
      const id = messages.length;
      messages.push({ id, username, content, mentionedUsers });
      subscribers.forEach((fn) => fn());
      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        const cb = () => pubsub.publish(channel, { messages });
        onMessagesUpdates(cb);
        setTimeout(cb, 0);
        return pubsub.subscribe(channel);
      },
    },
  },
};

export const schema = createSchema({
  typeDefs,
  resolvers,
});
