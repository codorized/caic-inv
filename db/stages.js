const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
const stages = require('../db/stages');
var client = require('../db/config').client;


const createMotorObj = async (body, company) => {
      let pmID;

      if(body.optradio == 'pmno'){
        pmID = '';
      }
      else {
        pmID = body.pmcode
      }

      var inputObj = {
        pmID: pmID,
        status: 'notstarted',
        gatepass: body.gatepass,
        salesRep: body.salesRep,
        datePulledOut: new Date(body.datePulledOut).toISOString(),
        //company: company.compname,
        company_id: company.id,
        motorType: body.motorType,
        submotor: {},
        others: [
          { 
            name: 'Motor Assy',
            isChecked: body['motor-assy']
          },
          { 
            name: 'AC ASSY',
            isChecked: body['ac-assy']
          },
          { 
            name: 'Fabrication',
            isChecked: body.fabrication
          },
          { 
            name: 'Machining',
            isChecked: body.machining
          }
        ], 
        parts: [
          { 
            name: 'Fan Cover', 
            isChecked: body['fan-cover']
          },
          {
            name: 'Stator', 
            isChecked: body.stator
          },
          {
            name: 'Keystock (CUÑA)', 
            isChecked: body.keystock,
          },
          {
            name: 'Fan Blade', 
            isChecked: body['fan-blade']
          },
          {
            name: 'Rotor', 
            isChecked: body.rotor
          },
          {
            name: 'Centrifugal', 
            isChecked: body.centrifugal
          },
          {
            name: 'Terminal Box', 
            isChecked:  body['terminal-box'],
          },
          {
            name: 'Pulley', 
            isChecked: body.pulley,
          },
          {
            name: 'Governor-Switch', 
            isChecked: body['governor-switch']
          },
          {
            name: 'Terminal', 
            isChecked: body.terminal
          },
          {
            name: 'Carbon', 
            isChecked: body.carbon
          },
          {
            name: 'Capacitor', 
            isChecked: body.capacitor
          },
          {
            name: 'Terminal Block', 
            isChecked: body['terminal-block']
          },
          {
            name: 'Carbon Holder', 
            isChecked: body['carbon-holder'],
          },
          {
            name: 'Impeller', 
            isChecked: body.impeller
          },
          {
            name: 'Bolts and Nuts', 
            isChecked: body['bolts-and-nuts']
          }, 
          {
            name: 'Coupling', 
            isChecked: body.coupling
          }
        ],
        remarks: body.remarks
      }

      //Check if it's a submotor
      if(body.isSubmotor=='submotor')
      {
        if(body.submotorTagID)
        { 
          inputObj.submotor.isSubmotor = true
          inputObj.submotor.parent = parseInt(body.submotorTagID)
          inputObj.submotor.child = null
        }
      } 
      else
      {
        inputObj.submotor.isSubmotor = false
        inputObj.submotor.parent = null
        inputObj.submotor.child = null
      } 

      return inputObj
}

