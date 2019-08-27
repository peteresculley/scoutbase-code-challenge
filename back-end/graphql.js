const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./database');

const typeDefs = gql`
    type Query {
        movies: [Movie]
    }
    type Movie {
        scoutbase_rating: String
        title: String
        year: Int
        rating: Float
        actors: [Actor]
    }
    type Actor {
        name: String
        birthday: String
        country: String
        directors: [Director]
    }
    type Director {
        name: String
        birthday: String
        country: String
    }
    type Mutation {
        createUser(username: String!, password: String!): UserWithToken
        login(username: String!, password: String!): UserWithToken
    }
    type UserWithToken {
        token: ID
        user: User
    }
    type User {
        id: ID
        name: String
    }
`;

const resolvers = {
    Query: {
        movies() {
            return db.getMovies();
        }
    },
    Mutation: {
        createUser(obj, {username, password}) {
            return db.createUser(username, password);
        },
        login(obj, {username, password}) {
            return db.login(username, password);
        }
    },
    Movie: {
        scoutbase_rating(obj, {}, { me }) {
            return obj.getScoutbaseRating(me);
        },
        title(obj) {
            return obj.getTitle();
        },
        year(obj) {
            return obj.getYear();
        },
        rating(obj) {
            return obj.getRating();
        },
        actors(obj) {
            return obj.getActors();
        }
    },
    Actor: {
        name(obj) {
            return obj.getName();
        },
        birthday(obj) {
            return obj.getBirthday();
        },
        country(obj) {
            return obj.getCountry();
        },
        directors(obj) {
            return obj.getDirectors();
        }
    },
    Director: {
        name(obj) {
            return obj.getName();
        },
        birthday(obj) {
            return obj.getBirthday();
        },
        country(obj) {
            return obj.getCountry();
        }
    },
    UserWithToken: {
        token(obj) {
            return obj.getToken();
        },
        user(obj) {
            return obj.getUser();
        }
    },
    User: {
        id(obj) {
            return obj.getId();
        },
        name(obj) {
            return obj.getName();
        }
    }
};

function context({ req }) {
    return db.getContextFromReq(req);
}

const server = new ApolloServer({ typeDefs, resolvers, context });

module.exports = server;
