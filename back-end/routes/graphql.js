const { Router } = require('express');
const router = Router();

router.get('/', function(req, res) {
    res.json({
        message: 'Graphql to be implemented soon!'
    });
});

module.exports = router;
