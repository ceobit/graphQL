const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const { PORT, dbURI } = require("./config");
const Event = require("./models/event");

const app = express();

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
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
      events: () => {
        return Event.find()
          .then((events) =>
            events.map((event) => {
              return { ...event._doc, _id: event._doc._id.toString() };
            })
          )
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        const { title, description, price, date } = args.eventInput;
        const event = new Event({
          title: title,
          description: description,
          price: +price,
          date: new Date(date),
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    graphiql: true, //debugging
  })
);

mongoose
  .connect(dbURI)
  .then(() => app.listen(PORT))
  .catch((err) => console.log(`MongoDB connection problem ${err}`));
