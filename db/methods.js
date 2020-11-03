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
  
  const insertItem = async (client, stage, newListing) => {
    var result;
    switch(stage){
      case 'notstarted':
        result = await client.db("caic-sample").collection("motors").insertOne(newListing);
        console.log(`New item created with the following id: ${result.insertedId}`);
      case 'oncheckup':
        result = await client.db("caic-sample").collection("oncheckup").insertOne(newListing);
        console.log(`New item created with the following id: ${result.insertedId}`);
      break;
    }
    
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

  const createPDF = (fs, doc, pdfURL, motorObj) => {
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
    }).text("ADDRESS: ",{
    'align': 'left',
    }).text("P.O. NO.: ",{
    'align': 'left',
    });
    
    doc.moveDown();
    doc.text("SALES REP: "+motorObj.salesRep, doc.page.width/3+25, docy, {
      width: doc.page.width/3, 
    'align': 'left',
    'lineGap ': 10
    }).text("GATE PASS: ",{
    'align': 'left',
    }).text("P.R. NO.: ",{
    'align': 'left',
    });
    
    doc.moveDown();
    doc.text("J.O. NO: ", doc.page.width*2/3+25, docy, {
      width: doc.page.width/3, 
    'align': 'left',
    'lineGap ': 10
    }).text("R.I.S. NO: ",{
    'align': 'left',
    }).text("DATE REQ'D: ",{
    'align': 'left',
    });
    
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
    doc.text("NAME: ", {
      width: doc.page.width/3, 
    'align': 'left',
    'lineGap ': 10
    }).text("AS PER GATE PASS: ", doc.x+40, doc.y, {
    'align': 'left',
    })
    doc.lineCap('butt')
        .moveTo(docx+35, doc.y-15)
        .lineTo(180, doc.y-15)
        .stroke();
    
    doc.moveDown();
    doc.roundedRect(pwidth*(1/3), docy-10,pwidth/3-8,25)
    doc.stroke().text('HP', pwidth*(1/3)+5, docy-5, {
        'align': 'left',
    })
    
    doc.moveDown();
    doc.roundedRect(pwidth*(2/3)-8, docy-10, pwidth/3-8, 25)
    doc.stroke().text('K.W.', pwidth*(2/3)+5-8, docy-5, {
        'align': 'left'
    })
    
    doc.moveDown();
    
    docy = doc.y+20;
    pwidth = doc.page.width-50;
    doc.text("RPM: ", 25, docy, {
      width: doc.page.width/4, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(docx+35, doc.y-5)
        .lineTo(150, doc.y-5)
        .stroke()
        
    doc.text("TYPE: ", 25, docy+20, {
      width: doc.page.width/4, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(docx+35, doc.y-5)
        .lineTo(150, doc.y-5)
        .stroke()
        
    doc.text("RPM: ", pwidth/4+25, docy, {
      width: doc.page.width/4, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth/4+25+30, doc.y-5)
        .lineTo(pwidth/4+145, doc.y-5)
        .stroke()
        
    doc.text("TYPE: ",  pwidth/4+25, docy+20, {
      width: doc.page.width, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth/4+25+30, doc.y-5)
        .lineTo(pwidth/4+145, doc.y-5)
        .stroke()
        
        
    doc.text("RPM: ", pwidth*1/2+25, docy, {
      width: doc.page.width/2, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth*1/2+25+30, doc.y-5)
        .lineTo(pwidth*1/2+145, doc.y-5)
        .stroke()
        
    doc.text("TYPE: ",  pwidth*1/2+25, docy+20, {
      width: doc.page.width/2, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth*1/2+25+30, doc.y-5)
        .lineTo(pwidth*1/2+145, doc.y-5)
        .stroke()
    
    doc.text("RPM: ", pwidth*3/4+25, docy, {
      width: doc.page.width/2, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth*3/4+25+30, doc.y-5)
        .lineTo(pwidth*3/4+145, doc.y-5)
        .stroke()
        
    doc.text("TYPE: ",  pwidth*3/4+25, docy+20, {
      width: doc.page.width*2/32, 
    'align': 'left',
    'lineGap ': 10
    })
    doc.lineCap('butt')
        .moveTo(pwidth*3/4+25+30, doc.y-5)
        .lineTo(pwidth*3/4+145, doc.y-5)
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
    doc.text("MATERIALS USED", 0, docy-5, {
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
    
    doc.text("QTY", 0, docy+20, {
      width: doc.page.width*0.15, 
    'align': 'center',
    'lineGap ': 10
    })
    
    pwidth = doc.page.width-50;
    doc.text("ITEM/S", pwidth*0.15-10, docy+20, {
      width: doc.page.width*0.30, 
    'align': 'center',
    'lineGap ': 10
    })        
    
    pwidth = doc.page.width-50;
    doc.text("COST", pwidth*0.45, docy+20, {
      width: doc.page.width*0.15, 
    'align': 'center',
    'lineGap ': 10
    })  
      
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y-5)
    .lineTo(pwidth*0.6, doc.y-5)
    .stroke()
  
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y)
    .lineTo(pwidth*0.6, doc.y)
    .stroke()

      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y+3)
    .lineTo(pwidth*0.6, doc.y+3)
    .stroke()
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y+5)
    .lineTo(pwidth*0.6, doc.y+5)
    .stroke()
    
    doc.moveDown();
      doc.lineCap('butt')
    .moveTo(25, doc.y-80)
    .lineTo(25, doc.y-7)
    .stroke()
    
      docy = doc.y
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(pwidth*0.6, docy-80)
    .lineTo(pwidth*0.6, docy-6)
    .stroke()
    
      doc.moveDown();
      doc.lineCap('butt')
    .moveTo(pwidth*0.45, docy-80)
    .lineTo(pwidth*0.45, docy-6)
    .stroke()
    
    doc.moveDown();
      doc.lineCap('butt')
    .moveTo(pwidth*0.15, docy-80)
    .lineTo(pwidth*0.15, docy-6)
    .stroke()
    
    // end and display the document in the iframe to the right
    doc.end();
  }

  const insertCompany = async (client, newListing) => {
    const result = await client.db("caic-sample").collection("company").insertOne(newListing);
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

 const getCurrentStatus = async (client, tagID) => {
  var result;
  result = await client.db("caic-sample").collection("motors").findOne({'tagID': parseInt(tagID)}, { projection: {status: 1, _id: 0} });
  //console.log(await result);
  if(result){
    return await result;
  }
  else {
    return null;
  }
}

const getSubmotorCount = async (client, tagID) => {
  var result;
  result = await client.db("caic-sample").collection("motors").findOne({'tagID': parseInt(tagID)}, { projection: {submotors: 1, _id: 0} });
  //console.log(await result);
  if(result){
    return await result;
  }
  else {
    return null;
  }
}

const updateStatus = async (client, status, motorID) => {
  result = await client.db("caic-sample").collection("motors")
  .updateOne({ tagID: parseInt(motorID) },
              { $set: {status: 'oncheckup'}}
              );
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
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
exports.insertCompany = insertCompany;
exports.getCompanies = getCompanies;
exports.createPDF = createPDF;
exports.getCurrentStatus = getCurrentStatus;
exports.getSubmotorCount = getSubmotorCount;
exports.updateStatus = updateStatus;