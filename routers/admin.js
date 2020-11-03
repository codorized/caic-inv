const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
var client = require('../db/config').client;


router.get('/insertRandomData',async function (req, res) {
    res.render('random', {});
  });

router.post('/insertRandomData',async function (req, res) {
    for(var i=0; i< parseInt(req.body.noOfInput); i++)
    {
      try {
        await methods.sleep(3000);
        await methods.insertItem(client, await methods.insertRandom(client));
      } catch(error){
      }
    }
    res.render('randomSuccess', {});
})

module.exports  = router;