const createOncheckupObj = async (body, id) => {
  let powerval;
  if(body.powerrb == 'hp')
  {
    powerval = body.power + ' HP';
  }else 
  {
    powerval = body.power + ' KW';
  }

  var inputObj = {
    tagID: parseInt(id),
    voltage: body.voltage,
    current: body.current,
    phase: body.phase,
    power: powerval,
    rpm: body.rpm,
    frequency: body.frequency,
    workdays: body.workdays,
    startdate: body.startdate,
    finishdate: body.finishdate,
    stator: [
    ], 
    accessories: [
    ],
    mechanical: [
    ],
    dynamic: [
    ],
    misc: [
    ],
    files: [],
    before: {}
  }
  //Stator
  if(body['stator-inspection'] == 'on'){
    inputObj.stator.push({name:'stator-inspection', formal:'Inspection and Checking of unit and Data Recording'});
  }

  if(body['stator-complete'] == 'complete-rewinding'){
    inputObj.stator.push({name:'stator-complete-rewinding', formal: 'Complete Stator Coil Rewinding Package', list: ['Stator coil Rewinding', 'Surge Comparison Hi-pot Testing', 'Polarization and Resistance Test', 'Varnishing and Baking', 'Cleaning and Painting of Unit']});
  }
  else if(body['stator-complete'] == 'complete-reconditioning'){
    inputObj.stator.push({name:'stator-complete-recon', formal: 'Complete Reconditioning Package', list: ['(Includes all stated above EXCEPT Stator coil Rewinding)']});
  }

  if(body['conversion'] == 'on'){
    inputObj.stator.push({name:'conversion', formal: 'Conversion of motor any parameter'});
  }

  if(body['rotor-loadside'] == 'on'){
    inputObj.accessories.push({name:'rotor-loadside', formal: 'Replacement of bearing (Load Side)', model: body['rotor-loadside-model']});
  }
  if(body['rotor-fanslide'] == 'on'){
    inputObj.accessories.push({name:'rotor-fanslide', formal: 'Replacement of bearing (Fan Side)', model: body['rotor-fanslide-model']});
  }
  if(body['rotor-gearbox1'] == 'on'){
    inputObj.accessories.push({name:'rotor-gearbox1', formal: 'Replacement of bearing (Gear Box)', model: body['rotor-gearbox1-model']});
  }
  if(body['rotor-gearbox2'] == 'on'){
    inputObj.accessories.push({name:'rotor-gearbox2', formal: 'Replacement of bearing (Gear Box)', model: body['rotor-gearbox2-model']});
  }
  if(body['rotor-gearbox3'] == 'on'){
    inputObj.accessories.push({name:'rotor-gearbox3', formal: 'Replacement of bearing (Gear Box)', model: body['rotor-gearbox3-model']});
  }
  if(body['rotor-gearbox4'] == 'on'){
    inputObj.accessories.push({name:'rotor-gearbox4', formal: 'Replacement of bearing (Gear Box)', model: body['rotor-gearbox4-model']});
  }
  if(body['rotor-gearbox5'] == 'on'){
    inputObj.accessories.push({name:'rotor-gearbox5', formal: 'Replacement of bearing (Gear Box)', model: body['rotor-gearbox5-model']});
  }
  if(body['rotor-gearbox6'] == 'on'){
    inputObj.accessories.push({name:'rotor-gearbox6', formal: 'Replacement of bearing (Gear Box)', model: body['rotor-gearbox6-model']});
  }
  if(body['rotor-shafting'] == 'on'){
    inputObj.accessories.push({name:'rotor-shafting', formal: 'Replacement of Shafting', model: body['rotor-shafting-model']});
  }

  if(body['acce-options-capacitor'] == 'on'){
    inputObj.accessories.push({
      name:'acce-options-capacitor',
      'acce-options-capacitor1': body['acce-options-capacitor1'],
      'acce-options-capacitor2': body['acce-options-capacitor2'],
      model: body['acce-options-capacitor-model'],
      formal: body['acce-options-capacitor1'] + ' of ' +  body['acce-options-capacitor2'] + ' Capacitor'
    });
  }
  if(body['acce-options-fanblade'] == 'on'){
    inputObj.accessories.push({
      name:'acce-options-fanblade',
      'acce-options-fanblade1': body['acce-options-fanblade1'],
      'acce-options-fanblade2': body['acce-options-fanblade2'],
      model: body['acce-options-fanblade-model'],
      formal: body['acce-options-fanblade1'] + ' of ' +  body['acce-options-fanblade2'] + ' Fanblade'
    });
  }
  if(body['acce-options-oilseal'] == 'on'){
    inputObj.accessories.push({
      name:'acce-options-oilseal',
      'acce-options-oilseal1': body['acce-options-oilseal1'],
      'acce-options-oilseal2': body['acce-options-oilseal2'],
      model: body['acce-options-oilseal-model'],
      formal: body['acce-options-oilseal1'] + ' of ' +  body['acce-options-oilseal2'] + ' Oil Seal'
    });
  }
  if(body['acce-options-shaftseal'] == 'on'){
    inputObj.accessories.push({
      name:'acce-options-shaftseal',
      'acce-options-shaftseal1': body['acce-options-shaftseal1'],
      'acce-options-shaftseal2': body['acce-options-shaftseal2'],
      model: body['acce-options-shaftseal-model'],
      formal: body['acce-options-shaftseal1'] + ' of ' +  body['acce-options-shaftseal2'] + ' Oil Seal'
    });
  }
  if(body['acce-options-oring-or-packing'] == 'on'){
    inputObj.accessories.push({
      name:'acce-options-oring-or-packing',
      'acce-options-oring-or-packing1': body['acce-options-oring-or-packing1'],
      model: body['acce-options-oring-or-packing-model'],
      formal: 'Replacement of ' +  body['acce-options-oring-or-packing1']
    });
  }
  if(body['acce-options-capilla-or-gear'] == 'on'){
    inputObj.accessories.push({
      name:'acce-options-capilla-or-gear',
      'acce-options-capilla-or-gear1': body['acce-options-capilla-or-gear1'],
      'acce-options-capilla-or-gear2': body['acce-options-capilla-or-gear2'],
      model: body['acce-options-capilla-or-gear-model'],
      formal: body['acce-options-capilla-or-gear1'] + ' of ' +  body['acce-options-capilla-or-gear2']
    });
  }
  
  if(body['acce-other-1-check'] == 'on'){
    inputObj.accessories.push({name:'acce-other-1', formal: body['acce-other-1'], model: body['acce-other-1-model']});
  }


  if(body['acce-fancover'] == 'on'){
    inputObj.mechanical.push({name:'acce-fancover', formal: 'Fabrication of Fan Cover', model: body['acce-fancover-model']});
  }
  if(body['acce-terminal'] == 'on'){
    inputObj.mechanical.push({name:'acce-terminal', formal: 'Fabrication of Terminal Cover', model: body['acce-terminal-model']});
  }
  if(body['acce-wielding'] == 'on'){
    inputObj.mechanical.push({name:'acce-wielding', formal: 'Welding of Endplate', model: body['acce-wielding-model']});
  }
  if(body['acce-terminalpost'] == 'on'){
    inputObj.mechanical.push({name:'acce-terminalpost', formal: 'Fabrication of Terminal Post', model: body['acce-terminalpost-model']});
  }
  if(body['acce-cable'] == 'on'){
    inputObj.mechanical.push({name:'acce-cable', formal: 'Fabrication of Adaptor Cable', model: body['acce-cable-model']});
  }
  if(body['acce-alignment'] == 'on'){
    inputObj.mechanical.push({name:'acce-alignment', formal:'Fabrication of Shafting including Alignment', model: body['acce-alignment-model']});
  }
  if(body['acce-finge-coupling'] == 'on'){
    inputObj.mechanical.push({name:'acce-finge-coupling', formal: 'Replacement of Flange Coupling including Reboring', model: body['acce-finge-coupling-model']});
  }
  if(body['acce-shafting'] == 'on'){
    inputObj.mechanical.push({name:'acce-shafting', formal: 'Build up and Machining of Shafting', model: body['acce-shafting-model']});
  }
  if(body['acce-welding-motor'] == 'on'){
    inputObj.mechanical.push({name:'acce-welding-motor', formal: 'Welding of Motor Base', model: body['acce-welding-motor-model']});
  }
  if(body['acce-reboring-housing'] == 'on'){
    inputObj.mechanical.push({name:'acce-reboring-housing', formal: 'Reboring of Bearing Housing', model: body['acce-reboring-housing-model']});
  }
  if(body['acce-sleeving'] == 'on'){
    inputObj.mechanical.push({name:'acce-sleeving', formal:'Sleeving of Bearing Housing', model: body['acce-sleeving-model']});
  }
  if(body['dynamic-options'] == 'on'){
    inputObj.dynamic.push({
      name:'dynamic-options',
      'dynamic-options2': body['dynamic-options2'],
      model: body['dynamic-options-model'],
      formal: body['dynamic-options2']
    });
  }
   
  for(var j=1; j<1000; j++){
    if(body['misc-'+j]){
      inputObj.misc.push({name:body['misc-'+j], formal: body['misc-'+j]});
    }
    else {
      break;
    }
  }
  
  //BEFORE

  inputObj.beftestingwoload1 = body.beftestingwoload1
  inputObj.beftestingwoload2 = body.beftestingwoload2
  inputObj.beftestingwoload3 = body.beftestingwoload3

  inputObj.beftestingwload1 = body.beftestingwload1
  inputObj.beftestingwload2 = body.beftestingwload2
  inputObj.beftestingwload3 = body.beftestingwload3

  var befinsulationResult = {
    wielding: '',
    insulation: '',
    highpotentioal: '',
    surgetest: ''
  }
  var befhighpotential = [{items: ['', '', '']}, {items: ['', '', '']}]
  var befinsulationVoltdependent = [{items: ['','']}, {items: ['','']}]

  //Before Winding Resistance Test
  inputObj.before.befwinding = body.befwinding
  var befctrs = { trip: 0, num: 0, empt: 0, zero: 0};
  for(var i=0; i<inputObj.before.befwinding.length; i++)
  {
    if(inputObj.before.befwinding[i] == '') {
      inputObj.before.befwinding[i] = ''
      befctrs.empt++
    }
    else if(typeof parseFloat(inputObj.before.befwinding[i]) == 'number')
    {
      inputObj.before.befwinding[i] = parseFloat(inputObj.before.befwinding[i])
      befctrs.num++
      if(parseFloat(inputObj.before.befwinding[i]) == 0)
        befctrs.zero++
    }
    else{
      inputObj.before.befwinding[i] = ''
      befctrs.empt++
    }
  }

  if(befctrs.trip > 0)
  {
    befinsulationResult.wielding = 'FAILED'
  } 
  else if(befctrs.trip == 0 && befctrs.num == 3 && befctrs.empt == 0)
  {
    var befmax = Math.max(...inputObj.before.befwinding)
    var befmin = Math.min(...inputObj.before.befwinding)
    var result = ((befmax-befmin)/befmin) * 100

    if(result < 5 && befctrs.zero == 0){
      befinsulationResult.wielding = 'PASSED'
    }else 
    {
      befinsulationResult.wielding = 'FAILED'
    }
  }
  else befinsulationResult.wielding = ''

  
  inputObj.before.befinsulationResult = befinsulationResult
 

  //Before Insulation Resistance Test (MEGA-OHMS)
  inputObj.before.befinsulation1 = body.befinsulation1
  inputObj.before.befinsulation2 = body.befinsulation2
  inputObj.before.befpi = body.befpi
  if(parseInt(body.voltage) < 440)
  {
   
    if(inputObj.before.befinsulation1 == '') befinsulationVoltdependent[0].items[0] = ''
    else befinsulationVoltdependent[0].items[0] = inputObj.befinsulation1 + ' m ohm'
    befinsulationVoltdependent[0].items[1] = ''

    if(inputObj.before.befinsulation2 == '') befinsulationVoltdependent[1].items[0] = ''
    else befinsulationVoltdependent[1].items[0] = inputObj.before.befinsulation2 + ' m ohm'
    befinsulationVoltdependent[1].items[1] = ''
    
    for(var i=0; i<body.befhighpotential.length; i++)
      befhighpotential[0].items[i] = body.befhighpotential[i]
    
    
    if(inputObj.before.befinsulation2 == '' && inputObj.before.befinsulation1 == '')
      befinsulationResult.insulation = ''
    else if(inputObj.before.befinsulation2 == '')
    {
      if(parseFloat(inputObj.before.befinsulation1) > 50 && parseFloat(inputObj.before.befpi) >= 1) befinsulationResult.insulation = 'PASSED'
      else befinsulationResult.insulation = 'FAILED'
    } 
    else if(typeof parseFloat(inputObj.before.befinsulation1) == 'number' && typeof parseFloat(inputObj.before.befinsulation2) == 'number')
    {
      if(parseFloat(inputObj.before.befinsulation2) > 50 && parseFloat(inputObj.before.befpi) >= 1) befinsulationResult.insulation = 'PASSED'
      else befinsulationResult.insulation = 'FAILED'
    }
    else befinsulationResult.insulation = 'FAILED'
  }
  else if (parseInt(body.voltage) >= 440)
  {
    if(inputObj.before.befinsulation1 == '') befinsulationVoltdependent[1].items[0] = ''
    else befinsulationVoltdependent[1].items[0] = inputObj.before.befinsulation1 + ' m ohm'
    befinsulationVoltdependent[0].items[0] = ''

    if(inputObj.before.befinsulation2 == '') befinsulationVoltdependent[1].items[1] = ''
    else befinsulationVoltdependent[1].items[1] = inputObj.before.befinsulation2 + ' m ohm'
    befinsulationVoltdependent[0].items[1] = ''

    for(var i=0; i<body.befhighpotential.length; i++)
      befhighpotential[1].items[i] = body.befhighpotential[i]
    
    if(inputObj.before.befinsulation2 == '' && inputObj.before.befinsulation1 == '')
    befinsulationResult.insulation = ''
    else if(inputObj.before.befinsulation2 == '')
    {
      if(parseFloat(inputObj.before.befinsulation1) > 100 && parseFloat(inputObj.before.befpi) >= 1) befinsulationResult.insulation = 'PASSED'
      else befinsulationResult.insulation = 'FAILED'
    } 
    else if(typeof parseFloat(inputObj.before.befinsulation1) == 'number' && typeof parseFloat(inputObj.before.befinsulation2) == 'number')
    {
      if(parseFloat(inputObj.before.befinsulation2) > 100 && parseFloat(inputObj.before.befpi) >= 1) befinsulationResult.insulation = 'PASSED'
      else befinsulationResult.insulation = 'FAILED'
    }
    else befinsulationResult.insulation = 'FAILED'
  }

  //Before High Potential Test (MICRO-OHMS)
  inputObj.before.befhighpotential = body.befhighpotential
  var befctrs2 = { trip: 0, num: 0, empt: 0, ne: 0};

  for(var i=0; i<inputObj.before.befhighpotential.length; i++)
  {
    if(inputObj.before.befhighpotential[i] == '') {
      inputObj.before.befhighpotential[i] = ''
      befctrs2.empt++
    }
    else if(inputObj.before.befhighpotential[i] == 'TRIP' || inputObj.before.befhighpotential[i] == 'trip') 
    {
      inputObj.before.befhighpotential[i] = 'TRIP'
      befctrs2.trip++
    }
    else if(typeof parseFloat(inputObj.before.befhighpotential[i]) == 'number')
    {
      inputObj.before.befhighpotential[i] = parseFloat(inputObj.before.befhighpotential[i])
      befctrs2.num++
      if(parseFloat(inputObj.before.befhighpotential[i]) > 120)
        befctrs2.ne++
    }
    else{
      inputObj.before.befhighpotential[i] = ''
      befctrs2.empt++
    }
  }


  if(befctrs2.empt == 3) befinsulationResult.highpotentioal = ''
  else if(befctrs2.trip == 0 && befctrs2.num == 3 && befctrs2.empt == 0) 
  {
    if(inputObj.before.befhighpotential[0] == inputObj.before.befhighpotential[1] && inputObj.before.befhighpotential[0] == inputObj.before.befhighpotential[2] && inputObj.before.befhighpotential[1] == inputObj.before.befhighpotential[2])
    {
      if(inputObj.before.befhighpotential[0] < 120) befinsulationResult.highpotentioal = 'PASSED'
      else befinsulationResult.highpotentioal = 'FAILED'
    }
    else befinsulationResult.highpotentioal = 'FAILED'
  }
  else befinsulationResult.highpotentioal = 'FAILED'

  //Before Surge Test/Comparison Test 
  var befctrs3 = {phase1: 0, phase2: 0};
  var befphase1list = ['', '', '']

  if(body.befphase1)
  {
    inputObj.before.befphase1 = body.befphase1
    if (typeof inputObj.before.befphase1 == 'string') {
      befctrs3.phase1 = 1
      if(body.befphase1 == 'coiltocoil') befphase1list[0] = 'x'
      if(body.befphase1 == 'opencoil') befphase1list[1] = 'x'
      if(body.befphase1 == 'arching') befphase1list[2] = 'x'
    }
    else if (typeof inputObj.before.befphase1 == 'object') 
    {
      if(inputObj.before.befphase1.length > 0) befctrs3.phase1 = 1
      for(var i=0; i<3; i++)
      {
        if(body.befphase1[i] == 'coiltocoil') befphase1list[0] = 'x'
        if(body.befphase1[i] == 'opencoil') befphase1list[1] = 'x'
        if(body.befphase1[i] == 'arching') befphase1list[2] = 'x'
      }
    }
  }

  if(body.befphase2)
  {
    inputObj.before.befphase2 = body.befphase2
    befctrs3.phase2 = 1
  }

  if(body.befphase1 || body.befphase2)
  {
    var befphase2list = ''
    if(befctrs3.phase1 == 0 && befctrs3.phase2 == 1) 
    {
      befinsulationResult.surgetest = 'PASSED'
      befphase2list = 'x'
    }
    else befinsulationResult.surgetest = 'FAILED'
  }
  
  inputObj.before.befnotes = body.befnotes
  inputObj.before.befremarks = body.befremarks
  inputObj.before.startdate = Date.now()

  if(body.befrewindrecon)
  {
    inputObj.before.befrewindrecon = body.befrewindrecon
  }

  return inputObj
}
 
