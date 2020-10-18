//Server
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const path = require('path');
var bodyParser  = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//Methods
const methods = require('./db/methods');

app.set('view engine', 'pug')

//Sockets IO
var io = require('socket.io')(http);
//MongoDb
const { MongoClient } = require('mongodb');

async function main() {

  const uri = "mongodb://codor2:codor2@caic-shard-00-00.ag1uv.gcp.mongodb.net:27017,caic-shard-00-01.ag1uv.gcp.mongodb.net:27017,caic-shard-00-02.ag1uv.gcp.mongodb.net:27017/test?ssl=true&replicaSet=atlas-jkfvz0-shard-0&authSource=admin&retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  app.get('/', async function (req, res) {
    res.render('login', {});
  })

  app.post('/', async function (req, res) {
    console.log(req.body);
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

  app.get('/dashboard', async function (req, res) {
    res.render('index', {title: "CAIC", 
                         items: await methods.getItems(client, 10), 
                         stats: await methods.getStats(client), 
                         urgenCount: await methods.getUrgents(client), 
                         clientCount: await methods.getClients(client), 
                         statusStats: await methods.getStatusStats(client)});
  })

  app.get('/insertRandomData',async function (req, res) {
    res.render('random', {});
  })

  app.get('/viewAllMotors',async function (req, res) {
    res.render('viewAll', {items: await methods.getItems(client, -1)});
  })

  app.post('/insertRandomData',async function (req, res) {
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

  app.get('/motorForm', async (req, res) => {
    res.render('motorForm', {maxTagID: await methods.getMaxTagID(client)});
  });
  

  app.post('/motorForm', async function (req, res) {
    var inputObj = {
        tagID:  parseInt(req.body.tagID),
        status: req.body.status,
        currDate: req.body.currDate,
        urgent: req.body.urgent,
        salesRep: req.body.salesRep,
        datePulledOut: req.body.datePulledOut,
        company: req.body.company,
        motorType: req.body.motorType,
        hp: req.body.hp,
        kw: req.body.kw,
        rpm: req.body.rpm,
        others: [
          { 
            name: 'Motor Assy',
            isChecked: req.body['motor-assy']
          },
          { 
            name: 'AC ASSY',
            isChecked: req.body['ac-assy']
          },
          { 
            name: 'Fabrication',
            isChecked: req.body.fabrication
          },
          { 
            name: 'Machining',
            isChecked: req.body.machining
          }
        ], 
        parts: [
          { 
            name: 'Fan Cover', 
            isChecked: req.body['fan-cover']
          },
          {
            name: 'Stator', 
            isChecked: req.body.stator
          },
          {
            name: 'Keystock (CUÑA)', 
            isChecked: req.body.keystock,
          },
          {
            name: 'Fan Blade', 
            isChecked: req.body['fan-blade']
          },
          {
            name: 'Rotor', 
            isChecked: req.body.rotor
          },
          {
            name: 'Centrifugal', 
            isChecked: req.body.centrifugal
          },
          {
            name: 'Terminal Box', 
            isChecked:  req.body['terminal-box'],
          },
          {
            name: 'Pulley', 
            isChecked: req.body.pulley,
          },
          {
            name: 'Governor-Switch', 
            isChecked: req.body['governor-switch']
          },
          {
            name: 'Terminal', 
            isChecked: req.body.terminal
          },
          {
            name: 'Carbon', 
            isChecked: req.body.carbon
          },
          {
            name: 'Capacitor', 
            isChecked: req.body.capacitor
          },
          {
            name: 'Terminal Block', 
            isChecked: req.body['terminal-block']
          },
          {
            name: 'Carbon Holder', 
            isChecked: req.body['carbon-holder'],
          },
          {
            name: 'Impeller', 
            isChecked: req.body.impeller
          },
          {
            name: 'Bolts and Nuts', 
            isChecked: req.body['bolts-and-nuts']
          }, 
          {
            name: 'Coupling', 
            isChecked: req.body.coupling
          }
        ],
        remarks: req.body.remarks
      }

    if(req.body.rb == 'hp')
    {
      inputObj.hp = req.body['hp-kw'];
      inputObj.kw = '';
    }else 
    {
      inputObj.hp = '';
      inputObj.kw = req.body['hp-kw'];
    }
    console.log(inputObj);
    await methods.insertItem(client, inputObj);
    res.render('motorForm', {maxTagID: await methods.getMaxTagID(client)});
  })


  app.use(express.static('public'));

  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  try {
      // Connect to the MongoDB cluster
      await client.connect();
      console.log('MongoDB connected...'); 

      const PORT = process.env.PORT || 5000;
      http.listen(PORT , () => {
        console.log('listening on: '+ PORT);
      });

      await methods.monitorListingsUsingHasNext(client, methods.printCheapestSuburbs(client, "Australia", "Sydney", 10), io);

  } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
  }
}

main().catch(console.error);
