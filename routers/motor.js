const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
var client = require('../db/config').client;
//Input
const PDFDocument = require('pdfkit');
const fs = require('fs');

// @route   GET motor/newMotor
// @desc    Register a motor
// @access  Public
router.get('/newMotor', async function (req, res) {
    res.render('innerpages/newMotor', {maxTagID: await methods.getMaxTagID(client), companies: await methods.getCompanies(client)});
})

// @route   POST motor/newMotor
// @desc    Register a motor
// @access  Public
router.post('/newMotor', async function (req, res) {
      // console.log(req.body);
      let pmID;
      let powerval;
      if(req.body.optradio == 'pmno'){
        pmID = '';
      }
      else {
        pmID = req.body.pmcode
      }
      
      if(req.body.powerrb == 'hp')
      {
        powerval = req.body.powertext + ' HP';
      }else 
      {
        powerval = req.body.powertext + ' KW';
      }

      var inputObj = {
        pmID: pmID,
        tagID:  parseInt(req.body.motorid),
        status: 'notstarted',
        salesRep: req.body.salesrep,
        datePulledOut: req.body.currdate,
        company: req.body.company,
        motorType: req.body.motortype,
        power: powerval,
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
        remarks: req.body.remarks,
        submotors: []
      }

      var ctr = parseInt(req.body.submotorctr);

      for(var i=1; i<ctr; i++){
        let pmIDs;
        let powervals;
        if(req.body.optradio == 'pmno'){
          pmIDs = '';
        }
        else {
          pmIDs = req.body.pmcode
        }
        
        if(req.body.powerrb == 'hp')
        {
          powervals = req.body.powertext + ' HP';
        }else 
        {
          powervals = req.body.powertext + ' KW';
        }

        var inputsubobj = {
          motorType: req.body['motortype-'+i],
          power: powervals,
          rpm: req.body['rpm-'+i],
          others: [
            { 
              name: 'Motor Assy',
              isChecked: req.body['motor-assy-'+i]
            },
            { 
              name: 'AC ASSY',
              isChecked: req.body['ac-assy-'+i]
            },
            { 
              name: 'Fabrication',
              isChecked: req.body['fabrication-'+i]
            },
            { 
              name: 'Machining',
              isChecked: req.body['machining-'+i]
            }
          ], 
          parts: [
            { 
              name: 'Fan Cover', 
              isChecked: req.body['fan-cover-'+i]
            },
            {
              name: 'Stator', 
              isChecked: req.body['stator-'+i]
            },
            {
              name: 'Keystock (CUÑA)', 
              isChecked: req.body['keystock-'+i],
            },
            {
              name: 'Fan Blade', 
              isChecked: req.body['fan-blade-'+i]
            },
            {
              name: 'Rotor', 
              isChecked: req.body['rotor-'+i]
            },
            {
              name: 'Centrifugal', 
              isChecked: req.body['centrifugal-'+i]
            },
            {
              name: 'Terminal Box', 
              isChecked:  req.body['terminal-box-'+i],
            },
            {
              name: 'Pulley', 
              isChecked: req.body['pulley-'+i],
            },
            {
              name: 'Governor-Switch', 
              isChecked: req.body['governor-switch-'+i]
            },
            {
              name: 'Terminal', 
              isChecked: req.body['terminal-'+i]
            },
            {
              name: 'Carbon', 
              isChecked: req.body['carbon-'+i]
            },
            {
              name: 'Capacitor', 
              isChecked: req.body['capacitor-'+i]
            },
            {
              name: 'Terminal Block', 
              isChecked: req.body['terminal-block-'+i]
            },
            {
              name: 'Carbon Holder', 
              isChecked: req.body['carbon-holder-'+i],
            },
            {
              name: 'Impeller', 
              isChecked: req.body['impeller-'+i]
            },
            {
              name: 'Bolts and Nuts', 
              isChecked: req.body['bolts-and-nuts-'+i]
            }, 
            {
              name: 'Coupling', 
              isChecked: req.body['coupling-'+i]
            }
          ],
          remarks: req.body.remarks,
        }
        inputObj.submotors.push(inputsubobj);
      }

    console.log(inputObj);
    await methods.insertItem(client, 'notstarted', inputObj);
    res.render('innerpages/newMotor', {maxTagID: [{ _id: null, maxNumber: parseInt(req.body.motorid) }], companies: await methods.getCompanies(client)});
  })