const createPrelimDocsObj = async (body, oncheckup, tagID) => {
  var inputObj = {};
  inputObj.stator = [];
  inputObj.accessories = [];
  inputObj.mechanical = [];
  inputObj.dynamic = [];
  inputObj.misc = [];
  inputObj.startdate = body.startdate
  inputObj.finishdate = body.finishdate
  inputObj.files = []
  inputObj.rewindername = body.rewindername;
  inputObj.tagID = parseInt(tagID);
  inputObj.discount = null
  if(body.discount_percent)
  {
    inputObj.discount = [body.discount_percent, 'percent'];
  }

  if(body.discount_fixed)
  {
    inputObj.discount = [body.discount_fixed, 'fixed'];
  }


  //General Reqs
  inputObj.gen = [] 
  inputObj.gen.push({ 
    name: 'Pickup and Delivery',
    qty: body['genreq-pickup-qty'],
    unitcost: body['genreq-pickup-unitcost'],
    totalcost: body['genreq-pickup-totalcost']
  })
  inputObj.gen.push({ 
    name: 'Dismantling and Installation',
    qty: body['genreq-dismantling-qty'],
    unitcost: body['genreq-dismantling-unitcost'],
    totalcost: body['genreq-dismantling-totalcost']
  })

  if(oncheckup.stator){
    for(var i=1; i <= oncheckup.stator.length; i++)
    {
      inputObj.stator.push(
        {
          name: oncheckup.stator[i-1].name,
          qty: body['stator-qty-'+i],
          unitcost: body['stator-unitcost-'+i],
          totalcost: body['stator-totalcost-'+i]
        }
      )
    }
  }

  if(oncheckup.accessories){
    for(var i=1; i <= oncheckup.accessories.length; i++)
    {
      if(oncheckup.accessories[i-1].name != 'acce-other-1')
      {
        inputObj.accessories.push(
          {
            name: oncheckup.accessories[i-1].name,
            item: body['acce-item-'+i],
            qty: body['acce-qty-'+i],
            unitcost: body['acce-unitcost-'+i],
            totalcost: body['acce-totalcost-'+i]
          }
        )
      }
      else 
      {
        inputObj.accessories.push(
          {
            name: oncheckup.accessories[i-1].name,
            model: body['item-models'], 
            item: body['item-model-items'],
            qty: body['acce-qty-'+i],
            unitcost: body['acce-unitcost-'+i],
            totalcost: body['acce-totalcost-'+i]
          }
        )
      }
      
    }
  }

  if(oncheckup.mechanical){
    for(var i=1; i <= oncheckup.mechanical.length; i++)
    {
      inputObj.mechanical.push(
        {
          name: oncheckup.mechanical[i-1].name,
          item: body['mech-item-'+i],
          qty: body['mech-qty-'+i],
          unitcost: body['mech-unitcost-'+i],
          totalcost: body['mech-totalcost-'+i]
        }
      )
    }
  }

  if(oncheckup.dynamic){
    for(var i=1; i <= oncheckup.dynamic.length; i++)
    {
      inputObj.dynamic.push(
        {
          name: oncheckup.dynamic[i-1].name,
          
          qty: body['dynamic-qty-'+i],
          unitcost: body['dynamic-unitcost-'+i],
          totalcost: body['dynamic-totalcost-'+i]
        }
      )
    }
  }

  if(oncheckup.misc){
    for(var i=1; i <= oncheckup.misc.length; i++)
    {
      inputObj.misc.push(
        {
          name: oncheckup.misc[i-1].name,
          qty: body['misc-qty-'+i],
          unitcost: body['misc-unitcost-'+i],
          totalcost: body['misc-totalcost-'+i]
        }
      )
    }
  }
  return inputObj
}

