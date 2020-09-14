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

app.set('view engine', 'pug')

//Sockets IO
var io = require('socket.io')(http);
//MongoDb
const { MongoClient } = require('mongodb');
//Body parser


async function main() {

  const uri = "mongodb://codor2:codor2@caic-shard-00-00.ag1uv.gcp.mongodb.net:27017,caic-shard-00-01.ag1uv.gcp.mongodb.net:27017,caic-shard-00-02.ag1uv.gcp.mongodb.net:27017/test?ssl=true&replicaSet=atlas-jkfvz0-shard-0&authSource=admin&retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  app.get('/', async function (req, res) {
    await getStats(client);
    res.render('index', {title: "CAIC", items: await getItems(client), stats: await getStats(client)});
  })

  app.get('/motorForm', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'motorForm.html'));
  });

  app.post('/motorForm', async function (req, res) {
    console.log(req.body);
    await insertItem(client,
    {
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

    });
    res.sendFile(path.join(__dirname, '/public', 'motorForm.html'));
  })


  app.use(express.static('public'));

  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  try {
      // Connect to the MongoDB cluster
      await client.connect();
      console.log('MongoDB connected...'); 

   
      http.listen(3000, () => {
        console.log('listening on *:3000');
      });

      await monitorListingsUsingHasNext(client, printCheapestSuburbs(client, "Australia", "Sydney", 10), io);
     

  } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
  }
}

main().catch(console.error);

async function monitorListingsUsingHasNext(client, pipeline = [], socket) {
  console.log('Watching has started!');
  const collection = client.db("caic-sample").collection("items");

  const changeStream = collection.watch();
  
  while (await changeStream.hasNext()) {
      socket.sockets.emit('db', JSON.stringify(await changeStream.next()));
  }
}

async function printCheapestSuburbs(client, country, market, maxNumberToPrint) {
  const pipeline = [
      {
        '$match': {
          'bedrooms': 1, 
          'address.country': country, 
          'address.market': market, 
          'address.suburb': {
            '$exists': 1, 
            '$ne': ''
          }, 
          'room_type': 'Entire home/apt'
        }
      }, {
        '$group': {
          '_id': '$address.suburb', 
          'averagePrice': {
            '$avg': '$price'
          }
        }
      }, {
        '$sort': {
          'averagePrice': 1
        }
      }, {
        '$limit': maxNumberToPrint
      }
    ];
  

  return pipeline;
}

async function insertItem(client, newListing){
  const result = await client.db("caic-sample").collection("items").insertOne(newListing);
  console.log(`New item created with the following id: ${result.insertedId}`);
}

async function getItems(client){
  const result = await client.db("caic-sample").collection("items").find({}).sort({ currDate: -1 }).limit(10);;
  console.log(`Dsiplayed all the items!`);
  return await result.toArray();
}

async function getStats(client){
  const result = await client.db("caic-sample").collection("items").aggregate([
    {
      $group: {
        _id: '$salesRep',
          count: {$sum: 1}
      }
    },
    {
      $sort: {  
        _id: 1
      }
    }
  ]);
  return await result.toArray();
}