// @route   GET motor/viewAllMotors
// @desc    View all motors
// @access  Public
router.get('/viewAllMotors',async function (req, res) {
  res.render('viewAll', {items: await methods.getItems(client, -1), statusStats: await methods.getStatusStats(client)});
})

// @route   GET motor/motorItemStage
// @desc    Get the item of the current stage
// @access  Public
router.get('/motorItemStage/:tagid',  async (req, res) => {
  let motorObj = await methods.getSingle(client, req.params.tagid); 
  switch(motorObj.status){
    case 'notstarted': 
      //res.send('Here\'s the ID: '+ req.params.tagid);
        const doc = new PDFDocument({size: 'LEGAL', margins : { 
          top: 25, 
          bottom: 25,
          left: 25,
          right: 25
      },});
      
      pdfURL = 'public/pdfs/'+ req.params.tagid+'.pdf';

      methods.createPDF(fs, doc, pdfURL, motorObj);
      res.render('innerpages/oncheckup', {pdfURL: '../../io/asset/'+req.params.tagid, motorobj: motorObj});
      break;
    case 'oncheckup':
      let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagid); 
      res.render('innerpages/prelimdocs', {pdfURL: '../../io/asset/'+req.params.tagid, motorObjOncheckup: motorObjOncheckup});
      break;
  }

  
});


// @route   GET motor/motorItem/:tagid
// @desc    Get a single motor item
// @access  Public

router.get('/motorItem/:tagid',  async (req, res) => {
  const motorobject = await methods.getSingle(client, req.params.tagid);
  if(motorobject)
    res.render('innerpages/motoritem', {motorobj: motorobject});
  else 
    res.render('errorpages/error404', {id: req.params.tagid});
});