const createOnRewindObj = async (body, tagID) => {
  var inputObj = {} 
  inputObj.tagID = parseInt(tagID)
  inputObj.rewindername = body.rewindername
  inputObj.startdate = body.startdate
  inputObj.finishdate = body.finishdate
  inputObj.checkitem = body.checkitem
  inputObj.files = []
  if(typeof body.checkitem == 'object')
  {
    for(var i=0; i<body.checkitem.length; i++)
    {
      inputObj[body.checkitem[i]] = body[body.checkitem[i]]
    }
  }
  else {
      inputObj.checkitem = [body.checkitem]
      inputObj[body.checkitem] = body[body.checkitem]
      
  }
  

  return inputObj
}

const createOnFabricationObj = async (body, tagID, oncheckup) => {
  inputObj = {}
  inputObj.tagID = parseInt(tagID)
  inputObj.startdate = body.startdate
  inputObj.finishdate = body.finishdate

  inputObj.mechanical = {
  };
  
  if(oncheckup.mechanical.length > 0)
  {
  
    for(var i=0; i<oncheckup.mechanical.length; i++)
    {
      inputObj.mechanical[oncheckup.mechanical[i].name] = false;
    }
    
    
    if(typeof body.mech == 'object')
    {
      for(var i=0; i<body.mech.length; i++)
      {
        inputObj.mechanical[body.mech[i]] = true;
      }
    } else if(typeof body.mech == 'string')
    {
      inputObj.mechanical[body.mech] = true;
    }
    
  }

  return inputObj
}

