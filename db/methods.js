const monitorListingsUsingHasNext = async (client, pipeline = [], socket) => {
    console.log('Watching has started!');
    const collection = client.db("caic-sample").collection("motors");
  
    const changeStream = collection.watch();
    
    while (await changeStream.hasNext()) {
        socket.sockets.emit('db', JSON.stringify(await changeStream.next()));
    }
}

const printCheapestSuburbs = async (client, country, market, maxNumberToPrint) => {
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
  
  const insertItem = async (client, newListing) => {
    const result = await client.db("caic-sample").collection("motors").insertOne(newListing);
    console.log(`New item created with the following id: ${result.insertedId}`);
  }
  
  const getItems = async (client, count) => {
    var result;
    if(count == -1){
      result = await client.db("caic-sample").collection("motors").find({}).sort({ tagID: -1 });
    }
    else{
      result = await client.db("caic-sample").collection("motors").find({}).sort({ tagID: -1 }).limit(count);
    }
    
    console.log(`Dsiplayed all the items!`);
    return await result.toArray();
  }

  const getSingle = async (client, tagID) => {
    var result;
    result = await client.db("caic-sample").collection("motors").findOne({'tagID': parseInt(tagID)});
    console.log(await result);
    if(result){
      return await result;
    }
    else {
      return null;
    }
  }
  
  const getStats = async (client) => {
    const result = await client.db("caic-sample").collection("motors").aggregate([
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
  
  const getUrgents = async (client) => {
    const result = await client.db("caic-sample").collection("motors").aggregate([
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

  const getClients = async(client) => {
    const result = await client.db("caic-sample").collection("motors").aggregate([
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
  
  const insertRandom = async(client) => {
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
  
  
  const updateAllByName = async (client, nameOfListing, updatedListing) => {
    result = await client.db("caic-sample").collection("motors")
    .updateMany({ salesRep: nameOfListing },
                { $set: {salesRep: updatedListing}}
                );
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  }
  
  const updateAllAddFields = async(client) => {
    result = await client.db("caic-sample").collection("motors")
    .updateMany({ tagID: { $exists: false } },
                { $set: { tagID: 0 } });
  
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  }
  
  const updateAllAddFieldStatus = async (client) => {
    result = await client.db("caic-sample").collection("motors")
    .updateMany({ status: { $exists: false } },
                { $set: { status: 'Not Started' } });
  
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  }
  
  const deleteAllByName = async (client, nameOfListing) => {
    result = await client.db("caic-sample").collection("motors")
    .deleteMany({ salesRep: nameOfListing }
                );
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  }
  
  const getMaxTagID = async (client) => {
    try{
      var result = await client.db("caic-sample").collection("motors").aggregate(
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
      var alter;
      const arrayres = await result.toArray();
      console.log(arrayres.length);
      if (await arrayres.length <= 0){
        alter = [{
          _id: null,
          maxNumber: 999 
        }]
        console.log(alter);
        return await alter;
      } else {
        return await result.toArray();
      }
    }catch(err){
        console.log(err.messag);
    }
  }
  
  const getStatusStats = async (client) => {
    result = await client.db("caic-sample").collection("motors").aggregate(
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
  
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



exports.monitorListingsUsingHasNext = monitorListingsUsingHasNext;
exports.printCheapestSuburbs = printCheapestSuburbs;
exports.insertItem = insertItem;
exports.getItems = getItems;
exports.getSingle =  getSingle;
exports.getStats = getStats;
exports.getUrgents = getUrgents;
exports.getClients = getClients;
exports.insertRandom = insertRandom;
exports.updateAllByName = updateAllByName;
exports.updateAllAddFields = updateAllAddFields;
exports.updateAllAddFieldStatus = updateAllAddFieldStatus;
exports.deleteAllByName = deleteAllByName;
exports.getMaxTagID = getMaxTagID;
exports.getStatusStats = getStatusStats;
exports.sleep = sleep;
