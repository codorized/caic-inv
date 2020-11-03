const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
var client = require('../db/config').client;

router.get('/', async function (req, res) {
    res.render('index', {title: "CAIC", 
                         items: await methods.getItems(client, 10),  
                         stats: await methods.getStats(client), 
                         urgenCount: await methods.getUrgents(client), 
                         clientCount: await methods.getClients(client), 
                         statusStats: await methods.getStatusStats(client)});
  })

router.post('/', async function (req, res) {
    // console.log(req.body);
    if(req.body.username == 'admin'){
      if(req.body.password == 'admin'){
        res.render('index', {title: "CAIC", 
                         items: await methods.getItems(client, 10), 
                         stats: await methods.getStats(client), 
                         urgenCount: await methods.getUrgents(client), 
                         clientCount: await methods.getClients(client), 
                         statusStats: await methods.getStatusStats(client),
                         isDev: true
                        });
      }
    }
    else if(req.body.username == 'salesrep'){
         if(req.body.password == 'salesrep'){
            res.render('index', {title: "CAIC", 
                          items: await methods.getItems(client, 10), 
                          stats: await methods.getStats(client), 
                          urgenCount: await methods.getUrgents(client), 
                          clientCount: await methods.getClients(client), 
                          statusStats: await methods.getStatusStats(client),
                          isDev: false
                        });
         }
    }
    
  })

  module.exports  = router;