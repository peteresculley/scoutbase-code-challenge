const { Router } = require('express');
const router = Router();

router.get('/', function(req, res) {
    res.json({
        success: true,
        message: 'Use the /graphql endpoint to make database queries.'
    });
});

module.exports = router;
