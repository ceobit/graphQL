const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')

const app = express();

app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }
    type RootMutation {
      createEvent(name: String): String
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => ['Romantic cooking', 'Sailing', 'All-night coding'],
    createEvent: args => args.name
  },
  graphiql: true //debugging
}));

app.listen(3100);