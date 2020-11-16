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

//Mongo
var client = require('./db/config').client;

//Methods
const methods = require('./db/methods');

//Routers
app.use('/', require('./routers/dashboard'));
app.use('/motor', require('./routers/motor'));
app.use('/company', require('./routers/company'));
app.use('/io', require('./routers/io'));
//View Engine
app.set('view engine', 'pug');

//Sockets IO
var io = require('socket.io')(http);

//Static Files
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/motor', express.static(path.join(__dirname, 'public')))
async function main() {

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
