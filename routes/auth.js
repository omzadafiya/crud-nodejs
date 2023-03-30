const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

router.post('/register', async (req, resp) => {
    let data = await authController.register(req.body)
    resp.send(data)
});

router.post('/login', async (req, resp) => {
    let data = await authController.login(req.body)
    resp.json({
        data
    })

})

module.exports = router;