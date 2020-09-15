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
    res.render('index', {title: "CAIC", 
                         items: await getItems(client, 10), 
                         stats: await getStats(client), 
                         urgenCount: await getUrgents(client), 
                         clientCount: await getClients(client), 
                         statusStats: await getStatusStats(client)});
  })

  app.get('/insertRandomData',async function (req, res) {
    res.render('random', {});
  })

  app.get('/viewAllMotors',async function (req, res) {
    res.render('viewAll', {items: await getItems(client, -1)});
  })

  app.post('/insertRandomData',async function (req, res) {
    for(var i=0; i< parseInt(req.body.noOfInput); i++)
    {
      try {
        await sleep(3000);
        await insertItem(client, await insertRandom(client));
      } catch(error){

      }
      
    }
    res.render('randomSuccess', {});
  })

  app.get('/motorForm', async (req, res) => {
    res.render('motorForm', {maxTagID: await getMaxTagID(client)});
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
    await insertItem(client, inputObj);
    res.render('motorForm', {maxTagID: await getMaxTagID(client)});
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

async function getItems(client, count){
  var result;
  if(count == -1){
    result = await client.db("caic-sample").collection("items").find({}).sort({ tagID: -1 });
  }
  else{
    result = await client.db("caic-sample").collection("items").find({}).sort({ tagID: -1 }).limit(count);
  }
  
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

async function getUrgents(client){
  const result = await client.db("caic-sample").collection("items").aggregate([
    {
      $group: {
        _id: '$urgent',
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

async function getClients(client){
  const result = await client.db("caic-sample").collection("items").aggregate([
    {
      $group: {
        _id: '$company',
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

async function insertRandom(client){
  var statusx = ['Not Started','On Check-up','For Quotation','Awaiting Purchase Order','On Rewind','On Fabrication','In Baking','Waiting for Materials','Assembly and Testing','Painting','For Delivery','For Billing Statement','For OR','Completed']; 
  var salesRepx = ['Dulce Importante', 'Evelyn Malabanan', 'Kate Banosong', 'Ronnie Uy', 'Walk-in'];
  var urgentx = ['on', null];
  var currDatex = '2020-09-15';
  var datePulledOutx = '2020-09-15';
  var companyx = ['Asia Brewery', 'Coca cola', 'Concepcion Durables Inc.', 'Enchanted Kingdom', 'Gardenia', 'Honda', 'Nestle'];
  var motorTypex = ['Nidec Motor', 'Rockwell Automation', 'AMETEK', 'Regal Beloit'];
  var HPx = 123;
  var KWx = 123;
  var RPMx = 123;

  var randStatusIndx = Math.floor((Math.random() * 13) + 0);
  var randSalesRepIndx = Math.floor((Math.random() * 4) + 0);
  var randUrgentIndex = (Math.random() < 0.5) ? 'on' : null;
  var randCompanyIndx = Math.floor((Math.random() * 6) + 0);
  var randMotorTypeIndx = Math.floor((Math.random() * 3) + 0);
 
  try {
    var autoIncTagID = parseInt( (await getMaxTagID(client))[0].maxNumber )+1;
  } catch(err)
  { 
    console.log('error BITCh!!');
    var autoIncTagID = 1000;
  }
  
  var insertObject = {
    tagID: autoIncTagID,
    status: statusx[randStatusIndx],
    currDate: currDatex,
    urgent: randUrgentIndex,
    salesRep: salesRepx[randSalesRepIndx],
    datePulledOut: datePulledOutx,
    company: companyx[randCompanyIndx],
    motorType: motorTypex[randMotorTypeIndx],
    hp: HPx,
    kw: '',
    rpm: RPMx,
    others: [],
    parts: [],
    remarks: '' 
  }

  return insertObject;
}


async function updateAllByName(client, nameOfListing, updatedListing){
  result = await client.db("caic-sample").collection("items")
  .updateMany({ salesRep: nameOfListing },
              { $set: {salesRep: updatedListing}}
              );
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
}

async function updateAllAddFields(client){
  result = await client.db("caic-sample").collection("items")
  .updateMany({ tagID: { $exists: false } },
              { $set: { tagID: 0 } });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
}

async function updateAllAddFieldStatus(client){
  result = await client.db("caic-sample").collection("items")
  .updateMany({ status: { $exists: false } },
              { $set: { status: 'Not Started' } });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
}

async function deleteAllByName(client, nameOfListing){
  result = await client.db("caic-sample").collection("items")
  .deleteMany({ salesRep: nameOfListing }
              );
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
}

async function getMaxTagID(client){
  try{
    result = await client.db("caic-sample").collection("items").aggregate(
      [
        {
          $group: 
          {
            _id: null,
            maxNumber: { $max: "$tagID" }
          }
        }
      ]
    )

    return result.toArray();
  }catch(err){
      console.log('ERROR!');
      return {
        _id: null,
        maxNumber: 1000 
      };
  }

  return {
    _id: null,
    maxNumber: 1000 
  };
}

async function getStatusStats(client){
  result = await client.db("caic-sample").collection("items").aggregate(
    [
      {
        $group: 
        {
          _id: '$status',
          count: {
            $sum: 1
          }
        }
      }
    ]
  )
  return result.toArray();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}