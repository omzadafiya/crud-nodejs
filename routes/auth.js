const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const path = require('path');
router.post('/register', async (req, resp) => {
    let data = await authController.register(req.body)
    resp.send(data)
});
router.get('/file/:fileName', async (req,resp) =>{
    resp.sendFile(path.join(__dirname+'/../public/images/'+req?.params?.fileName));
});

router.post('/login', async (req, resp) => {
    let data = await authController.login(req.body)

    if (data.token) {
        resp.json({
            data
        })
    }
    else {
        resp.status(409).send(data)
    }
});

router.post('/logout',async (req,resp) => {
    let data = await authController.logout(req.body)
});

module.exports = router;