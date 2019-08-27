const { AuthenticationError } = require('apollo-server-express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = 'test stub secret';
const jwtTokensExpireIn = '60m';

function generateNewToken(username) {
    return jwt.sign(
        { username },
        jwtSecret,
        { expiresIn: jwtTokensExpireIn }
    );
}

function createTestMovies() {
    // Directors
    const LanaWachowski = new Director('Lana Wachowski', '21/06/1965', 'USA');
    const LillyWachowski = new Director('Lilly Wachowski', '29/12/1967', 'USA');
    const ChadStahelski = new Director('Chad Stahelski', '20/09/1968', 'USA');

    // Actors
    const KeanuReeves = new Actor('Keanu Reeves', '02/09/1964', 'Lebanon', [LanaWachowski, LillyWachowski, ChadStahelski]);
    const LaurenceFishburne = new Actor('Laurence Fishburne', '30/07/1961', 'USA', [LanaWachowski, LillyWachowski]);
    const WillemDafoe = new Actor('Willem Dafoe', '22/07/1955', 'USA', [ChadStahelski]);

    // Movies
    const TheMatrix = new Movie('The Matrix', 1999, 8.7, [KeanuReeves, LaurenceFishburne]);
    const JohnWick = new Movie('John Wick', 2014, 7.4, [KeanuReeves, WillemDafoe]);

    const movies = [TheMatrix, JohnWick];
    return movies;
}

class Database {
    constructor() {
        this.movies = createTestMovies();
        this.usersWithTokens = {};
    }

    getMovies() {
        return this.movies;
    }

    createUser(username, password) {
        const newToken = generateNewToken(username);
        const newUser = new User(username, password);
        const newUserWithToken = new UserWithToken(newUser, newToken);

        this.usersWithTokens[username] = newUserWithToken;
        return newUserWithToken;
    }

    login(username, password) {
        const userWithToken = this.usersWithTokens[username];

        if(userWithToken && userWithToken.user.isPasswordCorrect(password)) {
            userWithToken.setToken(generateNewToken(username));
            return userWithToken;
        } else {
            throw new AuthenticationError('Invalid username or password.');
        }
    }

    getContextFromReq(req) {
        const token = req.headers['x-token'];

        if(token) {
            try {
                const decodedToken = jwt.verify(token, jwtSecret);
                return { me: decodedToken };
            } catch(err) {
                throw new AuthenticationError('Your session has expired.');
            }
        }
    }
}

class UserWithToken {
    constructor(user, token) {
        this.user = user;
        this.token = token;
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token;
    }
}


let nextUserId = 1;

class User {
    constructor(username, password) {
        const saltRounds = 10;

        this.username = username;
        const passwordHash = bcrypt.hashSync(password, saltRounds);
        this.passwordHash = passwordHash;

        this.id = nextUserId++;
    }

    getName() {
        return this.username;
    }

    getId() {
        return this.id;
    }

    getPasswordHash() {
        return this.passwordHash;
    }

    isPasswordCorrect(password) {
        return bcrypt.compareSync(password, this.passwordHash);
    }
}

class Movie {
    constructor(title, year, rating, actors) {
        this.title = title;
        this.year = year;
        this.rating = rating;
        this.actors = actors;
    }

    getTitle() {
        return this.title;
    }

    getYear() {
        return this.year;
    }

    getRating() {
        return this.rating;
    }

    getActors() {
        return this.actors;
    }

    getScoutbaseRating(me) {
        if(me) {
            // random number from 5.0 to 9.0 as a string
            return ((Math.random() * 4.0) + 5.0).toFixed(1);
        } else {
            throw new AuthenticationError('Not authenticated.');
        }
    }
}

class Person {
    constructor(name, birthday, country) {
        this.name = name;
        this.birthday = birthday;
        this.country = country;
    }

    getName() {
        return this.name;
    }

    getBirthday() {
        return this.birthday;
    }

    getCountry() {
        return this.country;
    }
}

class Actor extends Person {
    constructor(name, birthday, country, directors) {
        super(name, birthday, country);
        this.directors = directors;
    }

    getDirectors() {
        return this.directors;
    }
}

class Director extends Person {}

module.exports = Database;
