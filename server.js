//Server
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const path = require('path');

//Sockets IO
var io = require('socket.io')(http);
//MongoDb
const { MongoClient } = require('mongodb');


async function main() {

  const uri = "mongodb://codor2:codor2@caic-shard-00-00.ag1uv.gcp.mongodb.net:27017,caic-shard-00-01.ag1uv.gcp.mongodb.net:27017,caic-shard-00-02.ag1uv.gcp.mongodb.net:27017/test?ssl=true&replicaSet=atlas-jkfvz0-shard-0&authSource=admin&retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '/public', 'index.html'));
  });

  app.use(express.static('public'));

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
  const collection = client.db("sample_airbnb").collection("listingsAndReviews");

  const changeStream = collection.watch(pipeline);
  
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