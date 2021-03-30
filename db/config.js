const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/demo?replicaSet=rs0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


exports.client = client;