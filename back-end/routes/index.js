const { Router } = require('express');
const router = Router();

const graphQlRouter = require('./graphql');

router.get('/', function(req, res) {
    res.json({
        success: true,
        message: 'Use the /graphql endpoint to make database queries.'
    });
});

router.use('/graphql', graphQlRouter);

module.exports = router;
