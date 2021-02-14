const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')

const app = express();

app.use(express.json());

const events = []; //temp. solution while there's not db

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(` 
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    
    input EventInput { 
      title: String!
      description: String!
      price: Float!
      date: String!
    }
  
    type RootQuery {
      events: [Event!]!
    }
    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => events,
    createEvent: args => {
      const { title, description, price, date } = args.eventInput;
      const event = {
        _id: Math.random().toString(),
        title: title,
        description: description,
        price: +price,
        date: date
      }
      events.push(event);
      return event;
    }
  },
  graphiql: true //debugging
}));

app.listen(3100);