const createInBakingObj = async (body, tagID) => {
  inputObj = {}
  inputObj.tagID = parseInt(tagID)
  inputObj.startdate = body.startdate
  inputObj.finishdate = body.finishdate
  inputObj.files = []

  return inputObj
}

const createAssemblyAndTestingObj = async (body, tagID, oncheckup) => {
    inputObj = {}
    inputObj.tagID = parseInt(tagID)
    inputObj.startdate = body.startdate
    inputObj.finishdate = body.finishdate
    inputObj.supervisor = body.supervisor
    inputObj.files = []
    //AFTER

    inputObj.afttestingwoload1 = body.afttestingwoload1
    inputObj.afttestingwoload2 = body.afttestingwoload2
    inputObj.afttestingwoload3 = body.afttestingwoload3

    inputObj.afttestingwload1 = body.afttestingwload1
    inputObj.afttestingwload2 = body.afttestingwload2
    inputObj.afttestingwload3 = body.afttestingwload3

    var aftinsulationResult = {
      wielding: '',
      insulation: '',
      highpotentioal: '',
      surgetest: ''
    }
    var afthighpotential = [{items: ['', '', '']}, {items: ['', '', '']}]
    var aftinsulationVoltdependent = [{items: ['','']}, {items: ['','']}]

    //After Winding Resistance Test
    inputObj.aftwinding = body.aftwinding
    
    var aftctrs = { trip: 0, num: 0, empt: 0, zero: 0};
    for(var i=0; i<inputObj.aftwinding.length; i++)
    {
      if(inputObj.aftwinding[i] == '') {
        inputObj.aftwinding[i] = ''
        aftctrs.empt++
      }
      else if(typeof parseFloat(inputObj.aftwinding[i]) == 'number')
      {
        inputObj.aftwinding[i] = parseFloat(inputObj.aftwinding[i])
        aftctrs.num++
        if(parseFloat(inputObj.aftwinding[i]) == 0)
          aftctrs.zero++
      }
      else{
        inputObj.aftwinding[i] = ''
        aftctrs.empt++
      }
    }

    if(aftctrs.trip > 0)
    {
      aftinsulationResult.wielding = 'FAILED'
    } 
    else if(aftctrs.trip == 0 && aftctrs.num == 3 && aftctrs.empt == 0)
    {
      var aftmax = Math.max(...inputObj.aftwinding)
      var aftmin = Math.min(...inputObj.aftwinding)
      var result = ((aftmax-aftmin)/aftmin) * 100

      if(result < 5 && aftctrs.zero == 0){
        aftinsulationResult.wielding = 'PASSED'
      }else 
      {
        aftinsulationResult.wielding = 'FAILED'
      }
    }
    else aftinsulationResult.wielding = ''

    
    inputObj.aftinsulationResult = aftinsulationResult
    

    //After Insulation Resistance Test (MEGA-OHMS)
    inputObj.aftinsulation1 = body.aftinsulation1
    inputObj.aftinsulation2 = body.aftinsulation2

    inputObj.aftpi = body.aftpi
    if(parseInt(oncheckup.voltage) < 440)
    {
      
      if(inputObj.aftinsulation1 == '') aftinsulationVoltdependent[0].items[0] = ''
      else aftinsulationVoltdependent[0].items[0] = inputObj.aftinsulation1 + ' m ohm'
      aftinsulationVoltdependent[1].items[0] = ''

      if(inputObj.aftinsulation2 == '') aftinsulationVoltdependent[0].items[1] = ''
      else aftinsulationVoltdependent[0].items[1] = inputObj.aftinsulation2 + ' m ohm'
      aftinsulationVoltdependent[1].items[1] = ''
      
      for(var i=0; i<body.afthighpotential.length; i++)
        afthighpotential[0].items[i] = body.afthighpotential[i]
      

        if(inputObj.aftinsulation2 == '' && inputObj.aftinsulation1 == '')
          aftinsulationResult.insulation = ''
        else if(inputObj.aftinsulation2 == '')
        {
          if(parseFloat(inputObj.aftinsulation1) > 50 && parseFloat(inputObj.befpi) >= 1) aftinsulationResult.insulation = 'PASSED'
          else aftinsulationResult.insulation = 'FAILED'
        } 
        else if(typeof parseFloat(inputObj.aftinsulation1) == 'number' && typeof parseFloat(inputObj.aftinsulation2) == 'number')
        {
          if(parseFloat(inputObj.aftinsulation2) > 50 && parseFloat(inputObj.aftpi) >= 1) aftinsulationResult.insulation = 'PASSED'
          else aftinsulationResult.insulation = 'FAILED'
        }
        else aftinsulationResult.insulation = 'FAILED'

    }
    else if (parseInt(oncheckup.voltage) >= 440)
    {
      if(inputObj.aftinsulation1 == '') aftinsulationVoltdependent[1].items[0] = ''
      else aftinsulationVoltdependent[1].items[0] = inputObj.aftinsulation1 + ' m ohm'
      aftinsulationVoltdependent[0].items[0] = ''

      if(inputObj.aftinsulation2 == '') aftinsulationVoltdependent[1].items[1] = ''
      else aftinsulationVoltdependent[1].items[1] = inputObj.aftinsulation2 + ' m ohm'
      aftinsulationVoltdependent[0].items[1] = ''

      for(var i=0; i<body.afthighpotential.length; i++)
        afthighpotential[1].items[i] = body.afthighpotential[i]
      
        if(inputObj.aftinsulation2 == '' && inputObj.aftinsulation1 == '')
          aftinsulationResult.insulation = ''
        else if(inputObj.aftinsulation2 == '')
        {
          if(parseFloat(inputObj.aftinsulation1) > 100 && parseFloat(inputObj.befpi) >= 1) aftinsulationResult.insulation = 'PASSED'
          else aftinsulationResult.insulation = 'FAILED'
        } 
        else if(typeof parseFloat(inputObj.aftinsulation1) == 'number' && typeof parseFloat(inputObj.aftinsulation2) == 'number')
        {
          if(parseFloat(inputObj.aftinsulation2) > 100 && parseFloat(inputObj.aftpi) >= 1) aftinsulationResult.insulation = 'PASSED'
          else aftinsulationResult.insulation = 'FAILED'
        }
        else aftinsulationResult.insulation = 'FAILED'
    }

    //After High Potential Test (MICRO-OHMS)
    inputObj.afthighpotential = body.afthighpotential
    var aftctrs2 = { trip: 0, num: 0, empt: 0, ne: 0};

    for(var i=0; i<inputObj.afthighpotential.length; i++)
    {
      if(inputObj.afthighpotential[i] == '') {
        inputObj.afthighpotential[i] = ''
        aftctrs2.empt++
      }
      else if(inputObj.afthighpotential[i] == 'TRIP' || inputObj.afthighpotential[i] == 'trip') 
      {
        inputObj.afthighpotential[i] = 'TRIP'
        aftctrs2.trip++
      }
      else if(typeof parseFloat(inputObj.afthighpotential[i]) == 'number')
      {
        inputObj.afthighpotential[i] = parseFloat(inputObj.afthighpotential[i])
        aftctrs2.num++
        if(parseFloat(inputObj.afthighpotential[i]) > 120)
          aftctrs2.ne++
      }
      else{
        inputObj.afthighpotential[i] = ''
        aftctrs2.empt++
      }
    }

  
    if(aftctrs2.empt == 3) aftinsulationResult.highpotentioal = ''
    else if(aftctrs2.trip == 0 && aftctrs2.num == 3 && aftctrs2.empt == 0) 
    {
      if(inputObj.afthighpotential[0] == inputObj.afthighpotential[1] && inputObj.afthighpotential[0] == inputObj.afthighpotential[2] && inputObj.afthighpotential[1] == inputObj.afthighpotential[2])
      {
  
        if(inputObj.afthighpotential[0] < 120) aftinsulationResult.highpotentioal = 'PASSED'
        else aftinsulationResult.highpotentioal = 'FAILED'
      }
      else aftinsulationResult.highpotentioal = 'FAILED'
    }
    else aftinsulationResult.highpotentioal = 'FAILED'

    //Before Surge Test/Comparison Test 
    var aftctrs3 = {phase1: 0, phase2: 0};
    var aftphase1list = ['', '', '']
    if(body.aftphase1)
    {
      inputObj.aftphase1 = body.aftphase1
      if (typeof inputObj.aftphase1 == 'string') {
        aftctrs3.phase1 = 1
        if(body.aftphase1 == 'coiltocoil') aftphase1list[0] = 'x'
        if(body.aftphase1 == 'opencoil') aftphase1list[1] = 'x'
        if(body.aftphase1 == 'arching') aftphase1list[2] = 'x'
      }
      else if (typeof inputObj.aftphase1 == 'object') 
      {
        if(inputObj.aftphase1.length > 0) aftctrs3.phase1 = 1
        for(var i=0; i<3; i++)
        {
          if(body.aftphase1[i] == 'coiltocoil') aftphase1list[0] = 'x'
          if(body.aftphase1[i] == 'opencoil') aftphase1list[1] = 'x'
          if(body.aftphase1[i] == 'arching') aftphase1list[2] = 'x'
        }
      }
    }

    if(body.aftphase2)
    {
      inputObj.aftphase2 = body.aftphase2
      aftctrs3.phase2 = 1
    }
    
    if(body.aftphase1 || body.aftphase2)
    {
      var aftphase2list = ''
      if(aftctrs3.phase1 == 0 && aftctrs3.phase2 == 1) 
      {
        aftinsulationResult.surgetest = 'PASSED'
        aftphase2list = 'x'
      }
      else aftinsulationResult.surgetest = 'FAILED'
    }
    
    inputObj.aftnotes = body.aftnotes
    inputObj.aftremarks = body.aftremarks

    return inputObj
}