//ONCHECKUP
// @route   POST motor/motorItemStage/:id
// @desc    Post stage by ID
// @access  Public
router.post('/motorItemStage/:id', async function (req, res) {
  // console.log(req.body);
  const status = await methods.getCurrentStatus(client, req.params.id);
  const ctr2 = await methods.getSubmotorCount(client, req.params.id);
  const ctr = ctr2['submotors'].length;
  switch(status.status){
    case 'notstarted': 
      console.log('NOT STARTED!');
      var inputObj = {
        tagID: req.params.id,
        voltage: req.body.voltage,
        current: req.body.current,
        phase: req.body.phase,
        stator: [
        ], 
        rotor: [
        ],
        accessories: [
        ],
        dynamic: [
        ],
        submotors:[]
      }
      //Stator
      if(req.body['stator-inspection'] == 'on'){
        inputObj.stator.push({name:'stator-inspection'});
      }
      if(req.body['stator-complete'] == 'on'){
        inputObj.stator.push({name:'stator-complete'});
      }
      if(req.body['stator-complete-recon'] == 'on'){
        inputObj.stator.push({name:'stator-complete-recon'});
      }
      if(req.body['conversion'] == 'on'){
        inputObj.stator.push({name:'conversion:'});
      }
      if(req.body['rotor-loadside'] == 'on'){
        inputObj.stator.push({name:'rotor-loadside'});
      }
      if(req.body['rotor-fanslide'] == 'on'){
        inputObj.stator.push({name:'rotor-fanslide'});
      }
      if(req.body['rotor-gearbox1'] == 'on'){
        inputObj.rotor.push({name:'rotor-gearbox1'});
      }
      if(req.body['rotor-gearbox2'] == 'on'){
        inputObj.rotor.push({name:'rotor-gearbox2'});
      }
      if(req.body['rotor-gearbox3'] == 'on'){
        inputObj.rotor.push({name:'rotor-gearbox3'});
      }
      if(req.body['rotor-gearbox4'] == 'on'){
        inputObj.rotor.push({name:'rotor-gearbox4'});
      }
      if(req.body['rotor-gearbox5'] == 'on'){
        inputObj.rotor.push({name:'rotor-gearbox5'});
      }
      if(req.body['rotor-gearbox6'] == 'on'){
        inputObj.rotor.push({name:'rotor-gearbox6'});
      }
      if(req.body['acce-options-capacitor'] == 'on'){
        inputObj.accessories.push({
          name:'acce-options-capacitor',
          'acce-options-capacitor1': req.body['acce-options-capacitor1'],
          'acce-options-capacitor2': req.body['acce-options-capacitor2']
        });
      }
      if(req.body['acce-options-fanblade'] == 'on'){
        inputObj.accessories.push({
          name:'acce-options-fanblade',
          'acce-options-fanblade1': req.body['acce-options-fanblade1'],
          'acce-options-fanblade2': req.body['acce-options-fanblade2']
        });
      }
      if(req.body['acce-options-oilseal'] == 'on'){
        inputObj.accessories.push({
          name:'acce-options-oilseal',
          'acce-options-oilseal1': req.body['acce-options-oilseal1'],
          'acce-options-oilseal2': req.body['acce-options-oilseal2']
        });
      }
      if(req.body['acce-options-shaftseal'] == 'on'){
        inputObj.accessories.push({
          name:'acce-options-shaftseal',
          'acce-options-shaftseal1': req.body['acce-options-shaftseal1'],
          'acce-options-shaftseal2': req.body['acce-options-shaftseal2']
        });
      }
      if(req.body['acce-options-oring-or-packing'] == 'on'){
        inputObj.accessories.push({
          name:'acce-options-oring-or-packing',
          'acce-options-oring-or-packing1': req.body['acce-options-oring-or-packing1']
        });
      }
      if(req.body['acce-fancover'] == 'on'){
        inputObj.accessories.push({name:'acce-fancover'});
      }
      if(req.body['acce-terminal'] == 'on'){
        inputObj.accessories.push({name:'acce-terminal'});
      }
      if(req.body['acce-wielding'] == 'on'){
        inputObj.accessories.push({name:'acce-wielding'});
      }
      if(req.body['acce-terminalpost'] == 'on'){
        inputObj.accessories.push({name:'acce-terminalpost'});
      }
      if(req.body['acce-options-capilla-or-gear'] == 'on'){
        inputObj.accessories.push({
          name:'acce-options-capilla-or-gear',
          'acce-options-capilla-or-gear1': req.body['acce-options-capilla-or-gear1'],
          'acce-options-capilla-or-gear2': req.body['acce-options-capilla-or-gear2']
        });
      }
      if(req.body['acce-cable'] == 'on'){
        inputObj.accessories.push({name:'acce-cable'});
      }
      if(req.body['acce-alignment'] == 'on'){
        inputObj.accessories.push({name:'acce-alignment'});
      }
      if(req.body['acce-finge-coupling'] == 'on'){
        inputObj.accessories.push({name:'acce-finge-coupling'});
      }
      if(req.body['acce-shafting'] == 'on'){
        inputObj.accessories.push({name:'acce-shafting'});
      }
      if(req.body['acce-welding-motor'] == 'on'){
        inputObj.accessories.push({name:'acce-welding-motor'});
      }
      if(req.body['acce-reboring-housing'] == 'on'){
        inputObj.accessories.push({name:'acce-reboring-housing'});
      }
      if(req.body['acce-sleeving'] == 'on'){
        inputObj.accessories.push({name:'acce-sleeving'});
      }
      if(req.body['dynamic-options'] == 'on'){
        inputObj.dynamic.push({
          name:'dynamic-options',
          'dynamic-options2': req.body['dynamic-options2']
        });
      }
      for(var i=1; i<=ctr; i++){
        var inputObj2 = {
          tagID: req.params.id,
          'voltage': req.body['voltage-'+i],
          'current': req.body['current-'+i],
          'phase': req.body['phase-'+i],
          'stator': [
          ], 
          'rotor': [
          ],
          'accessories': [
          ],
          'dynamic': [
          ]
        }
        //Stator
        if(req.body['stator-inspection-'+i] == 'on'){
          inputObj2.stator.push({name:'stator-inspection-'+i});
        }
        if(req.body['stator-complete-'+i] == 'on'){
          inputObj2.stator.push({name:'stator-complete-'+i});
        }
        if(req.body['stator-complete-recon-'+i] == 'on'){
          inputObj2.stator.push({name:'stator-complete-recon-'+i});
        }
        if(req.body['conversion-'+i] == 'on'){
          inputObj2.stator.push({name:'conversion-'+i});
        }
        if(req.body['rotor-loadside-'+i] == 'on'){
          inputObj2.stator.push({name:'rotor-loadside-'+i});
        }
        if(req.body['rotor-fanslide-'+i] == 'on'){
          inputObj2.stator.push({name:'rotor-fanslide-'+i});
        }
        if(req.body['rotor-gearbox1-'+i] == 'on'){
          inputObj2.rotor.push({name:'rotor-gearbox1-'+i});
        }
        if(req.body['rotor-gearbox2-'+i] == 'on'){
          inputObj2.rotor.push({name:'rotor-gearbox2-'+i});
        }
        if(req.body['rotor-gearbox3-'+i] == 'on'){
          inputObj2.rotor.push({name:'rotor-gearbox3-'+i});
        }
        if(req.body['rotor-gearbox4-'+i] == 'on'){
          inputObj2.rotor.push({name:'rotor-gearbox4-'+i});
        }
        if(req.body['rotor-gearbox5-'+i] == 'on'){
          inputObj2.rotor.push({name:'rotor-gearbox5-'+i});
        }
        if(req.body['rotor-gearbox6-'+i] == 'on'){
          inputObj2.rotor.push({name:'rotor-gearbox6-'+i});
        }
        if(req.body['acce-options-capacitor-'+i] == 'on'){
          inputObj2.accessories.push({
            name:'acce-options-capacitor-'+i,
            'acce-options-capacitor1': req.body['acce-options-capacitor1-'+i],
            'acce-options-capacitor2': req.body['acce-options-capacitor2-'+i]
          });
        }
        if(req.body['acce-options-fanblade-'+i] == 'on'){
          inputObj2.accessories.push({
            name:'acce-options-fanblade-'+i,
            'acce-options-fanblade1': req.body['acce-options-fanblade1-'+i],
            'acce-options-fanblade2': req.body['acce-options-fanblade2-'+i]
          });
        }
        if(req.body['acce-options-oilseal-'+i] == 'on'){
          inputObj2.accessories.push({
            name:'acce-options-oilseal-'+i,
            'acce-options-oilseal1': req.body['acce-options-oilseal1-'+i],
            'acce-options-oilseal2': req.body['acce-options-oilseal2-'+i]
          });
        }
        if(req.body['acce-options-shaftseal-'+i] == 'on'){
          inputObj2.accessories.push({
            name:'acce-options-shaftseal-'+i,
            'acce-options-shaftseal1': req.body['acce-options-shaftseal1-'+i],
            'acce-options-shaftseal2': req.body['acce-options-shaftseal2-'+i]
          });
        }
        if(req.body['acce-options-oring-or-packing-'+i] == 'on'){
          inputObj2.accessories.push({
            name:'acce-options-oring-or-packing-'+i,
            'acce-options-oring-or-packing1': req.body['acce-options-oring-or-packing1-'+i]
          });
        }
        if(req.body['acce-fancover-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-fancover-'+i});
        }
        if(req.body['acce-terminal-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-terminal-'+i});
        }
        if(req.body['acce-wielding-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-wielding-'+i});
        }
        if(req.body['acce-terminalpost-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-terminalpost-'+i});
        }
        if(req.body['acce-options-capilla-or-gear-'+i] == 'on'){
          inputObj2.accessories.push({
            name:'acce-options-capilla-or-gear-'+i,
            'acce-options-capilla-or-gear1': req.body['acce-options-capilla-or-gear1-'+i],
            'acce-options-capilla-or-gear2': req.body['acce-options-capilla-or-gear2-'+i]
          });
        }
        if(req.body['acce-cable-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-cable-'+i});
        }
        if(req.body['acce-alignment-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-alignment-'+i});
        }
        if(req.body['acce-finge-coupling-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-finge-coupling-'+i});
        }
        if(req.body['acce-shafting-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-shafting-'+i});
        }
        if(req.body['acce-welding-motor-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-welding-motor-'+i});
        }
        if(req.body['acce-reboring-housing-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-reboring-housing-'+i});
        }
        if(req.body['acce-sleeving-'+i] == 'on'){
          inputObj2.accessories.push({name:'acce-sleeving-'+i});
        }
        if(req.body['dynamic-options-'+i] == 'on'){
          inputObj2.dynamic.push({
            name:'dynamic-options-'+i,
            'dynamic-options2': req.body['dynamic-options2-'+i]
          });
        }
        inputObj.submotors.push(inputObj2);
      }

      await methods.insertItem(client, 'oncheckup' ,inputObj);
      await methods.updateStatus(client, 'oncheckup', inputObj.tagID)
      res.send('Data succesfully inserted! Prelim docs with the ID'+ inputObj.tagID);
    
      break; 
    case 'oncheckup': 
      res.sendStatus(200);
      //res.send('Prelim docs with the ID'+ inputObj.tagID);
  }
})


module.exports  = router;