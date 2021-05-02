const { restart } = require("nodemon");

const monitorListingsUsingHasNext = async (client, pipeline = [], socket, coll, emitee) => {

    const db = client.db("caic-sample")
    const changeStream = db.watch({ fullDocument: 'updateLookup' });
    console.log('Watching has started!');
    while (await changeStream.hasNext()) {
        socket.sockets.emit(emitee, JSON.stringify(await changeStream.next()));
    }
    
}
  
  const insertItem = async (client, stage, newListing, user=null, tagID) => {
    var result = null;
    var stageFinal = stage
    var finalListing = newListing

    if (stage == 'notstarted') 
    {
      stageFinal = 'motors'
      //Get TAG ID
      var tagID2 = await genTagID(client, 'notstarted')
      finalListing.tagID = tagID2
      //Update the notification of the logged in user
      await addNotif(client, user, 'Added an item in Motor with the tagID: '+ tagID2)
      if(finalListing.submotor.isSubmotor == true)
      {
        //Update the mother motor 
        updateChildOfMother(client, finalListing.submotor.parent, finalListing.tagID)
      }
    }
    else finalListing.tagID = tagID

    result = await client.db("caic-sample").collection(stageFinal).insertOne(finalListing);
    console.log(`New item created with the following id: ${result.insertedId}`);
    return result
  }

  const insertSubmotorItem = async (client, stage, newListing, user=null) => {
    var result = null;

    result = await client.db("caic-sample").collection('submotors').insertOne(newListing);
    console.log(`New item created with the following id: ${result.insertedId}`);
    return result
  }

  const updateMotherItem = async (client, stage, tagID, user) => {
    await client.db("caic-sample").collection("motors")
      .updateOne({ tagID: parseInt(tagID) },
      { $push: {submotors: {tagID: parseInt(tagID)}}});
  }

  const genTagID = async (client, scope) => {
    //Get the latest tagID
    const result = await client.db("caic-sample").collection("sequence").find({}, { projection:({ _id: 0 })});
    const prevResult = await result.toArray()
    const prevTagID = prevResult[0].tagID

    if(scope == 'notstarted')
    {
      //Update the sequnce after
      await client.db("caic-sample").collection("sequence")
      .updateOne({ tagID: prevTagID },
                  { $set: {tagID: prevTagID + 1}});
    }
    return prevTagID;
  }

  const addNotif = async (client, user, message) => {
    const result = await client.db("caic-sample").collection("notifications")
    .insertOne({ username: user.username, message: message, timestamp: Date.now(), fullName: user.name });
    return result
  }

  const getNotifsByUser = async (client, user) => {
    var finalusername = { username: user.username }
  
    const result = await client.db("caic-sample").collection("notifications")
    .find(finalusername);
    
    return await result.toArray()
  }

  const getModelNames = async (client) => {
    const result = await client.db("caic-sample").listCollections({name: /^pricelist/})
    return await result.toArray()
    
  }

  const getNotifs = async (client, limit=5, skipNo=0) => {
    const result = await client.db("caic-sample").collection("notifications")
    .find().sort({ timestamp: -1 }).limit(limit).skip(skipNo);
    return await result.toArray()
  }

  const getNotifsAll = async (client, limit=10, skipNo) => 
  {

    const result = await client.db("caic-sample").collection('notifications').aggregate([
      { $match: {} },
      { $facet: {
          count:  [{ $count: "count" }],
          docs: [{ $sort: {timestamp: -1} }, {$skip: skipNo}, { $limit: limit }]
      }}
    ])
    
    if(result){
      return await result.toArray();
    }
    else {
      return null;
    } 
  }



  const getCount = async (client, stage) => {
    const result = await client.db('caic-sample').collection(stage).aggregate([
      { 
        $group: 
        {
          _id: 'tagID',
          count: {
            $sum: 1
          }
        }
      }
    ])

    return await result.toArray()
  }
  
  const getItems = async (client, count, stage, skipctr) => {
    var result;
    var skip = (skipctr*count)-10
    if(stage == '')
    {
      
      if(count == -1){
        result = await client.db("caic-sample").collection("motors").aggregate(
          [
            {
              '$sort': {
                'tagID': -1
              }
            }, {
              '$project': {
                'tagID': 1, 
                'datePulledOut': 1, 
                'status': 1, 
                'company': 1, 
                'motorType': 1, 
                'pmID': 1, 
                'remarks': 1, 
                'submotor': 1
              }
            },{
              '$lookup': {
                'from': 'oncheckup', 
                'let': {
                  'id': '$tagID'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$tagID', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$project': {
                      'power': 1, 
                      'rpm': 1
                    }
                  }
                ], 
                'as': 'power_rpm'
              }
            }, {
              '$limit': 10
            }, {
              '$skip': 0
            }
          ]
        )
        
      }
      else{
        result = await client.db("caic-sample").collection('motors').aggregate(
          [
            {
              '$sort': {
                'tagID': -1
              }
            },{
              '$project': {
                'tagID': 1, 
                'datePulledOut': 1, 
                'status': 1, 
                'company': 1, 
                'motorType': 1, 
                'pmID': 1, 
                'remarks': 1, 
                'submotor': 1
              }
            },
            {
              '$lookup': {
                'from': 'oncheckup', 
                'let': {
                  'id': '$tagID'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$tagID', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$project': {
                      'power': 1, 
                      'rpm': 1
                    }
                  }
                ], 
                'as': 'power_rpm'
              }
            }, {
              '$limit': count
            }, {
              '$skip': skip
            }
          ]
        )
       
      }
    } else 
    {
        
        result = await client.db("caic-sample").collection('motors').aggregate(
          [
            {
              '$sort': {
                'tagID': -1
              }
            }, {
              '$match': {
                'status': stage
              }
            }, {
              '$project': {
                'tagID': 1, 
                'datePulledOut': 1, 
                'status': 1, 
                'company': 1, 
                'motorType': 1, 
                'pmID': 1, 
                'remarks': 1, 
                'submotor': 1
              }
            },
            {
              '$lookup': {
                'from': 'oncheckup', 
                'let': {
                  'id': '$tagID'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$tagID', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$project': {
                      'power': 1, 
                      'rpm': 1
                    }
                  }
                ], 
                'as': 'power_rpm'
              }
            }, {
              '$limit': count
            }, {
              '$skip': 0
            }
          ]
        )
        //result = await client.db("caic-sample").collection("motors").find({status: stage}).sort({ tagID: -1 }).limit(count)
    }
    
    return await result.toArray();
  }

  const getMotorItemsWithRpmAndPower = async (client, count, stage, skipctr) => 
  {
    var result;
    var skip = (skipctr*count)-10

    result = await client.db("caic-sample").collection(stage).aggregate(
      [
        {
          '$sort': {
            'tagID': -1
          }
        }, {
          '$lookup': {
            'from': 'oncheckup', 
            'let': {
              'id': '$tagID'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$tagID', '$$id'
                    ]
                  }
                }
              }, {
                '$project': {
                  'power': 1, 
                  'rpm': 1
                }
              }
            ], 
            'as': 'power_rpm'
          }
        }, {
          '$lookup': {
            'from': 'company', 
            'let': {
              'id': '$company_id'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$id', '$$id'
                    ]
                  }
                }
              }, {
                '$project': {
                  'compname': 1, 
                  '_id': 0
                }
              }
            ], 
            'as': 'company_'
          }
        },{
          '$limit': 10
        }, {
          '$skip': 0
        }
      ]
    )
    
    return await result.toArray();
  }


  const getRpmAndHP = async (client, tagID) => {
    var result;
    //result = await client.db("caic-sample").collection("motors").findOne({'tagID': parseInt(tagID)}, { projection: {rpm: 1, power: 1, _id: 0}});
    result = await client.db("caic-sample").collection("oncheckup").find({'tagID': parseInt(tagID)}, { projection: {rpm: 1, power: 1, _id: 0}}).limit(1);
    if(result){
      return result.toArray();
    }
    return null;
  }

  const getHP = async (client, hpval) => {
    var result;
    result = await client.db("caic-sample").collection("price_list_hp").find({hp: parseFloat(hpval)}).project({'_id': 0}).sort({ hp: 1 });
    if((await result.toArray()).length > 0){
      return await result.toArray();
    }else 
    {
      var x = parseFloat(hpval); 
      var closestAbove = await client.db("caic-sample").collection("price_list_hp").find({hp: {$gt: x}}).sort({hp: 1}).limit(1);
      var  abovehp = await closestAbove.toArray()

      //If there still an above HP that can be used
      if(abovehp.length > 0)
      {
        result = await client.db("caic-sample").collection("price_list_hp").find({hp: abovehp[0].hp}).project({'_id': 0}).sort({ hp: 1 });
      } //if there's no longer an above HP, then resort to linear equation
      else 
      {
        //HP to KW
        var kwval = hpval/0.7457
 
        var rpm1 = 733.81 * kwval + 2361.9  
        var rpm2 = (733.81 * kwval + 2361.9)
        var rpm3 = (733.81 * kwval + 2361.9)*1.10  
        var rpm4 = (733.81 * kwval + 2361.9)*1.15  

        var rotor = 243.93 * kwval + 2100.2 
        var bearing = 214.84 * kwval - 842.88 
        var shafting = 45.777 * kwval + 751.82 

        result = [{hp: parseFloat(hpval), 'rpm-1': rpm1, 'rpm-2': rpm2, 'rpm-3': rpm3, 'rpm-4': rpm4, rotor: rotor, bearing: bearing, shafting: shafting}]
        return result
      }

      return await result.toArray();
    }
  }

  const getHP2 = async (client, hpval) => {
    var result;
    result = await client.db("caic-sample").collection("price_list_hp2").find({hp: parseFloat(hpval)}).project({'_id': 0}).sort({ hp: 1 });
    if(await result.toArray().length > 0){
      return await result.toArray();
    }
    else 
    {
      var x = parseFloat(hpval); 
      var closestAbove = await client.db("caic-sample").collection("price_list_hp2").find({hp: {$gt: x}}).sort({hp: 1}).limit(1);
      var abovehp = await closestAbove.toArray()

      //If there still an above HP that can be used
      if(abovehp.length > 0)
      {
        result = await client.db("caic-sample").collection("price_list_hp").find({hp: abovehp[0].hp}).project({'_id': 0}).sort({ hp: 1 });
      } //if there's no longer an above HP, then resort to linear equation
      else 
      {
        var kwval = hpval/0.7457

        var dynamicbalancing = 1232.9 * kwval - 5871.8  
        var bearinghousing = 220.3 * kwval - 821.23 
        var shafting = 220.3 * kwval - 821.23 
        var pulloutandinstall = 1575.1 * kwval - 9017.9

        result = [{hp: parseFloat(hpval), dynamicbalancing: dynamicbalancing, bearinghousing: bearinghousing, shafting: shafting, pulloutandinstall: pulloutandinstall}]
        return result
      }

      return await result.toArray();
    }
    
  }

  const getItemList = async (client) => {
    var result;
    result = await client.db("caic-sample").collection("pricelist_bearing").find({}).sort({ bearing: 1 });
    if(result){
      return await result.toArray();
    }
    return null;
  }

  const getSingleItem = async (client, itemname) => {
    var result;
    result = await client.db("caic-sample").collection("pricelist_bearing").find({model: itemname.replace('_', ' ').toUpperCase()}).project({_id: 0});
    if(result){
      return await result.toArray();
    }
    return null;
  }

  const getAll = async (client, coll) => {
    var result;
    result = await client.db("caic-sample").collection(coll).find({});
    if(result){
      return await result.toArray();
    }
    return null;
  }

  // const getCollItem = async (client, coll, id) => {
  //   var result;
  //   result = await client.db("caic-sample").collection(coll).find({});
  //   if(result){
  //     return await result.toArray();
  //   }
  //   return null;
  // }

  const getSingleItemAndPrice = async (client, model, itemname) => {
    var result;
    result = await client.db("caic-sample").collection("pricelist_"+model).find({model: itemname}).project({_id: 0});
    if(result){
      return await result.toArray();

    }
    return null;
  }

  const getSingle = async (client, stage, tagID) => {
    var result;
    result = await client.db("caic-sample").collection(stage).findOne({tagID: parseInt(tagID)});
    if(result){
      return await result;
    }
    else {
      return null;
    }
  }

  const getMotors = async (client, stage, projectionObj, limit, skipNo, stage2, company_id=null) => {

    
    var matchquery = {}
    if(stage2 != 'all') matchquery.status = stage2

    if(company_id) matchquery.company_id = company_id
    
    
    const result = await client.db("caic-sample").collection(stage).aggregate(
      [
      { $match: matchquery },
      { $project : projectionObj },
      { $facet: {
          count:  [{ $count: "count" }],
          docs: 
          [
            {
              '$sort': {
                'tagID': -1,
                '_id': 1
              }
            }, {
              '$match': matchquery
            }, {
              '$project': {
                'tagID': 1, 
                'datePulledOut': 1, 
                'status': 1, 
                'company': 1, 
                'company_id': 1,
                'motorType': 1, 
                'pmID': 1, 
                'remarks': 1, 
                'submotor': 1
              }
            }, {
              '$lookup': {
                'from': 'oncheckup', 
                'let': {
                  'id': '$tagID'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$tagID', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$project': {
                      'power': 1, 
                      'rpm': 1
                    }
                  }
                ], 
                'as': 'power_rpm'
              }
            }, 
            {
              '$lookup': {
                'from': 'company', 
                'let': {
                  'id': '$company_id'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$id', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$project': {
                      'compname': 1, 
                      '_id': 0
                    }
                  }
                ], 
                'as': 'company_'
              }
            },
            {
              '$limit': limit
            }, {
              '$skip': skipNo
            }
            
          ]
      }}
    ]
    )

    return await result.toArray();
  }

  //This search only works for ten thousands and lower
  const searchMotor = async (client, stage, tagID, projectionObj, limit, skipNo, field, stage2) => {
   
    var query
    var num = tagID
    var min, finalmin
    
    if(num.toString().length == 5)
      query = { $lte: tagID, $gte: tagID}
    else if(num.toString().length  == 4)
    {
      min = ((num*10).toString()).split('')
      min[min.length-1] = '9'
      finalmin = min.join('')
      query = { $lte: parseInt(finalmin), $gte: num*10} 
    }
    else if(num.toString().length == 3) 
    {
      min = ((num*100).toString()).split('')
      min[min.length-1] = '9'; min[min.length-2] = '9'
      finalmin = min.join('')
      query = { $lte: parseInt(finalmin), $gte: num*100} 
    }
    else if(num.toString().length == 2 ) 
    {
      min = ((num*1000).toString()).split('')
      min[min.length-1] = '9'; min[min.length-2] = '9'; min[min.length-3] = '9'
      finalmin = min.join('')
      query = { $lte: parseInt(finalmin), $gte: num*1000} 
    }
    else if(num.toString().length == 1)
    {
      min = ((num*10000).toString()).split('')
      min[min.length-1] = '9'; min[min.length-2] = '9'; min[min.length-3] = '9'; min[min.length-4] = '9'
      finalmin = min.join('')
      query = { $lte: parseInt(finalmin), $gte: num*10000} 
    }
    else {
      query = -1
    }

    var matchquery = {tagID: query}

    if(field == '') 
      matchquery = {}

    if(stage2 != 'all') matchquery.status = stage2

    const result = await client.db("caic-sample").collection(stage).aggregate(
      [
      { $match: matchquery},
      { $project : projectionObj },
      { $facet: {
          count:  [{ $count: "count" }],
          docs: 
          [
            {
              '$sort': {
                'tagID': -1,
                '_id': 1
              }
            }, {
              '$project': {
                'tagID': 1, 
                'datePulledOut': 1, 
                'status': 1, 
                'company': 1,
                'company_id': 1, 
                'motorType': 1, 
                'pmID': 1, 
                'remarks': 1, 
                'submotor': 1
              }
            }, {
              '$lookup': {
                'from': 'oncheckup', 
                'let': {
                  'id': '$tagID'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$tagID', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$project': {
                      'power': 1, 
                      'rpm': 1
                    }
                  }
                ], 
                'as': 'power_rpm'
              }
            }, 
            {
              '$lookup': {
                'from': 'company', 
                'let': {
                  'id': '$company_id'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$id', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$project': {
                      'compname': 1, 
                      '_id': 0
                    }
                  }
                ], 
                'as': 'company_'
              }
            },
             {
              '$skip': skipNo
            },
            {
              '$limit': limit
            }
            
          ]
      }}
    ]
   
    )
    
    if(result){
      return result;
    }
    else {
      return null;
    }
  }

  const searchMotorByKeyword = async (client, stage, textsearchquery, projectionObj, limit, skipNo, field, stage2) => {
   
    var matchquery = textsearchquery
    if(field == '') matchquery = {}
    if(stage2 != 'all') matchquery.status = stage2
    
   
    const result = await client.db("caic-sample").collection(stage).aggregate(
      [
      { $match: matchquery },
      { $project : projectionObj },
      { $facet: {
          count:  [{ $count: "count" }],
          docs: 
          [
            
            {
              '$sort': {
                'tagID': -1,
                '_id': 1
              }
            }, 
            {
              '$project': {
                'tagID': 1, 
                'datePulledOut': 1, 
                'status': 1, 
                'company': 1, 
                'company_id': 1,
                'motorType': 1, 
                'pmID': 1, 
                'remarks': 1, 
                'submotor': 1
              }
            }, 
            {
              '$lookup': {
                'from': 'oncheckup', 
                'let': {
                  'id': '$tagID'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$tagID', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$project': {
                      'power': 1, 
                      'rpm': 1
                    }
                  }
                ], 
                'as': 'power_rpm'
              }
            }, 
            {
              '$lookup': {
                'from': 'company', 
                'let': {
                  'id': '$company_id'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$id', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$project': {
                      'compname': 1, 
                      '_id': 0
                    }
                  }
                ], 
                'as': 'company_'
              }
            },
            
            {
              '$skip': skipNo
            }
            ,
            {
              '$limit': limit
            }
            
          ]
      }}
    ]
    
    )

   
    
    if(result){
      return result;
    }
    else {
      return null;
    }
  }

  const getSingleCompany = async (client, companyname) => {
    var result;
    result = await client.db("caic-sample").collection("company").findOne({'compname': companyname});
    if(result){
      return await result;
    }
    else {
      return null;
    }
  }

  const getCompany = async (client, id, proj={projection:{}}) => {
   
    var result;
    result = await client.db("caic-sample").collection("company").findOne({id: id}, proj);
    if(result){
      return await result;
    }
    else {
      return null;
    }
  }

  const getUser = async (client, id) => {
    var result;
    result = await client.db("caic-sample").collection("users").findOne({id: id});
    if(result){
      return await result;
    }
    else {
      return null;
    }
  }

  const getUsers = async (client, toFind) => {
    const result = await client.db("caic-sample").collection("users")
    .find({
      $or:[
        {"ROLE": toFind[0]},
        {"ROLE": toFind[1]}
      ]
    })

    return await result.toArray()
  }
 

  const getSingleOnCheckup = async (client, tagID, isFullDetails) => {
    var result;
    if(isFullDetails)
    {
      result = await client.db("caic-sample").collection("oncheckup").findOne({'tagID': parseInt(tagID)});
    }
    else 
    {
      result = await client.db("caic-sample").collection("oncheckup").findOne({'tagID': parseInt(tagID)}, {
         projection:({ _id: 0, stator: 1, accessories: 1, mechanical: 1, dynamic: 1, misc: 1, frequency: 1, power: 1, rpm: 1})
      });
    }
    
    if(result){
      return await result;
    }
    else {
      return null;
    }
  }

  const getSingleUser = async (client, username) => {
    var result;
    result = await client.db("caic-sample").collection("users").findOne({'username': username});
    return await result;
  }
  const getSingleUserById = async (client, id) => {
    var result;
    result = await client.db("caic-sample").collection("users").findOne({'id': id});
    return await result;
  }
  
  // const getStats = async (client) => {
  //   const result = await client.db("caic-sample").collection("motors").aggregate([
  //     {
  //       $group: {
  //         _id: '$salesRep',
  //           count: {$sum: 1}
  //       }
  //     },
  //     {
  //       $sort: {  
  //         _id: 1
  //       }
  //     }
  //   ]);
  //   return await result.toArray();
  // }

  const getStats = async(client) => {
    const result = await client.db("caic-sample").collection("motors").aggregate(
      [
        {
          '$project': {
            'tagID': 1, 
            'salesRep': 1
          }
        }, {
          '$lookup': {
            'from': 'prelimdocs', 
            'let': {
              'id': '$tagID'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$tagID', '$$id'
                    ]
                  }
                }
              }, {
                '$project': {
                  'grandTotal': 1, 
                  '_id': 0
                }
              }
            ], 
            'as': 'grandTotal'
          }
        }, {
          '$group': {
            '_id': '$salesRep', 
            'tagIDList': {
              '$push': {
                '$arrayElemAt': [
                  '$grandTotal.grandTotal', 0
                ]
              }
            },
            'count': {'$sum': 1}
          }
        }, {
          '$project': {
            '_id': 1, 
            'grandTotal': {
              '$sum': '$tagIDList'
            },
            'count': 1
          }
        },
        {
          '$sort': {
            '_id': 1, 
          }
        }
      ]
    )
  
    return await result.toArray()
  }

  const getMotorCounts = async (client) => 
  {
    const result = await client.db("caic-sample").collection('motors').aggregate([
      {
        $project: {
    
            date: {
                $dateFromString: {
                    dateString: '$datePulledOut'
                }
              }
        
        }
      },
      {
        $group : {
          _id: '$date',
          count: {$sum: 1}
        }
      },
      {
        $sort: {
          '_id': 1
        } 
      }

    ])
    return await result.toArray(); 
  }

  const getHPandKW = async (client) => 
  {
    const result = await client.db("caic-sample").collection('oncheckup').aggregate([
      {
        '$group': {
            '_id': {
                '$arrayElemAt': [
                    {
                        '$split': [
                            '$power', ' '
                        ]
                    }, 1
                ]
            }, 
            'count': {
                '$sum': 1
            }
        }
      }
    ])
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
    const result = await client.db("caic-sample").collection("motors").aggregate(
      [
        {
          '$project': {
            'company_id': 1
          }
        }, {
          '$lookup': {
            'from': 'company', 
            'let': {
              'id': '$company_id'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$id', '$$id'
                    ]
                  }
                }
              }, {
                '$project': {
                  'compname': 1, 
                  '_id': 0
                }
              }
            ], 
            'as': 'company_'
          }
        }, {
          '$group': {
            '_id': '$company_.compname', 
            'count': {
              '$sum': 1
            }
          }
        }, {
          '$sort': {
            '_id': 1
          }
        }
      ]
    
    );


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

      if (await arrayres.length <= 0){
        alter = [{
          _id: null,
          maxNumber: -1 
        }]
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

  const getMotorStagesByDate = async (client) => {
    result = await client.db("caic-sample").collection("motors").aggregate(
      [
        {
            $project: {
                date: {
                    $dateFromString: {
                        dateString: '$datePulledOut'
                    }
                },
                status: 1
            }
        }, {
            $group: {
                _id: {
                    ids: '$date',
                    status: '$status'
                },
                count: {
                    $sum: 1
                }
        
            }
        }, {
            $group: {
                _id: '$_id.ids',
                STATUS_GROUP: {
                    $push: {
                        STATUS: "$_id.status",
                        count: "$count"
                    }
                }
            }
        }, {
            $sort: {
                _id: 1
            }
        }
      ]
    )
    
    return await result.toArray();
  }

  // const getMotorSalesRepByTime = async function(client)
  // {
  //   result = await client.db("caic-sample").collection("motors").aggregate(
  //     [
  //       {
  //         '$project': {
  //           'date': {
  //             '$dateFromString': {
  //               'dateString': '$datePulledOut'
  //             }
  //           }, 
  //           'salesRep': 1
  //         }
  //       }, {
  //         '$group': {
  //           '_id': {
  //             'ids': '$date', 
  //             'salesRep': '$salesRep'
  //           }, 
  //           'count': {
  //             '$sum': 1
  //           }
  //         }
  //       }, {
  //         '$group': {
  //           '_id': '$_id.ids', 
  //           'STATUS_GROUP': {
  //             '$push': {
  //               'STATUS': '$_id.salesRep', 
  //               'count': '$count'
  //             }
  //           }
  //         }
  //       },
  //       {
  //         '$sort':{
  //           '_id': 1
  //         }
  //       }
  //     ]
  //   )

  //   return await result.toArray();
  // }

  const getMotorSalesRepByTime = async function(client)
  {
    result = await client.db("caic-sample").collection("motors").aggregate(
      [
        {
          '$project': {
            'tagID': 1, 
            'salesRep': 1, 
            'date': {
              '$month': {
                '$dateFromString': {
                  'dateString': '$datePulledOut'
                }
              }
            }, 
            'year': {
              '$year': {
                '$dateFromString': {
                  'dateString': '$datePulledOut'
                }
              }
            }
          }
        }, {
          '$lookup': {
            'from': 'prelimdocs', 
            'let': {
              'id': '$tagID'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$tagID', '$$id'
                    ]
                  }
                }
              }, {
                '$project': {
                  'grandTotal': 1, 
                  '_id': 0
                }
              }
            ], 
            'as': 'grandTotal'
          }
        }, {
          '$group': {
            '_id': {
              'year': '$year', 
              'month': '$date', 
              'sr': '$salesRep'
            }, 
            'total': {
              '$push': {
                '$arrayElemAt': [
                  '$grandTotal.grandTotal', 0
                ]
              }
            }
          }
        }, {
          '$project': {
            '_id': 1, 
            'grandTotal': {
              '$sum': '$total'
            }, 
            'count': 1
          }
        }, {
          '$sort': {
            '_id.month': 1, 
            '_id.year': 1
          }
        }
      ]
    )
    
   
    return await result.toArray();
  }

  const getMotorCountByDateByStage = async function (client, stage)
  {
    var datebasis = '$startdate'
    if(stage == 'motors') datebasis = '$datePulledOut'
    result = await client.db("caic-sample").collection(stage).aggregate(
      [
        {
          '$project': {
            'date': {
              '$dateFromString': {
                'dateString': datebasis
              }
            }, 
            'status': 1
          }
        }, {
          '$group': {
            '_id': '$date', 
            'count': {
              '$sum': 1
            }
          }
        }, {
          '$sort': {
            '_id': 1
          }
        }
      ]
    )

    return await result.toArray();
  }
  
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const createPDF = (fs, doc, pdfURL, motorObj, company_details, oncheckup) => {

    doc.pipe(fs.createWriteStream(pdfURL));    
  
    doc.fontSize(10);
    doc.text("DATE RECEIVED: "+motorObj.datePulledOut, {
        'align': 'right'
    }).fontSize(15);
    doc.moveDown();
    doc.text("CALAMBA ALLIED INDUSTRIAL CORPORATION", {
    'align': 'center',
    'lineGap ': 5
    }).fontSize(10);
    doc.moveDown();
    doc.text("MAIN OFFICE: CAIC BUILDING SAN CRISTOBAL, CALAMBA CITY, LAGUNA", doc.x, doc.y-10, {
    'align': 'center'
    }).fontSize(12);
    doc.moveDown();
    doc.text("INDIVIDUAL ACCOMPLISHMENT REPORT", doc.x, doc.y, {
    'align': 'center'
    }).fontSize(10);
    
    var docy = doc.y+10;
    var docx = doc.x;
    var pwidth = doc.page.width;
    
    doc.moveDown();
    doc.text("CUSTOMER: "+ motorObj.company, {
      width: doc.page.width/3, 
    'align': 'left',
    'lineGap ': 10
    }).text("ADDRESS: " + company_details.street + ', ' + company_details.city + ', ' + company_details.state, {
    'align': 'left',
    }).text("P.O. NO.: ",{
    'align': 'left',
    });
    
    doc.moveDown();
    doc.text("SALES REP: "+motorObj.salesRep, doc.page.width/3+25, docy, {
      width: doc.page.width/3, 
    'align': 'left',
    'lineGap ': 10
    }).text("GATE PASS: "+motorObj.gatepass,{
    'align': 'left',
    }).text("P.R. NO.: ",{
    'align': 'left',
    });
    
    doc.moveDown();
    doc.text("TAG NO:  "+motorObj.tagID, doc.page.width*2/3+25, docy, {
      width: doc.page.width/3, 
    'align': 'left',
    'lineGap ': 10
    }).text("DATE REQ'D: ",{
    'align': 'left',
    })
    // .text("J.O. NO: ",{
    // 'align': 'left',
    // });
    
    docy = doc.y+10;
    docx = doc.x;
    
    doc.moveDown();
    doc.roundedRect(pwidth*(1/6)+25, doc.y+5, 60, 15)
    doc.stroke();
    doc.text("RUSH ", pwidth*(1/6)+25+65, doc.y+10, {
      width: pwidth/2, 
    'align': 'left',
    'lineGap ': 10
    })
    
    doc.moveDown();
    doc.roundedRect(pwidth*(1/2)+25, docy+6, 60, 15)
    doc.stroke();
    doc.text("NORMAL ", pwidth*(1/2)+25+65, docy+10, {
      width: pwidth/2, 
    'align': 'left',
    'lineGap ': 10
    })
    
    doc.moveDown();
    
    doc.fontSize(15);
    doc.moveDown();
    doc.text("MOTOR SPECIFICATION", 25, doc.y, {
    'align': 'center',
    'lineGap ': 5
    })
    doc.fontSize(10);
    doc.moveDown();
    
    docy = doc.y+10;
    docx = doc.x;
    
    doc.moveDown();
    doc.text("NAME:   "+ motorObj.motorType, {
      width: doc.page.width/3, 
    'align': 'left',
    'lineGap ': 10,
    
    }).text("AS PER GATE PASS: ", doc.x+40, doc.y, {
    'align': 'left',
    })
    doc.lineCap('butt')
        .moveTo(docx+35, doc.y-15)
        .lineTo(180, doc.y-15)
        .stroke();
    
    doc.moveDown();

    if(motorObj.power.split(' ')[1] == 'HP')
    {
      doc.roundedRect(pwidth*(1/3), docy-10,pwidth/3-8,25)
      doc.stroke().text('HP                            '+motorObj.power.split(' ')[0], pwidth*(1/3)+5, docy, {
          'align': 'left',
      })
      doc.moveDown();
      doc.roundedRect(pwidth*(2/3)-8, docy-10, pwidth/3-8, 25)
      doc.stroke().text('KW', pwidth*(2/3)+5-8, docy, {
          'align': 'left'
      })
    }
    else{
      doc.roundedRect(pwidth*(1/3), docy-10,pwidth/3-8,25)
      doc.stroke().text('HP', pwidth*(1/3)+5, docy-5, {
          'align': 'left',
      })
      doc.moveDown();
      doc.roundedRect(pwidth*(2/3)-8, docy-10, pwidth/3-8, 25)
      doc.stroke().text('KW                            '+motorObj.power.split(' ')[0], pwidth*(1/3)+5, docy, {
          'align': 'left'
      })
    }
    
    doc.moveDown();
    
    docy = doc.y+20;
    pwidth = doc.page.width-50;
    doc.text("RPM:      " + motorObj.rpm, 25, docy-5, {
      width: doc.page.width/4, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(docx+35, doc.y)
        .lineTo(150, doc.y)
        .stroke()
        
    doc.text("TYPE:     ", 25, docy+20, {
      width: doc.page.width/4, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(docx+35, doc.y)
        .lineTo(150, doc.y)
        .stroke()
        
    doc.text("VOLTS:      " + oncheckup.voltage, pwidth/4+25, docy-5, {
      width: doc.page.width/4, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth/4+25+30+5, doc.y)
        .lineTo(pwidth/4+145, doc.y)
        .stroke()
        
    doc.text("HZ:      " + oncheckup.frequency,  pwidth/4+25, docy+20, {
      width: doc.page.width, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth/4+25+25, doc.y)
        .lineTo(pwidth/4+145, doc.y)
        .stroke()
        
        
    doc.text("PH:      " + oncheckup.phase, pwidth*1/2+25, docy-5, {
      width: doc.page.width/2, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth*1/2+25+20, doc.y)
        .lineTo(pwidth*1/2+145, doc.y)
        .stroke()
        
    doc.text("AMPS:      "+oncheckup.current,  pwidth*1/2+25, docy+20, {
      width: doc.page.width/2, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth*1/2+25+30, doc.y)
        .lineTo(pwidth*1/2+145, doc.y)
        .stroke()
    
    doc.text("SERIAL #: ", pwidth*3/4+25, docy-5, {
      width: doc.page.width/2, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
      .moveTo(pwidth*3/4+80, doc.y)
      .lineTo(pwidth*3/4+165, doc.y)
      .stroke()
        
    doc.text("MODEL: ",  pwidth*3/4+25, docy+20, {
      width: doc.page.width*2, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth*3/4+70, doc.y-5)
        .lineTo(pwidth*3/4+165, doc.y-5)
        .stroke()
    
  doc.moveDown();
  doc.lineCap('butt')
    .moveTo(25, doc.y)
    .lineTo(pwidth+25, doc.y)
    .stroke()
    
    docy = doc.y+10;
    docx = 25;
    
    doc.moveDown();
    doc.text("BACKJOB", 25, doc.y, {
      width: doc.page.width/3, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    doc.text("FINDINGS", pwidth/3+25, docy, {
      width: doc.page.width/3-25, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    doc.text("ORIGINAL WIRE (SAMPLE)", pwidth*2/3+25, docy, {
      width: doc.page.width/3, 
    'align': 'center',
    'lineGap ': 10
    })
    
    
    doc.moveDown();
    doc.lineCap('butt')
    .moveTo(25, doc.y-5)
    .lineTo(pwidth+25, doc.y-5)
    .stroke()
    
    doc.moveDown();
    
    pwidth = doc.page.width-50;
    doc.text("DATE REWIND: ", 25, doc.y-5, {
      width: doc.page.width/4, 
    'align': 'left',
    'lineGap ': 10
    }).text("REWINDER: ", 25, doc.y+5, {
      width: doc.page.width/4, 
    'align': 'left',
    'lineGap ': 10
    }).text("INV NO.: ", 25, doc.y+5, {
      width: doc.page.width/4, 
    'align': 'left',
    'lineGap ': 10
    })
    
    
    doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y-5)
    .lineTo(pwidth+25, doc.y-5)
    .stroke()
    
    docy = doc.y;
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(pwidth/3+25, docy-5)
    .lineTo(pwidth/3+25, docy-68)
    .stroke()
    
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(pwidth*2/3+25, docy-5)
    .lineTo(pwidth*2/3+25, docy-68)
    .stroke()     
    
    
    docy = doc.y-10;
    docx = 25;
    
    doc.moveDown();
    doc.text("ORIGINAL DATA RECORD", 0, docy-5, {
      width: doc.page.width*0.6, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    doc.text("ORIGINAL TEST REPORT", pwidth*0.6, docy-5, {
      width: doc.page.width*0.4, 
    'align': 'center',
    'lineGap ': 10
    })
    
    
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y-5)
    .lineTo(pwidth+25, doc.y-5)
    .stroke()
    
    docx = doc.x
    docy = doc.y
    
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("LENGTH", 25, doc.y+10, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("OUTSIDE DIA", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("INSIDE DIA", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("SLOTS", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("# OF COIL GROUP", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("GROUPS", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("SPANS", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("TURNS", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("SIZE OF WIRE", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    })
    
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y)
    .lineTo(pwidth+25, doc.y)
    .stroke()
    
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("ROTOR", pwidth*0.2, docy+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    .text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("STATOR", pwidth*0.4, docy+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    .text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    
      
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(pwidth*0.6, docy-5)
    .lineTo(pwidth*0.6, docy)
    .stroke()
    
    doc.fontSize(11)
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("COIL RESISTANCE_________________OHMS", pwidth*0.6+10, docy+5, {
      width: doc.page.width*0.40, 
    'align': 'left',
    'lineGap ': 10
    }).text("INSUL RESISTANCE________________OHMS", pwidth*0.6+10, doc.y+5, {
      width: doc.page.width*0.40, 
    'align': 'left',
    'lineGap ': 10
    })
    
    doc.moveDown();
      doc.lineCap('butt')
    .moveTo(pwidth*0.6, doc.y-85)
    .lineTo(pwidth*0.6, doc.y+345)
    .stroke()
    
    docy = doc.y
    
    doc.fontSize(11)
    doc.text("AMP. W/O LOAD", pwidth*0.6, doc.y+15, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("AT_________VOLTS", pwidth*0.6, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L1_________AMPS", pwidth*0.6, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L2_________AMPS", pwidth*0.6, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L3_________AMPS", pwidth*0.6, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("AMP W/ LOAD", pwidth*0.8+25, docy+15, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("AT_________VOLTS", pwidth*0.8+25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L1_________AMPS", pwidth*0.8+25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L2_________AMPS", pwidth*0.8+25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L3_________AMPS", pwidth*0.8+25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    
    docy = doc.y+50;
    docx = 25;
    doc.fontSize(10);
    doc.moveDown();
    doc.text("REVISION DATA RECORD", 0, docy-5, {
      width: doc.page.width*0.6, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    doc.text("REVISION TEST REPORT", pwidth*0.6, docy-5, {
      width: doc.page.width*0.4, 
    'align': 'center',
    'lineGap ': 10
    })
    
    
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y-5)
    .lineTo(pwidth+25, doc.y-5)
    .stroke()
    
    docx = doc.x
    docy = doc.y
    
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("LENGTH", 25, doc.y+10, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("OUTSIDE DIA", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("INSIDE DIA", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("SLOTS", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("# OF COIL GROUP", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("GROUPS", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("SPANS", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("TURNS", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    }).text("SIZE OF WIRE", 25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'left',
    'lineGap ': 10
    })
    
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y)
    .lineTo(pwidth+25, doc.y)
    .stroke()
    
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("________________", pwidth*0.2, docy+20, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    .text("________________", pwidth*0.2, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("________________", pwidth*0.4, docy+20, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    .text("________________", pwidth*0.4, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    
    
    doc.fontSize(11)
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("COIL RESISTANCE_________________OHMS", pwidth*0.6+10, docy+5, {
      width: doc.page.width*0.40, 
    'align': 'left',
    'lineGap ': 10
    }).text("INSUL RESISTANCE________________OHMS", pwidth*0.6+10, doc.y+5, {
      width: doc.page.width*0.40, 
    'align': 'left',
    'lineGap ': 10
    })
    
    doc.moveDown();
      doc.lineCap('butt')
    .moveTo(pwidth*0.6, doc.y-5)
    .lineTo(pwidth+25, doc.y-5)
    .stroke()
    
    docy = doc.y
    
    doc.fontSize(11)
    doc.text("AMP. W/O LOAD", pwidth*0.6, doc.y+15, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("AT_________VOLTS", pwidth*0.6, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L1_________AMPS", pwidth*0.6, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L2_________AMPS", pwidth*0.6, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L3_________AMPS", pwidth*0.6, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    pwidth = doc.page.width-50;
    doc.text("AMP W/ LOAD", pwidth*0.8+25, docy+15, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("AT_________VOLTS", pwidth*0.8+25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L1_________AMPS", pwidth*0.8+25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L2_________AMPS", pwidth*0.8+25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    }).text("L3_________AMPS", pwidth*0.8+25, doc.y+5, {
      width: doc.page.width*0.20, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    docy = doc.y+35;
    docx = 25;
    doc.fontSize(10);
    doc.moveDown();
    doc.text("NOTES", 0, docy-5, {
      width: doc.page.width*0.6, 
    'align': 'center',
    'lineGap ': 10
    })
    
    doc.moveDown();
    doc.text("REVISION WIRE / SAMPLE", pwidth*0.6, docy-5, {
      width: doc.page.width*0.4, 
    'align': 'center',
    'lineGap ': 10
    })
    
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y-5)
    .lineTo(pwidth+25, doc.y-5)
    .stroke()
    docy = doc.y-15
    pwidth = doc.page.width-50;
    
    // doc.text("QTY", 0, docy+20, {
    //   width: doc.page.width*0.15, 
    // 'align': 'center',
    // 'lineGap ': 10
    // })
    
    // pwidth = doc.page.width-50;
    // doc.text("ITEM/S", pwidth*0.15-10, docy+20, {
    //   width: doc.page.width*0.30, 
    // 'align': 'center',
    // 'lineGap ': 10
    // })        
    
    // pwidth = doc.page.width-50;
    // doc.text("COST", pwidth*0.45, docy+20, {
    //   width: doc.page.width*0.15, 
    // 'align': 'center',
    // 'lineGap ': 10
    // })  
      
    //   doc.moveDown();
    //   doc.lineCap('butt')
    // .moveTo(25, doc.y-5)
    // .lineTo(pwidth*0.6, doc.y-5)
    // .stroke()
  
    //   doc.moveDown();
    //   doc.lineCap('butt')
    // .moveTo(25, doc.y)
    // .lineTo(pwidth*0.6, doc.y)
    // .stroke()

    //   doc.moveDown();
    //   doc.lineCap('butt')
    // .moveTo(25, doc.y+3)
    // .lineTo(pwidth*0.6, doc.y+3)
    // .stroke()
    //   doc.moveDown();
    //   doc.lineCap('butt')
    // .moveTo(25, doc.y+5)
    // .lineTo(pwidth*0.6, doc.y+5)
    // .stroke()
    
    // doc.moveDown();
    //   doc.lineCap('butt')
    // .moveTo(25, doc.y-80)
    // .lineTo(25, doc.y-7)
    // .stroke()
    
    //   docy = doc.y
    //   doc.moveDown();
    //   doc.lineCap('butt')
    // .moveTo(pwidth*0.6, docy-80)
    // .lineTo(pwidth*0.6, docy-6)
    // .stroke()
    
    //   doc.moveDown();
    //   doc.lineCap('butt')
    // .moveTo(pwidth*0.45, docy-80)
    // .lineTo(pwidth*0.45, docy-6)
    // .stroke()
    
    // doc.moveDown();
    //   doc.lineCap('butt')
    // .moveTo(pwidth*0.15, docy-80)
    // .lineTo(pwidth*0.15, docy-6)
    // .stroke()
    
    // end and display the document in the iframe to the right
    doc.end();
  }


  const insertCompany = async (client, newListing) => {
    const result = await client.db("caic-sample").collection("company").updateOne({id: newListing.id},{$set: newListing}, {upsert: true});
    console.log(`New item created with the following id: ${result.insertedId}`);
  }
  const insertRewinder = async (client, newListing) => {
    const result = await client.db("caic-sample").collection("rewinder").updateOne({id: newListing.id},{$set: newListing}, {upsert: true});
    console.log(`New item created with the following id: ${result.insertedId}`);
  }
  const insertUser = async (client, newListing) => {
    const result = await client.db("caic-sample").collection("users").updateOne({id: newListing.id},{$set: newListing}, {upsert: true});
    console.log(`New item created with the following id: ${result.insertedId}`);
  }


 const getCompanies = async (client) => {
  const result2 = await client.db("caic-sample").collection("company").aggregate([
    {
      $group: {
        _id: '$compname'
      }
    }
  ]);
  return await result2.toArray();
 }
 

 const getList = async (client, dbname, itemname) => {
  const result2 = await client.db("caic-sample").collection(dbname).aggregate([
    {
      $group: {
        _id: '$'+itemname
      }
    },
    {
      $sort: {  
        _id: 1
      }
    }
  ]);
  return await result2.toArray();
 }

 const getRewinders = async (client) => {
  const result2 = await client.db("caic-sample").collection("rewinder").find({}, { projection:({ _id: 0 })});
  return await result2.toArray();
 }

 const getCurrentStatus = async (client, tagID) => {
  var result;
  result = await client.db("caic-sample").collection("motors").findOne({'tagID': parseInt(tagID)}, { projection: {status: 1, _id: 0} });

  if(result){
    return await result;
  }
  else {
    return null;
  }
}

const updateChildOfMother = async (client, parentID, childID) => {
  result = await client.db("caic-sample").collection("motors")
  .updateOne({ tagID: parseInt(parentID) },
              { $set: {submotor: {isSubmotor: false, child: childID, parent: null}}}
              );
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
}


const updateStatus = async (client, status, motorID) => {
  result = await client.db("caic-sample").collection("motors")
  .updateOne({ tagID: parseInt(motorID) },
              { $set: {status: status}}
              );
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
}


const getItemsByModelType = async (client, model) => {
  const result2 = await client.db("caic-sample").collection('pricelist_'+model).find({}, { projection:({ _id: 0, price: 0 })});
  return await result2.toArray();
}

const getItemsWithPricesByModelType = async (client, model) => {
  const result2 = await client.db("caic-sample").collection('pricelist_'+model).find({}, { projection:({ _id: 0 })});
  return await result2.toArray();
}


const insertQformPref = async (client, tagID, qformPref) => {
  var currDate = new Date();
  var newListing = {};
  if(qformPref == 'whole')
  {
    newListing = {
      tagID: parseInt(tagID),
      qformPref: qformPref,
      qNo: 'R'+currDate.getFullYear().toString().substr(-2) + '-' + tagID + '/' + (currDate.getMonth()+1) + '-' + currDate.getDate(),
      isComplete: false
    }
  }else
  {
    var qNoList = [];
    for(var i = 0; i < 5; i++)
    {
      qNoList.push('R'+currDate.getFullYear().toString().substr(-2) + '-' + tagID + '-' + (i+1) + '/' + (currDate.getMonth()+1) + '-' + currDate.getDate());
    }
    newListing = {
      tagID: parseInt(tagID),
      qformPref: qformPref,
      qNo: qNoList,
      isComplete: false
    }
  }
  
  
  result = await client.db("caic-sample").collection("prelimdocs").find({tagID: parseInt(tagID)});
  if(await result.count() > 0){
    console.log('Data already exists');
    return null;
  }
  else {
    result = await client.db("caic-sample").collection("prelimdocs").insertOne(newListing);
    console.log(`New item created with the following id: ${result.insertedId}`);
    return result;
  }
}

const getQformPref = async (client, tagID) => {
  result = await client.db("caic-sample").collection("prelimdocs").find({tagID: parseInt(tagID)});
  if(await result.count() > 0){
    console.log('Data already exists');
    return result.toArray();
  }
  return null;
}

const getMotorHP = async (client, tagID) => {
  result = await client.db("caic-sample").collection("oncheckup").findOne({'tagID': parseInt(tagID)}, { projection: {power: 1, _id: 0} });
  if(result){
    return await result.toArray();
  }
  return null;
}

const editItemByCollectionAndModelName = async (client, collname, modelname, newinputs) => {
  var result2 = await client.db("caic-sample").collection('pricelist_'+collname)
  .updateOne({ model: modelname },
              { $set: {model: newinputs['item-model'], price:newinputs['item-price'] }}
              );
  console.log(`${result2.matchedCount} document(s) matched the query criteria.`);
  return 'NO Duplicate';
}

const addItemByCollectionAndModelName = async (client, collname, modelname, price) => {
  
  var newListing = {
    model: modelname,
    price: price
  }

  result = await client.db("caic-sample").collection('pricelist_'+collname).insertOne(newListing);
  return result;
}

const deleteItemByCollectionAndModelName = async (client, collname, modelname) => {
  
  var result2 = await client.db("caic-sample").collection('pricelist_'+collname).deleteOne({ model: modelname });
}

const getQformIDs = async (client, tagID) => {
  result = await client.db("caic-sample").collection("prelimdocs").find({tagID: parseInt(tagID)}, { projection:({ _id: 0,  qformPref: 0, tagID: 0})});
  if(await result.count() > 0){
    console.log('Data already exists');
    return result.toArray();
  }
  return null;
}

const addFileDir = async (client, tagID, loc, stage) => 
{
  var result2 = await client.db("caic-sample").collection(stage)
  .updateOne({ tagID: parseInt(tagID) },
              { $set: {loc: loc }}
              );

  console.log(`addFileDir: ${result2.matchedCount} document(s) matched the query criteria.`);

  return null;
}


const getPassCode = async(client, passtype) => 
{

  result = await client.db("caic-sample").collection("credentials").find({type: passtype}, { projection:({ _id: 0, type: 0})});
  if(await result.count() > 0){
    return await result.toArray();
  }
  return null;
}

const getRewinder = async(client, tagid) => 
{
  result = await client.db("caic-sample").collection("prelimdocs").find({tagID: parseInt(tagid)}, { projection:({ _id: 0, rewindername: 1})});
  if(await result.count() > 0){
    return await result.toArray();
  }
  return null;
}

const getSingleRewinder = async(client, id) => 
{
  result = await client.db("caic-sample").collection("rewinder").find({id: id});
  if(await result.count() > 0){
    return await result.toArray();
  }
  return null;
}

const deleteSingleRewinder = async(client, id) => 
{
  result = await client.db("caic-sample").collection("rewinder").deleteOne({id: id});
  return result.deletedCount;
}

const deleteSingleCompany = async(client, id) => 
{
  result = await client.db("caic-sample").collection("company").deleteOne({id: id});
  return result.deletedCount;
}

const deleteSingleUser = async(client, id) => 
{
  result = await client.db("caic-sample").collection("users").deleteOne({id: id});
  return result.deletedCount;
}


const updateItem = async (client, stage, inputObj) => {
  var result2 = null;
  if(stage == 'prelimdocs')
  {
     result2 = await client.db("caic-sample").collection(stage)
    .updateOne({ tagID: parseInt(inputObj.tagID) },
                { $set: {grandTotal: inputObj.grandTotal, startdate: inputObj.startdate, finishdate: inputObj.finishdate, isComplete: true, rewindername: inputObj['rewindername'], discount: inputObj.discount, stator: inputObj.stator, accessories: inputObj.accessories, mechanical: inputObj.mechanical, dynamic: inputObj.dynamic, misc: inputObj.misc, gen: inputObj.gen }}
                );
    console.log(`${result2.matchedCount} document(s) matched the query criteria.`);
  } else if (stage == 'onfabrication')
  {
     result2 = await client.db("caic-sample").collection(stage)
    .updateOne({ tagID: parseInt(inputObj.tagID) },
                { $set: {finisheddate: inputObj.finisheddate, finishedtime: inputObj.finishedtime, stator: inputObj.stator, accessories: inputObj.accessories, mechanical: inputObj.mechanical, dynamic: inputObj.dynamic, misc: inputObj.misc }}
                );
    console.log(`${result2.matchedCount} document(s) matched the query criteria.`);
  }
}


const replaceDocument = async (client, dbname, tagID, replacement) =>
{
  const result = await client.db('caic-sample').collection(dbname).replaceOne({tagID: parseInt(tagID)}, replacement, {});
  if (result.modifiedCount === 0 && result.upsertedCount === 0) {
    console.log("No changes made to the collection.");
  } else {
    if (result.matchedCount === 1) {
      console.log("Matched " + result.matchedCount + " documents.");
    }
    if (result.modifiedCount === 1) {
      console.log("Updated one document.");
    }
    if (result.upsertedCount === 1) {
      console.log(
        "Inserted one new document with an _id of " + result.upsertedId._id
      );
    }
  }
}

const saveDraft = async (client, formdata, stage) => {
  const result = await client.db("caic-sample").collection("drafts")
  .updateOne({ stage: stage, tagID: formdata.tagID}, {$set: formdata}, { upsert: true });
  return result
}

const getDraft = async (client, stage, tagID) => {
  result = await client.db("caic-sample").collection("drafts").find({tagID: parseInt(tagID), stage: stage});
  if(await result.count() > 0){
    return await result.toArray();
  }
  return null 
}

const deleteDraft = async(client, tagID, stage) => 
{
  result = await client.db("caic-sample").collection('drafts').deleteOne({tagID: tagID, stage: stage});
  console.log('deleted: '+ result.deletedCount)
  return result.deletedCount;
}

const getItemStage = async (client, tagID) => {
  result = await client.db("caic-sample").collection("motors").find({tagID: parseInt(tagID)}, {projection:{ status: 1, _id: 0}});
  if(await result.count() > 0){
    return await result.toArray();
  }
  return null
}

const createSummary = async (client, tagID) => {
  var summaryObj = {}
  const notstarted = await client.db("caic-sample").collection('motors').find({tagID: parseInt(tagID)}, { projection:({ _id: 0, gatepass: 1, motorType: 1, power: 1, rpm: 1, submotor: 1, salesRep: 1  })});
  const oncheckup = await client.db("caic-sample").collection('oncheckup').find({tagID: parseInt(tagID)}, { projection:({ _id: 0, voltage: 1, current: 1, phase: 1, frequency: 1,  })});
  const prelimdocs = await client.db("caic-sample").collection('prelimdocs').find({tagID: parseInt(tagID)}, { projection:({ _id: 0, rewindername: 1, qNo: 1})});
  const fordelivery = await client.db("caic-sample").collection('fordelivery').find({tagID: parseInt(tagID)}, { projection:({ _id: 0, pono: 1, drno: 1})});
  const forbillingstatement = await client.db("caic-sample").collection('forbillingstatement').find({tagID: parseInt(tagID)}, { projection:({ _id: 0, sino: 1})});
  const foror = await client.db("caic-sample").collection('foror').find({tagID: parseInt(tagID)}, { projection:({ _id: 0, orno: 1})});
  
  summaryObj.notstarted = {}
  summaryObj.salesRep = notstarted.salesRep
  summaryObj.notstarted = await notstarted.toArray() 
  summaryObj.oncheckup = await oncheckup.toArray()
  summaryObj.prelimdocs = await prelimdocs.toArray()
  summaryObj.fordelivery = await fordelivery.toArray()
  summaryObj.forbillingstatement = await forbillingstatement.toArray()
  summaryObj.foror = await foror.toArray()

  return summaryObj;
} 

const createMotorDetails = async (client, tagID) => {
  var motordetailObj = {}
  const notstarted = await client.db("caic-sample").collection('motors').find({tagID: parseInt(tagID)}, { projection:({ _id: 0, tagID: 1, motorType: 1, power: 1})});
  motordetailObj.notstarted = await notstarted.toArray()

  return motordetailObj;
}

const getLogItems = async (client, limit) => {
  const result = await client.db("caic-sample").collection("logbook")
  .find().sort({ timestamp: -1 }).limit(limit);
  return await result.toArray()
}

const getCurrentSalesRep = async (client) => {
  const result = await client.db("caic-sample").collection('motors').aggregate(
    [
      {
        '$group': {
          '_id': '$salesRep'
        }
      }
    ]
  )
  
  if(result){
    return await result.toArray();
  }
  else {
    return null;
  } 
}



const createLogItem = async (client, user, body) => {
  const logItemObj = {}
  logItemObj.id = body.clusterTime
  logItemObj.user = user.name
  logItemObj.operationType = body.operationType
  logItemObj.ns = body.ns.coll
  if(body.updateDescription)
    logItemObj.updateFields = body.updateDescription.updatedFields
  logItemObj.fullDocument = body.fullDocument
  logItemObj.timestamp = Date.now()

  const result = await client.db("caic-sample").collection('logbook').insertOne(logItemObj);
  console.log(`New item created with the following id: ${result.insertedId}`);
  return result
} 

//GENERICS
const getMotor = async (client, stage, listing) => {
  const result = await client.db("caic-sample").collection(stage).find({}, { projection: listing});
  return result;
}



const timeIn = () => {
  var start = new Date()
  var hrstart = process.hrtime()
  var simulateTime = 5

  return {start: start, hrstart: hrstart, simulateTime: simulateTime}
}

const timeOut = (start, hrstart, simulateTime) => {
  setTimeout(function (argument) {
    // execution time simulated with setTimeout function
    var end = new Date() - start,
      hrend = process.hrtime(hrstart)
  
    console.info('Execution time: %dms', end)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  }, simulateTime)
}

const getFileDir = async (client) => {
  const result = await client.db("caic-sample").collection('dir').findOne({});
  return await result;
}

const addModelColumn = async (client, modelname) => {
  const result = await client.db("caic-sample").createCollection('pricelist_'+modelname, {})
}

exports.getFileDir = getFileDir
exports.timeIn = timeIn
exports.timeOut = timeOut
exports.monitorListingsUsingHasNext = monitorListingsUsingHasNext;
exports.insertItem = insertItem;
exports.getItems = getItems;
exports.getRpmAndHP = getRpmAndHP;
exports.getHP = getHP;
exports.getHP2 = getHP2;
exports.getSingle =  getSingle;
exports.getSingleCompany = getSingleCompany;
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
exports.insertCompany = insertCompany;
exports.insertRewinder = insertRewinder;
exports.getCompanies = getCompanies;
exports.getRewinders = getRewinders;
exports.createPDF = createPDF;
exports.getCurrentStatus = getCurrentStatus;
exports.updateStatus = updateStatus;
exports.getSingleOnCheckup = getSingleOnCheckup;
exports.getItemList = getItemList;
exports.getSingleItem = getSingleItem;
exports.getItemsByModelType = getItemsByModelType;
exports.getItemsWithPricesByModelType = getItemsWithPricesByModelType;
exports.insertQformPref = insertQformPref;
exports.getQformPref = getQformPref;
exports.getSingleItemAndPrice = getSingleItemAndPrice;
exports.editItemByCollectionAndModelName = editItemByCollectionAndModelName;
exports.deleteItemByCollectionAndModelName = deleteItemByCollectionAndModelName;
exports.getQformIDs = getQformIDs;
exports.addFileDir = addFileDir;
exports.getPassCode = getPassCode;
exports.updateItem = updateItem;
exports.getRewinder = getRewinder;
exports.getSingleRewinder = getSingleRewinder;
exports.getList = getList;  
exports.replaceDocument = replaceDocument;
exports.getSingleUser = getSingleUser;
exports.getSingleUserById = getSingleUserById
exports.addItemByCollectionAndModelName = addItemByCollectionAndModelName
exports.genTagID = genTagID
exports.addNotif = addNotif
exports.getNotifsByUser = getNotifsByUser
exports.getNotifs = getNotifs
exports.getNotifsAll = getNotifsAll
exports.getAll = getAll
exports.saveDraft = saveDraft
exports.getDraft = getDraft
exports.deleteSingleRewinder = deleteSingleRewinder
exports.getCompany = getCompany
exports.deleteSingleCompany = deleteSingleCompany
exports.deleteSingleUser = deleteSingleUser
exports.getUser = getUser
exports.insertUser = insertUser
exports.insertSubmotorItem = insertSubmotorItem
exports.updateMotherItem = updateMotherItem
exports.updateChildOfMother = updateChildOfMother
exports.getItemStage = getItemStage
exports.createSummary = createSummary
exports.createMotorDetails = createMotorDetails
exports.getLogItems = getLogItems
exports.createLogItem = createLogItem
exports.getMotor = getMotor
exports.deleteDraft = deleteDraft
exports.searchMotor = searchMotor
exports.searchMotorByKeyword = searchMotorByKeyword
exports.getMotors = getMotors
exports.getCount = getCount
exports.getMotorCounts = getMotorCounts
exports.getHPandKW = getHPandKW
exports.getMotorStagesByDate = getMotorStagesByDate
exports.getMotorCountByDateByStage = getMotorCountByDateByStage
exports.getUsers = getUsers
exports.getModelNames = getModelNames
exports.getMotorHP = getMotorHP
exports.addModelColumn = addModelColumn
exports.getMotorItemsWithRpmAndPower = getMotorItemsWithRpmAndPower
exports.getMotorSalesRepByTime = getMotorSalesRepByTime
exports.getCurrentSalesRep = getCurrentSalesRep