const createPaintingObj = async (body, tagID) => {
  var inputObj = {}
  inputObj.tagID = parseInt(tagID)
  inputObj.startdate = body.startdate
  inputObj.finishdate = body.finishdate
  return inputObj
}

const createForDeliveryObj = async (body, tagID) => {
  var inputObj = {}
  inputObj.tagID = parseInt(tagID)
  inputObj.pono = body.pono
  inputObj.drno = body.drno
  inputObj.invoice = body.invoice
  inputObj.startdate = body.startdate
  inputObj.finishdate = body.finishdate
  inputObj.deliveredby = body.deliveredby
  return inputObj
}

const createForBillingStatement = async (body, tagID, company) => {
  var inputObj = {}
  inputObj.tagID = parseInt(tagID)
  inputObj.sino = body.sino
  inputObj.startdate = body.startdate
  inputObj.finishdate = body.finishdate

  inputObj.compname = company.compname
  inputObj.compaddress = company.street + ', ' + company.brgy + ', ' + company.city + ', ' + company.state
  return inputObj

}

const createForOr = async (body, tagID) => {
  var inputObj = {}
  inputObj.tagID = parseInt(tagID)
  inputObj.orno = body.orno
  inputObj.startdate = body.startdate
  inputObj.finishdate = body.finishdate

  return inputObj
}

const createCompletedObj = async (body, tagID) => {
  var inputObj = {}
  inputObj.tagID = parseInt(tagID)
  inputObj.startdate = body.startdate
  inputObj.finishdate = body.finishdate
  
  return inputObj
}
exports.createMotorObj = createMotorObj
exports.createOncheckupObj = createOncheckupObj
exports.createPrelimDocsObj = createPrelimDocsObj
exports.createOnRewindObj = createOnRewindObj
exports.createOnFabricationObj = createOnFabricationObj
exports.createInBakingObj = createInBakingObj
exports.createAssemblyAndTestingObj = createAssemblyAndTestingObj
exports.createPaintingObj = createPaintingObj
exports.createForDeliveryObj = createForDeliveryObj
exports.createForBillingStatement = createForBillingStatement
exports.createForOr = createForOr
exports.createCompletedObj = createCompletedObj