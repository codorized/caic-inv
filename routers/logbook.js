const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
var client = require('../db/config').client;
const { checkAuthenticated } = require('./../auth')
router.all('*', checkAuthenticated)

router.get('/',async function (req, res) {
    var logObj = await methods.getNotifsAll(client, 10, 0)
   
    res.render('innerpages/logbook', {items: logObj});
});

router.get('/page/:no',async function (req, res) {
    
    var skipNo = (parseInt(req.params.no)*10)-10
    var result = await methods.getNotifsAll(client, 10, skipNo)
    
    res.send(result);
});

// router.post('/createLogItem',async function (req, res) {
//     await methods.createLogItem(client, req.user, req.body)
// });


module.exports  = router;