const express = require('express');
const apolloServer = require('./graphql');
const router = require('./routes');

const app = express();
const port = 8080;

apolloServer.applyMiddleware({ app });
app.use(router);

app.listen(port, '0.0.0.0', () => {
    console.log(`App listening on port ${port}`);
    console.log(`Graphql endpoint at http://localhost:${port}${apolloServer.graphqlPath}`);
});
