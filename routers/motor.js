const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
const stages = require('../db/stages');
var client = require('../db/config').client;
//Input
const PDFDocument = require('pdfkit');
const fs = require('fs');


//PDF
// Define font files
var fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman', 
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
const { checkAuthenticated, authRole, authRoleByStage } = require('./../auth')
router.all('*', checkAuthenticated)

router.post('/newSubmotor', async function (req, res) {
  var inputObj = await stages.createMotorObj(req.body)
  inputObj.tagID = parseInt(req.body.tagID)

  const pipeline = [
    {
      '$match': {
        'tagID': {
          '$exists': 1,
          '$ne': 'null'
        }
      }
    },
    {
      '$group': {
        '_id': '$tagID'
      }
    }

  ];

  const aggCursor = await client.db("caic-sample").collection("motors").aggregate(pipeline);
  const tagID_list = await aggCursor.toArray()

  await methods.insertSubmotorItem(client, 'notstarted', inputObj, req.user);
  await methods.updateMotherItem(client, 'notstarted', inputObj.tagID, req.user);
  res.render('innerpages/newSubmotor', {tagID_list: tagID_list, stage: 'Not Started', maxTagID: await methods.getMaxTagID(client), companies: await methods.getCompanies(client), user: req.user});
})


// @route   GET motor/getPmList
// @desc    Get PM List
// @access  Public
router.get('/getPmList', async function (req, res) {
  const pipeline = [
    {
      '$match': {
        'pmID': {
          '$exists': 1,
          '$ne': 'null'
        }
      }
    },
    {
      '$group': {
        '_id': '$pmID'
      }
    }
  ];

  const aggCursor = await client.db("caic-sample").collection("motors").aggregate(pipeline);
  res.send(await aggCursor.toArray());
})

// @route   GET motor/viewAllMotors
// @desc    View all motors
// @access  Public
router.get('/viewAllMotors', checkAuthenticated, async function (req, res) {
  var notifs = await methods.getNotifs(client, 5, 0)
  var motorcount = await methods.getCount(client, 'motors')
  var notifctr = notifs.length;
  var fullUrl = req.protocol + '://' + req.get('host');
  const items = await methods.getMotors(client, 'motors', {_id: 1, tagID: 1, datePulledOut: 1, status: 1, company: 1, company_id: 1, motorType: 1, power: 1, pmID: 1, remarks: 1, submotor:1 }, 10, 0, 'all')
  
  res.render('viewAll', {motorcount:motorcount,notifications: notifs, notifctr: notifctr,username: req.user.username, fullUrl: fullUrl, role: req.user.ROLE, items: items, statusStats: await methods.getStatusStats(client)});
})


router.get('/viewAllMotors/:stage', checkAuthenticated, async function (req, res) {
  var notifs = await methods.getNotifs(client, 5, 0)
  var motorcount = await methods.getCount(client, 'motors')
  var notifctr = notifs.length;
  var fullUrl = req.protocol + '://' + req.get('host');
  const items = await methods.getMotors(client, 'motors', {_id: 1, tagID: 1, datePulledOut: 1, status: 1, company: 1, company_id: 1, motorType: 1, power: 1, pmID: 1, remarks: 1, submotor:1 }, 10, 0, req.params.stage)
  res.render('viewAll', { stage: req.params.stage, motorcount: motorcount, notifications: notifs, notifctr: notifctr, username: req.user.username, fullUrl: fullUrl, role: req.user.ROLE, items: items, statusStats: await methods.getStatusStats(client)});
})


//Users
router.get('/viewAllUsers', checkAuthenticated, async function (req, res) {
  var notifs = await methods.getNotifs(client, 5, 0)
  var notifctr = notifs.length;
  var fullUrl = req.protocol + '://' + req.get('host');
  res.render('viewAllUsers', {notifications: notifs, notifctr: notifctr, username: req.user.username, fullUrl: fullUrl, role: req.user.ROLE, items: await methods.getAll(client, 'users'), statusStats: await methods.getStatusStats(client)});
})
 

//Companies
router.get('/viewAllCompanies', checkAuthenticated, async function (req, res) {
  var isAllowed = false 
  if(req.user.ROLE == 'admin') isAllowed = true

  var notifs = await methods.getNotifs(client, 5, 0)
  var notifctr = notifs.length;
  var fullUrl = req.protocol + '://' + req.get('host');
  res.render('viewAllCompanies', {isAllowed: isAllowed, notifications: notifs, notifctr: notifctr, username: req.user.username, fullUrl: fullUrl, role: req.user.ROLE, items: await methods.getAll(client, 'company'), statusStats: await methods.getStatusStats(client)});
})

//Rewinders
router.get('/viewAllRewinders', checkAuthenticated, async function (req, res) {
  var isAllowed = false 
  if(req.user.ROLE == 'admin') isAllowed = true

  var notifs = await methods.getNotifs(client, 5, 0)
  var notifctr = notifs.length;
  var fullUrl = req.protocol + '://' + req.get('host');
  res.render('viewAllRewinders', {isAllowed: isAllowed, notifications: notifs, notifctr: notifctr, username: req.user.username, fullUrl: fullUrl, role: req.user.ROLE, items: await methods.getAll(client, 'rewinder'), statusStats: await methods.getStatusStats(client)});
})

// @route   GET motor/viewItemPrices
// @desc    View all item prices
// @access  Public
router.get('/viewItemPrices',async function (req, res) {
  
  var notifs = await methods.getNotifs(client, 5, 0)
  var notifctr = notifs.length;
  var fullUrl = req.protocol + '://' + req.get('host');
  var modelnames = await methods.getModelNames(client)
  

  res.render('itemPrices', {models: modelnames, notifications: notifs, notifctr: notifctr, statusStats: null, username: req.user.username, role: req.user.ROLE, fullUrl: fullUrl, statusStats: await methods.getStatusStats(client)});
})


// @route   GET motor/newMotor
// @desc    Register a motor
// @access  Public
router.get('/newMotor', authRole(['admin','salesRep', 'marketing']), async function (req, res) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  res.render('innerpages/newMotor', {date: today, currStage: 'notstarted', stage: 'Not Started', maxTagID: await methods.getMaxTagID(client), companies: await methods.getCompanies(client), user: req.user});
})
// @route   POST motor/newMotor
// @desc    Register a motor
// @access  Public
router.post('/newMotor', async function (req, res) {
  const company = await methods.getSingleCompany(client, req.body.company)
  const inputObj = await stages.createMotorObj(req.body, company)
  await methods.insertItem(client, 'notstarted', inputObj, req.user, 1000);
  res.render('innerpages/newMotor', {currStage: 'notstarted', stage: 'Not Started', maxTagID: [{ _id: null, maxNumber: parseInt(req.body.tagID) }], companies: await methods.getCompanies(client), user: req.user});
})


// @route   GET motor/motorItemStage
// @desc    Get the item of the current stage
// @access  Public 
// router.get('/motorItemStage/:tagid',  authRoleByStage(), async (req, res) => {
router.get('/motorItemStage/:tagid', async (req, res) => {
  const status = await methods.getCurrentStatus(client, req.params.tagid);
  const motordetails = await methods.createMotorDetails(client, req.params.tagid);
  var fullUrl = req.protocol + '://'   + req.get('host');
  switch(status.status){
    case 'notstarted': 
      if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor' || req.user.ROLE == 'warehouse')
      {
        var draft = await methods.getDraft(client, 'oncheckup', req.params.tagid)
        let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagid, false); 
        
        pdfURL = 'public/pdfs/iar/iar-front-'+ req.params.tagid+'.pdf'
        pdfURL2 = 'public/pdfs/iar/iar-back-'+req.params.tagid+'.pdf'
        res.render('innerpages/oncheckup', {motorObjOncheckup:motorObjOncheckup,fullUrl :fullUrl, tagID: req.params.tagid, motordetails: motordetails, currStage: 'oncheckup', stage: 'Not Started -> On Checkup', draft: draft, pdfURL: '../../io/asset/iar/front/'+req.params.tagid, pdfURL2: '../../io/asset/iar/back/'+req.params.tagid});
      }
      else 
        return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
      break;
    case 'oncheckup':
      if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing' || req.user.ROLE == 'warehouse')
      {
        var draft = await methods.getDraft(client, 'prelimdocs', req.params.tagid)
        let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagid, false); 
        
        res.render('innerpages/prelimdocs', {role: req.user.ROLE, fullUrl: fullUrl, motordetails: motordetails, currStage: 'prelimdocs', stage: 'On Checkup -> Prelim Documents', draft: draft, pdfURL: '../../io/asset/'+req.params.tagid, tagID: req.params.tagid, motorObjOncheckup: motorObjOncheckup});
      }
      else  
        return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
      break;
    case 'prelimdocs':
      if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
      {
        var oncheckup4 = await methods.getSingleOnCheckup(client, req.params.tagid, false);
        var draft = await methods.getDraft(client, 'onrewind', req.params.tagid)
        res.render('innerpages/onrewind', {oncheckup:oncheckup4, fullUrl: fullUrl, motordetails: motordetails, currStage: 'onrewind', stage: 'Prelim Documents -> On Rewind', tagID: req.params.tagid, draft:draft});
      }
      else 
        return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
      break;
    case 'onrewind': 
      if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
      {
        var oncheckup5 = await methods.getSingleOnCheckup(client, req.params.tagid, false);
        var draft = await methods.getDraft(client, 'onfabrication', req.params.tagid)
        res.render('innerpages/onfabrication', {oncheckup:oncheckup5, fullUrl: fullUrl, motordetails: motordetails, currStage: 'onfabrication', stage: 'On Rewind -> On Fabrication', tagID: req.params.tagid, draft: draft});
      }
      else 
        return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
      
      break;
    case 'onfabrication': 
      if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
      {
        let oncheckup = await methods.getSingleOnCheckup(client, req.params.tagid); 
        var draft = await methods.getDraft(client, 'inbaking', req.params.tagid)
        res.render('innerpages/inbaking', {oncheckup:oncheckup, fullUrl: fullUrl, motordetails: motordetails, currStage: 'inbaking', stage: 'On Fabrication -> In Baking', tagID: req.params.tagid, draft:draft});
      }
      else 
        return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})

      break;
    case 'inbaking': 
      
      if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
      {
        let oncheckup = await methods.getSingleOnCheckup(client, req.params.tagid); 
        var draft = await methods.getDraft(client, 'assemblyandtesting', req.params.tagid)
        const supervisors = await client.db("caic-sample").collection("users").find({ROLE: 'supervisor'}).project({'_id': 0, 'name': 1});
        res.render('innerpages/assemblyandtesting', {oncheckup: oncheckup, fullUrl: fullUrl, motordetails: motordetails, currStage: 'assemblyandtesting', stage: 'In Baking -> Assembly and Testing', tagID: req.params.tagid, draft: draft, supervisors: await supervisors.toArray()});
      }
      else 
        return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
      break;
    case 'assemblyandtesting': 
      if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
      {
        let oncheckup = await methods.getSingleOnCheckup(client, req.params.tagid, false); 
        var draft = await methods.getDraft(client, 'painting', req.params.tagid)
        res.render('innerpages/painting', {oncheckup:oncheckup, fullUrl: fullUrl, motordetails: motordetails, currStage: 'painting', stage: 'Assembly and Testing -> Painting', tagID: req.params.tagid, draft: draft});
      }
      else 
        return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
      break;
    case 'painting': 
      var draft = await methods.getDraft(client, 'fordelivery', req.params.tagid)
      var notstarted = await methods.getSingle(client, 'motors', req.params.tagid)
      var fordelivery_user = await methods.getUsers(client, ['admin', 'salesRep'])
      let oncheckup = await methods.getSingleOnCheckup(client, req.params.tagid, false); 
      
      if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing' || req.user.ROLE == 'warehouse')
      {
        if(notstarted.submotor.isSubmotor == false)
        { 
          //If it is, does it have a submotor/child?
          if(notstarted.submotor.child != null)
          {
            //Get the stage of child
            var currstage = await methods.getItemStage(client, notstarted.submotor.child)
            //Check stage if child is on painting stage
            if(currstage[0].status == 'painting')
            {
              //If stage is painting, then as is
              res.render('innerpages/fordelivery', {oncheckup: oncheckup, fordelivery_user:fordelivery_user, fullUrl:fullUrl, motordetails: motordetails, currStage: 'fordelivery', stage: 'Painting -> For Delivery', tagID: req.params.tagid, draft: draft, disableGenerate: false, child: null});
            }
            else {
                //If not, send a variable to UI to disable the Button that generates DR.
                res.render('innerpages/fordelivery', {oncheckup:oncheckup, fordelivery_user:fordelivery_user, fullUrl:fullUrl, motordetails: motordetails, currStage: 'fordelivery', stage: 'Painting -> For Delivery', tagID: req.params.tagid, draft: draft, disableGenerate: true, child: notstarted.submotor.child});
            }
          }
          else {
            //Normal motor without child
            res.render('innerpages/fordelivery', {oncheckup:oncheckup, fordelivery_user:fordelivery_user, fullUrl: fullUrl, motordetails: motordetails, currStage: 'fordelivery', stage: 'Painting -> For Delivery', tagID: req.params.tagid, draft: draft, disableGenerate: false, child: null});
          } 
        }
        else 
          res.render('errorpages/error', {title: "Restricted!", message: 'This is a Submotor. Delivery Receipt can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + notstarted.submotor.parent, errorType: 'danger'});
      }
      else 
        return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
      break;
    case 'fordelivery': 
      if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing')
      {
        var draft = await methods.getDraft(client, 'forbillingstatement', req.params.tagid)
        var notstarted = await methods.getSingle(client, 'motors', req.params.tagid)
        var company = await methods.getCompany(client, notstarted.company_id)
        let oncheckup = await methods.getSingleOnCheckup(client, req.params.tagid, false); 

        if(notstarted.submotor.isSubmotor == true)
          res.render('errorpages/error', {title: "Restricted!", message: 'This is a Submotor. Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + notstarted.submotor.parent, errorType: 'danger'});
        else 
          res.render('innerpages/forbillingstatement', {oncheckup: oncheckup, fullUrl: fullUrl, currStage: 'forbillingstatement', company: {compname: company.compname, address: company.street + ', ' + company.brgy + ', ' + company.city + ', ' + company.state}, motordetails: motordetails, stage: 'For Delivery -> For Billing Statement', tagID: req.params.tagid, draft:draft});
      }
      else 
        return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
      break;
    case 'forbillingstatement': 
      var draft = await methods.getDraft(client, 'foror', req.params.tagid)
      var notstarted = await methods.getSingle(client, 'motors', req.params.tagid)
      let oncheckup2 = await methods.getSingleOnCheckup(client, req.params.tagid, false); 

      res.render('innerpages/foror', {oncheckup:oncheckup2, fullUrl:fullUrl, currStage: 'foror', motordetails: motordetails, draft: draft,stage: 'For Billing Statement -> For OR', tagID: req.params.tagid});
      break;
    case 'foror':
      var draft = await methods.getDraft(client, 'completed', req.params.tagid)
      let oncheckup3 = await methods.getSingleOnCheckup(client, req.params.tagid, false); 
      res.render('innerpages/completed', {oncheckup:oncheckup3, fullUrl:fullUrl, currStage: 'completed', motordetails: motordetails, draft: draft,stage: 'For OR -> Completed!', tagID: req.params.tagid});
      break;
    case 'completed':
      res.render('errorpages/error', {draft:draft, title: "Yey!", message: 'Great job! If this motor has a submotor, I also marked it as completed. You can always go back to the Edit page to check the contents of this motor and its submotor. Thank you', errorType: 'success'});
      break;
  }
});

// @route   POST motor/motorItemStage/:id
// @desc    Post stage by ID
// @access  Public
router.post('/motorItemStage/:id', async (req, res) => {
  const status = await methods.getCurrentStatus(client, req.params.id);
  const motordetails = await methods.createMotorDetails(client, req.params.id); 
  var fullUrl = req.protocol + '://' + req.get('host');
  if(status.status == 'notstarted'){

    try {
      const getFileDir = await methods.getFileDir(client)
      const iarFront_loc = getFileDir.dir + 'uploads/oncheckup/iarfront-'+req.params.id+'.jpg';
      const iarBack_loc = getFileDir.dir + 'uploads/oncheckup/iarback-'+req.params.id+'.jpg';
      const befimage_loc = getFileDir.dir+'uploads/oncheckup/beforeimage-'+req.params.id+'.jpg';

      //Save the records only when the file is succesfully uploaded
      var inputObj = await stages.createOncheckupObj(req.body, req.params.id)
      
      
      await methods.insertItem(client, 'oncheckup' ,inputObj, null, inputObj.tagID);
      await methods.updateStatus(client, 'oncheckup', inputObj.tagID)
      await methods.deleteDraft(client, inputObj.tagID, 'oncheckup')

      await client.db("caic-sample").collection('oncheckup')
      .updateOne({ tagID: parseInt(req.params.id) },
                  { $push: {files: {$each: [
                                            {name: 'iarfront_img', loc: iarFront_loc}, 
                                            {name: 'iarback_img', loc: iarBack_loc}, 
                                            {name: 'iarfront_pdf', loc: getFileDir.dir + 'pdfs/iar/iar-front-'+req.params.id+'.pdf'},
                                            {name: 'iarback_pdf', loc: getFileDir.dir + 'pdfs/iar/iar-back-'+req.params.id+'.pdf'},
                                            {name: 'bef_img', loc:getFileDir.dir + 'uploads/oncheckup/beforeimage-'+req.params.id+'.jpg' }
                                          ]}} });

      await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from Not Started to Oncheckup')

    }catch (error) {
      console.log(error)
    }
    
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing' || req.user.ROLE == 'warehouse')
    {
      let motorObjOncheckup = await methods.getSingleOnCheckup(client, inputObj.tagID, false); 
      res.render('innerpages/prelimdocs', {role: req.user.ROLE, fullUrl:fullUrl, currStage: 'prelimdocs', stage: 'On Checkup -> Prelim Docs', draft: null, pdfURL: '../../io/asset/'+inputObj.tagID, tagID: inputObj.tagID, motorObjOncheckup: motorObjOncheckup, motordetails: motordetails});
    }
    else
      return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'}) 
  
  }
  else if(status.status == 'oncheckup')
  {
    var oncheckup = await methods.getSingleOnCheckup(client, req.params.id, false);
    const inputObj = await stages.createPrelimDocsObj(req.body, oncheckup, req.params.id)
    const getFileDir = await methods.getFileDir(client)
    
    try 
    {
      await methods.updateItem(client, 'prelimdocs', inputObj);
      await methods.updateStatus(client, 'prelimdocs', req.params.id)
      await methods.deleteDraft(client, inputObj.tagID, 'prelimdocs')

      await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from Oncheckup to Prelimdocs')
      
      var prelimdocs = await methods.getSingle(client, 'prelimdocs', parseInt(req.params.id))
      var locs = []
      if(typeof prelimdocs.qNo == 'string') 
      {
        locs.push({name: 'qform_pdf', loc:getFileDir.dir + 'pdfs/qform/'+req.params.id+'.pdf' }) 
      }
      else if(typeof prelimdocs.qNo == 'object')
      {
        var scopes = ['stator', 'accessories', 'mechanical', 'dynamic', 'misc']
        for(var i=0; i<prelimdocs.qNo.length; i++) 
        {
          locs.push({name: 'qform_pdf_'+i, loc:getFileDir.dir + 'pdfs/subqform/'+ req.params.id+'-'+scopes[i]+'.pdf' }) 
        }
      }

      await client.db("caic-sample").collection('prelimdocs')
      .updateOne({ tagID: parseInt(req.params.id) },
                  { $set: {files: locs }
                });
      
    }
    catch(e)
    {
      console.log(e)
    }
    
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
      res.render('innerpages/onrewind', {oncheckup: oncheckup, fullUrl:fullUrl, currStage: 'onrewind', stage: 'Prelim Docs -> On Rewind', tagID: req.params.id, draft: null, motordetails: motordetails});
    else 
      return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'}) 
  }
  else if(status.status == 'prelimdocs')
  {
    const getFileDir = await methods.getFileDir(client)
    const inputObj = await stages.createOnRewindObj(req.body, req.params.id)
    var oncheckup = await methods.getSingleOnCheckup(client, req.params.id, false);
    inputObj.files.push({name: 'ris_pdf', loc: getFileDir.dir+'pdfs/ris/ris-'+req.params.id+'.pdf'})


    await methods.insertItem(client, 'onrewind' ,inputObj, null, parseInt(req.params.id));
    await methods.updateStatus(client, 'onrewind', req.params.id)
    await methods.deleteDraft(client, inputObj.tagID, 'onrewind') 

    await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from Prelimdocs to On Rewind')

    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
      res.render('innerpages/onfabrication', {oncheckup: oncheckup, fullUrl:fullUrl, currStage: 'onfabrication', stage: 'On Rewind -> On Fabrication', tagID: req.params.id, draft: null, motordetails: motordetails});
    else
      return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'}) 
  }
  else if(status.status == 'onrewind')
  {
    let oncheckup = await methods.getSingleOnCheckup(client, req.params.id); 
    var inputObj = await stages.createOnFabricationObj(req.body, req.params.id, oncheckup)
    
    if(await methods.getSingle(client, 'onfabrication', req.params.id) == null)
    {
      await methods.insertItem(client, 'onfabrication', inputObj, null, parseInt(req.params.id));
      await methods.updateStatus(client, 'onfabrication', req.params.id)
      await methods.deleteDraft(client, inputObj.tagID, 'onfabrication')
    }
    else 
    {
      await methods.updateItem(client, 'onfabrication', inputObj);
    }

    await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from On Rewind to On Fabrication')

    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
    {
      res.render('innerpages/inbaking', {oncheckup:oncheckup, fullUrl:fullUrl, currStage: 'inbaking', stage: 'On Fabrication -> In Baking', tagID: req.params.id, draft: null, motordetails: motordetails});
    }
    else
      return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'}) 
  }
  else if(status.status == 'onfabrication')
  {
    const getFileDir = await methods.getFileDir(client)
    var inputObj = await stages.createInBakingObj(req.body, req.params.id)
    let oncheckup = await methods.getSingleOnCheckup(client, req.params.id); 

    if(await methods.getSingle(client, 'inbaking', req.params.id) == null)
    {
      await methods.insertItem(client, 'inbaking', inputObj, null, parseInt(req.params.id));
      await methods.updateStatus(client, 'inbaking', req.params.id)
      await methods.deleteDraft(client, inputObj.tagID, 'inbaking')
    }
    else 
    {
      await methods.updateItem(client, 'inbaking', inputObj);
    }

    afterImage = req.files.afterimageselect;
    afterImage_loc = getFileDir.dir + 'uploads/inbaking/afterimage-'+req.params.id+'.jpg';
    
    afterImage.mv(afterImage_loc, async function(err) {
      if (err)
        return res.status(500).send(err);
    });

    await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from On Fabrication to In Baking')

    const supervisors = await client.db("caic-sample").collection("users").find({ROLE: 'supervisor'}).project({'_id': 0, 'name': 1});

    await client.db("caic-sample").collection('inbaking')
    .updateOne({ tagID: parseInt(req.params.id) },
                { $push: {files: {name: 'aft_img', loc: afterImage_loc}}});

    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
    {
      res.render('innerpages/assemblyandtesting', {oncheckup: oncheckup, fullUrl:fullUrl, currStage: 'assemblyandtesting', stage: 'In Baking -> Assembly and Testing', tagID: req.params.id, draft: null, motordetails: motordetails, supervisors: await supervisors.toArray() });
    }
    else
      return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'}) 
  }
  else if(status.status == 'inbaking')
  { 
    
    let oncheckup = await methods.getSingle(client, 'oncheckup', req.params.id);
    var inputObj = await stages.createAssemblyAndTestingObj(req.body, req.params.id, oncheckup)

    if(await methods.getSingle(client, 'assemblyandtesting', req.params.id) == null)
    {
      await methods.insertItem(client, 'assemblyandtesting', inputObj, null, parseInt(req.params.id));
      await methods.updateStatus(client, 'assemblyandtesting', req.params.id)
      await methods.deleteDraft(client, inputObj.tagID, 'assemblyandtesting')
    }
    else 
    {
      await methods.updateItem(client, 'assemblyandtesting', inputObj);
    }
    
    const getFileDir = await methods.getFileDir(client)
    var uploadedMtr = req.files.uploadedMtr;
    var uploadedMtr_loc = getFileDir.dir+'uploads/assemblyandtesting/uploaded-mtr-'+req.params.id+'.jpg';
    uploadedMtr.mv(uploadedMtr_loc, async function(err) {
      if (err)
        return res.status(500).send(err);
    });  

    await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from On In Baking to Assembly and Testing')

    var locs = [
      {name: 'mtr_img', loc: uploadedMtr_loc},
      {name: 'mtr_pdf', loc: getFileDir.dir+'pdfs/mtr/mtr-'+req.params.id+'.pdf'}
    ]
    await client.db("caic-sample").collection('assemblyandtesting')
    .updateOne({ tagID: parseInt(req.params.id) },
                { $set: {files: locs}});

    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor')
    {
      res.render('innerpages/painting', {oncheckup: oncheckup, fullUrl:fullUrl, currStage: 'painting', stage: 'Assembly and Testing -> Painting', tagID: req.params.id, draft: null, motordetails: motordetails});
    }
    else
      return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'}) 
  }
  else if(status.status == 'assemblyandtesting')
  {
    var inputObj = await stages.createPaintingObj(req.body, req.params.id)
    var notstarted = await methods.getSingle(client, 'motors', req.params.id)
    const supervisors = await client.db("caic-sample").collection("users").find({ROLE: 'supervisor'}).project({'_id': 0, 'name': 1});
    var fordelivery_user = await methods.getUsers(client, ['admin', 'salesRep'])
    let oncheckup = await methods.getSingleOnCheckup(client, req.params.id, false); 

    if(await methods.getSingle(client, 'painting', req.params.id) == null)
    {
      await methods.insertItem(client, 'painting', inputObj, null, parseInt(req.params.id));
      await methods.updateStatus(client, 'painting', req.params.id)
      await methods.deleteDraft(client, inputObj.tagID, 'painting')
    }
    else 
    {
      await methods.updateItem(client, 'painting', inputObj);
    }

    await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from On Assembly and Testing to Painting')

    if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing' || req.user.ROLE == 'warehouse')
    {
      //If motor parent
      if(notstarted.submotor.isSubmotor == false)
      { 
        //If it is, does it have a submotor/child?
        if(notstarted.submotor.child != null)
        {
          //Get the stage of child
          var currstage = await methods.getItemStage(client, notstarted.submotor.child)
          //Check stage if child is on painting stage
          if(currstage[0].status == 'painting')
          {
            //If stage is painting, then as is
            res.render('innerpages/fordelivery', {oncheckup:oncheckup, fordelivery_user: fordelivery_user, fullUrl:fullUrl, currStage: 'fordelivery', supervisors: await supervisors.toArray(), stage: 'Painting -> For Delivery', tagID: req.params.id, draft: null, disableGenerate: false, child: null});
          }
          else {
              //If not, send a variable to UI to disable the Button that generates DR.
              res.render('innerpages/fordelivery', {oncheckup:oncheckup, fordelivery_user:fordelivery_user, fullUrl:fullUrl, currStage: 'fordelivery', supervisors: await supervisors.toArray(), stage: 'Painting -> For Delivery', tagID: req.params.id, draft: null, disableGenerate: true, child: notstarted.submotor.child});
          }
          
        }
        else {
          //Normal motor without child
          res.render('innerpages/fordelivery', {oncheckup:oncheckup, fordelivery_user:fordelivery_user, fullUrl:fullUrl, currStage: 'fordelivery', supervisors: await supervisors.toArray(), stage: 'Painting -> For Delivery', tagID: req.params.id, draft: null, disableGenerate: false, child: null, motordetails: motordetails});
        }
        
      }
      else 
        res.render('errorpages/error', {title: "Restricted!", message: 'This is a Submotor. Delivery Receipt and Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + notstarted.submotor.parent, errorType: 'danger'});
    }
    else
      return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'}) 
  }
  else if(status.status == 'painting')
  {
    var inputObj = await stages.createForDeliveryObj(req.body, req.params.id)
    var notstarted = await methods.getSingle(client, 'motors', req.params.id)
    var company = await methods.getCompany(client, notstarted.company_id)
    let oncheckup = await methods.getSingleOnCheckup(client, req.params.id, false); 

    var childObj = null

    //Update the mother motor
    await methods.insertItem(client, 'fordelivery', inputObj, null, parseInt(req.params.id));
    await methods.updateStatus(client, 'fordelivery', req.params.id)
    await methods.deleteDraft(client, inputObj.tagID, 'fordelivery')

    const getFileDir = await methods.getFileDir(client)

    var uploadedPO = req.files.uploadedPO;
    var uploadedPO_loc = getFileDir.dir+'uploads/fordelivery/po-'+req.params.id+'.jpg';
    var uploadedDR = req.files.uploadedDR;
    var uploadedDR_loc = getFileDir.dir+'uploads/fordelivery/dr-'+req.params.id+'.jpg';

    uploadedPO.mv(uploadedPO_loc, async function(err) {
      if (err)
        return res.status(500).send(err);
    });      

    uploadedDR.mv(uploadedDR_loc, async function(err) {
      if (err)
        return res.status(500).send(err);
    });

    var locs = [
      {name: 'dr_pdf', loc: getFileDir.dir+'pdfs/dr/dr-'+req.params.id+'.pdf'},
      {name: 'po_img', loc: getFileDir.dir+'uploads/fordelivery/po-'+req.params.id+'.jpg'},
      {name: 'dr_img', loc: getFileDir.dir+'uploads/fordelivery/dr-'+req.params.id+'.jpg'}
    ]

    await client.db("caic-sample").collection('fordelivery')
    .updateOne({ tagID: parseInt(req.params.id) },
                { $set: {files: locs}});

    //Update the submotor if there's any
    var notstarted = await methods.getSingle(client, 'motors', req.params.id)
    if(notstarted.submotor.child != null)
    {
      var childObj = await stages.createForDeliveryObj(req.body, notstarted.submotor.child)
      await methods.insertItem(client, 'fordelivery', childObj, null, notstarted.submotor.child);
      await methods.updateStatus(client, 'fordelivery', notstarted.submotor.child)
      var uploadedPO_loc = getFileDir.dir+'uploads/fordelivery/po-'+notstarted.submotor.child+'.jpg';
      var uploadedDR_loc = getFileDir.dir+'uploads/fordelivery/dr-'+notstarted.submotor.child+'.jpg';

      uploadedPO.mv(uploadedPO_loc, async function(err) {
        if (err)
          return res.status(500).send(err);
      });      
  
      uploadedDR.mv(uploadedDR_loc, async function(err) {
        if (err)
          return res.status(500).send(err);
      });

      var locs2 = [
        {name: 'dr_pdf', loc: getFileDir.dir+'pdfs/dr/dr-'+notstarted.submotor.child+'.pdf'},
        {name: 'po_img', loc: getFileDir.dir+'uploads/forderlivery/po-'+notstarted.submotor.child+'.jpg'},
        {name: 'dr_img', loc: getFileDir.dir+'uploads/fordelivery/dr-'+notstarted.submotor.child+'.jpg'}
      ]

      await client.db("caic-sample").collection('fordelivery')
      .updateOne({ tagID: notstarted.submotor.child },
                  { $set: {files: locs2}});

    }

    await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from Painting to For Delivery')

    if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing')
    {
      res.render('innerpages/forbillingstatement', {oncheckup: oncheckup, fullUrl:fullUrl, currStage: 'forbillingstatement', company: {compname: company.compname, address: company.street + ', ' + company.brgy + ', ' + company.city + ', ' + company.state}, stage: 'For Delivery -> For Billing Statement', tagID: req.params.id, draft: null, motordetails: motordetails});
    }
    else 
      return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'}) 
  }
  else if(status.status == 'fordelivery')
  {
    const notstarted = await methods.getSingle(client, 'motors', req.params.id)
    var company = await methods.getCompany(client, notstarted.company_id)
    var inputObj = await stages.createForBillingStatement(req.body, req.params.id, company)
    let oncheckup = await methods.getSingleOnCheckup(client, req.params.id, false); 

    if(req.body.compname != '') inputObj.compname = req.body.compname
    if(req.body.compaddress != '') inputObj.compaddress = req.body.compaddress

    await methods.insertItem(client, 'forbillingstatement', inputObj, null, parseInt(req.params.id));
    await methods.updateStatus(client, 'forbillingstatement', req.params.id)
    await methods.deleteDraft(client, inputObj.tagID, 'forbillingstatement')
    
    const getFileDir = await methods.getFileDir(client)
    var uploadedSI = req.files.uploadedSI;
    var uploadedSI_loc = getFileDir.dir+'uploads/forbillingstatement/si-'+req.params.id+'.jpg';

    uploadedSI.mv(uploadedSI_loc, async function(err) {
      if (err)
        return res.status(500).send(err);
    });

    var locs = [
      {name: 'si_pdf', loc: getFileDir.dir+'pdfs/si/si-'+req.params.id+'.pdf'},
      {name: 'si_img', loc: uploadedSI_loc}
    ]

    await client.db("caic-sample").collection('forbillingstatement')
    .updateOne({ tagID: parseInt(req.params.id) },
                { $set: {files: locs}});

    if(notstarted.submotor.child != null)
    { 
      var childObj = await stages.createForBillingStatement(req.body, notstarted.submotor.child, company)
      await methods.insertItem(client, 'forbillingstatement', childObj, null, notstarted.submotor.child);
      await methods.updateStatus(client, 'forbillingstatement', notstarted.submotor.child)

      var uploadedSI2 = req.files.uploadedSI;
      var uploadedSI_loc2 = getFileDir.dir+'uploads/forbillingstatement/si-'+notstarted.submotor.child+'.jpg';
      uploadedSI2.mv(uploadedSI_loc2, async function(err) {
        if (err)
          return res.status(500).send(err);
      });

      var locs = [
        {name: 'si_pdf', loc: getFileDir.dir+'pdfs/si/dr-'+notstarted.submotor.child+'.pdf'},
        {name: 'si_img', loc: uploadedSI_loc2}
      ]

      await client.db("caic-sample").collection('forbillingstatement')
      .updateOne({ tagID: notstarted.submotor.child},
                  { $set: {files: locs}});
    }  
    
    await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from For Delivery to For Billing Statement')
    
    res.render('innerpages/foror', {oncheckup:oncheckup, fullUrl:fullUrl, currStage: 'foror', stage: 'For Billing Statement -> For OR', tagID: req.params.id, draft: null, motordetails: motordetails});
  }
  else if(status.status == 'forbillingstatement')
  {
    var inputObj = await stages.createForOr(req.body, req.params.id)
    let oncheckup = await methods.getSingleOnCheckup(client, req.params.id, false); 

    await methods.insertItem(client, 'foror', inputObj, null, parseInt(req.params.id));
    await methods.updateStatus(client, 'foror', req.params.id)
    await methods.deleteDraft(client, inputObj.tagID, 'foror')

    const getFileDir = await methods.getFileDir(client)
    var uploadedOR = req.files.uploadedOR;
    var uploadedOR_loc = getFileDir.dir+'uploads/foror/or-'+req.params.id+'.jpg';

    uploadedOR.mv(uploadedOR_loc, async function(err) {
      if (err)
        return res.status(500).send(err);
    });

    await client.db("caic-sample").collection('foror')
    .updateOne({ tagID: parseInt(req.params.id) },
                { $push: {files: {name: 'uploadedOR', loc: uploadedOR_loc}}});

    var notstarted = await methods.getSingle(client, 'motors', req.params.id)

    if(notstarted.submotor.child != null)
    { 
      var childObj = await stages.createForOr(req.body, notstarted.submotor.child)
      await methods.insertItem(client, 'foror', childObj, null, notstarted.submotor.child);
      await methods.updateStatus(client, 'foror', notstarted.submotor.child)

      await client.db("caic-sample").collection('foror')
      .updateOne({ tagID: notstarted.submotor.child},
                  { $push: {files: {name: 'uploadedOR', loc: uploadedOR_loc}}});
    }  

    await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from  For Billing Statement to For OR')
    
    res.render('innerpages/completed', {oncheckup:oncheckup, fullUrl:fullUrl, currStage: 'completed', stage: 'FOR OR -> Completed!', tagID: req.params.id, draft: null, motordetails: motordetails});
  }
  else if(status.status == 'foror')
  {
    var inputObj = await stages.createCompletedObj(req.body, req.params.id)

    await methods.insertItem(client, 'completed', inputObj, null, parseInt(req.params.id));
    await methods.updateStatus(client, 'completed', req.params.id)
    await methods.deleteDraft(client, inputObj.tagID, 'completed')

    var notstarted = await methods.getSingle(client, 'motors', req.params.id)
    if(notstarted.submotor.child != null)
    { 
      var childObj = await stages.createCompletedObj(req.body, notstarted.submotor.child)
      await methods.insertItem(client, 'completed', childObj, null, notstarted.submotor.child);
      await methods.updateStatus(client, 'completed', notstarted.submotor.child)
    }  

    await methods.addNotif(client, req.user, 'Transferred an item with TagID: '+ req.params.id + ' from  For OR to Completed')
    
    res.render('errorpages/error', {title: "Yey!", message: 'Great job! You can always go back to the Edit page to check the contents of this motor', errorType: 'success'});
  }
}) 


// @route   GET motor/motorItem/:tagid
// @desc    Get a single motor item
// @access  Public

router.get('/motorItem/:scope/:tagID',  async (req, res) => {
  var fullUrl = req.protocol + '://'   + req.get('host');
  var isAllowed = false
  const motordetails = await methods.createMotorDetails(client, req.params.tagID);
  var notifs = await methods.getNotifs(client, 5, 0)
  var notifctr = notifs.length;
  
  if(req.params.scope == 'notstarted')
  {
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'salesRep' || req.user.ROLE == 'marketing') isAllowed = true

    const motorobject = await methods.getSingle(client, 'motors', req.params.tagID);
    const company = await methods.getCompany(client, motorobject.company_id, {projection:{compname: 1}})
    
    const oncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);
    if(motorobject)
      res.render('innerpages/mod_notstarted', {company: company, oncheckup:oncheckup, notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_oncheckup', tagID:  req.params.tagID, motorobj: motorobject, url: fullUrl, user: req.user, stage: 'Not Started', motordetails: motordetails});
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }else if(req.params.scope == 'oncheckup')
  {
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor' || req.user.ROLE == 'warehouse') isAllowed = true
 
    let motorObj = await methods.getSingle(client, 'motors', req.params.tagID); 
    const oncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);

    if(oncheckup)
      res.render('innerpages/mod_oncheckup', {notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_oncheckup', tagID:  req.params.tagID, user: req.user, url: fullUrl, files: oncheckup.files, motorobj: motorObj, oncheckup: oncheckup, stage: 'On Checkup' , motordetails: motordetails});
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }else if(req.params.scope == 'prelimdocs')
  {
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing' || req.user.ROLE == 'warehouse') isAllowed = true

    const prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID);
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);
    
    if(prelimdocs)
      res.render('innerpages/mod_prelimdocs', {role: req.user.ROLE, notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_prelimdocs',  motordetails: motordetails, user: req.user, pdfURL: prelimdocs.files, tagID: req.params.tagID, motorObjOncheckup: motorObjOncheckup, prelimdocs: prelimdocs, stage: 'Prelim Documents', url: fullUrl, title: "Restricted!", message: 'Oops. You can\'t go here yet. Please finish filling out Prelimdocs stage', errorType: 'danger'});
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }
  else if(req.params.scope == 'onrewind')
  {
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor') isAllowed = true
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);

    const onrewind = await methods.getSingle(client, 'onrewind', req.params.tagID);
    if(onrewind)
      res.render('innerpages/mod_onrewind', {oncheckup: motorObjOncheckup, notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_onrewind', motordetails: motordetails, user: req.user, tagID: req.params.tagID, onrewind: onrewind, stage: 'On Rewind', url: fullUrl});
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  } 
  else if(req.params.scope == 'onfabrication')
  {
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor') isAllowed = true
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);

    const onfabrication = await methods.getSingle(client, 'onfabrication', req.params.tagID);
    if(onfabrication)
      res.render('innerpages/mod_onfabrication', {oncheckup: motorObjOncheckup, notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_onfabrication', motordetails: motordetails, user: req.user, tagID: req.params.tagID, onfabrication: onfabrication, stage: 'On Fabrication', url: fullUrl});
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }
  else if(req.params.scope == 'inbaking')
  {
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);

    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor') isAllowed = true

    const inbaking = await methods.getSingle(client, 'inbaking', req.params.tagID);
    if(inbaking)
      res.render('innerpages/mod_inbaking', {oncheckup:motorObjOncheckup, notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_inbaking', motordetails: motordetails, tagID: req.params.tagID, inbaking: inbaking, stage: 'In Baking', url: fullUrl, user: req.user  });
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }
  else if(req.params.scope == 'assemblyandtesting')
  {
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor') isAllowed = true

    const assemblyandtesting = await methods.getSingle(client, 'assemblyandtesting', req.params.tagID);
    const supervisors = await client.db("caic-sample").collection("users").find({ROLE: 'supervisor'}).project({'_id': 0, 'name': 1});
    
    if(assemblyandtesting)
      res.render('innerpages/mod_assemblyandtesting', {oncheckup:motorObjOncheckup, notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_assemblyandtesting', supervisors: await supervisors.toArray(), motordetails:motordetails, tagID: req.params.tagID, assemblyandtesting: assemblyandtesting, stage: 'Assembly and Testing', url: fullUrl, user: req.user});
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }
  else if(req.params.scope == 'painting')
  {
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor') isAllowed = true

    const painting = await methods.getSingle(client, 'painting', req.params.tagID);
    if(painting)
      res.render('innerpages/mod_painting', {oncheckup:motorObjOncheckup, notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_painting', motordetails:motordetails, tagID: req.params.tagID, painting: painting, stage: 'Painting', url: fullUrl, user: req.user});
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }
  else if(req.params.scope == 'fordelivery')
  {
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing' || req.user.ROLE == 'warehouse') isAllowed = true

    const fordelivery = await methods.getSingle(client, 'fordelivery', req.params.tagID);
    const notstarted = await methods.getSingle(client, 'motors', req.params.tagID)
    const prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID)
    var company = await methods.getCompany(client, notstarted.company_id)
    var fordelivery_user = await methods.getUsers(client, ['admin', 'salesRep'])
    
    if(fordelivery)
    {
      var parent = null 
      if(notstarted.submotor.isSubmotor == true)
        parent = notstarted.submotor.parent
      res.render('innerpages/mod_fordelivery', {oncheckup: motorObjOncheckup,  fordelivery_user:fordelivery_user, notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_fordelivery', motordetails:motordetails, prelimdocs: prelimdocs, tagID: req.params.tagID, fordelivery: fordelivery, stage: 'For Delivery', url: fullUrl, user: req.user, parent: parent, isSubmotor: notstarted.submotor.isSubmotor, title: "Restricted!", message: 'This is a Submotor. Delivery Receipt and Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + notstarted.submotor.parent, errorType: 'danger'});
    } 
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }
  else if(req.params.scope == 'forbillingstatement')
  {
    if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing') isAllowed = true

    const forbillingstatement = await methods.getSingle(client, 'forbillingstatement', req.params.tagID);
    const notstarted = await methods.getSingle(client, 'motors', req.params.tagID)
    const prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID)
    var company = await methods.getCompany(client, notstarted.company_id)
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);
    if(forbillingstatement)
    {
      var parent = null 
      if(notstarted.submotor.isSubmotor == true)
        parent = notstarted.submotor.parent
      res.render('innerpages/mod_forbillingstatement', {oncheckup:motorObjOncheckup, notifications: notifs, notifctr: notifctr,username: req.user.username, isAllowed: isAllowed, currStage: 'mod_forbillingstatement', company: {compname: company.compname, address: company.street + ', ' + company.brgy + ', ' + company.city + ', ' + company.state}, motordetails:motordetails, prelimdocs: prelimdocs, tagID: req.params.tagID, forbillingstatement: forbillingstatement, stage: 'For Billing Statement', url: fullUrl, user: req.user, parent: parent, isSubmotor: notstarted.submotor.isSubmotor, title: "Restricted!", message: 'This is a Submotor. Delivery Receipt and Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + notstarted.submotor.parent, errorType: 'danger'});
    }
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }
  else if(req.params.scope == 'foror')
  {
    const foror = await methods.getSingle(client, 'foror', req.params.tagID);
    const notstarted = await methods.getSingle(client, 'motors', req.params.tagID)
    const prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID)
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);

    if(foror)
    {
      var parent = null 
      if(notstarted.submotor.isSubmotor == true)
        parent = notstarted.submotor.parent
      res.render('innerpages/mod_foror', {oncheckup:motorObjOncheckup, notifications: notifs, notifctr: notifctr,username: req.user.username, currStage: 'mod_foror', motordetails:motordetails, prelimdocs: prelimdocs, tagID: req.params.tagID, foror: foror, stage: 'For OR', url: fullUrl, user: req.user, parent: parent, isSubmotor: notstarted.submotor.isSubmotor, title: "Restricted!", message: 'This is a Submotor. Delivery Receipt and Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + notstarted.submotor.parent, errorType: 'danger'});
    }
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }
  else if(req.params.scope == 'completed')
  {
    const completed = await methods.getSingle(client, 'completed', req.params.tagID);
    const summaryObj = await methods.createSummary(client, req.params.tagID)
    let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, false);

    if(completed)
    {
      var parent = null 
      if(summaryObj.notstarted[0].submotor.isSubmotor == true)
        parent = summaryObj.notstarted[0].submotor.parent
      res.render('innerpages/mod_completed', {oncheckup: motorObjOncheckup,  notifications: notifs, notifctr: notifctr,username: req.user.username, currStage: 'mod_completed', summaryObj: summaryObj, tagID: req.params.tagID, completed: completed, stage: 'Completed', url: fullUrl, user: req.user, parent: parent, isSubmotor: summaryObj.notstarted[0].submotor.isSubmotor, title: "Restricted!", message: 'This is a Submotor. Delivery Receipt and Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + summaryObj.notstarted[0].submotor.parent, errorType: 'danger'});
    }
    else 
      res.render('errorpages/error404', {id: req.params.tagID});
  }
  res.end()
});

// @route   POST motor/motorItem/:tagid
// @desc    update a single motor item
// @access  Public

router.post('/motorItem/:scope/:tagID',  async (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host');
  const motordetails = await methods.createMotorDetails(client, req.params.tagID);
  const rpmhpobj = await methods.getSingleOnCheckup(client, req.params.tagID, false);

  if(req.params.scope == 'notstarted')
  {
    const motorobject = await methods.getSingle(client, 'motors', req.params.tagID);
    const company = await methods.getSingleCompany(client, req.body.company)
    
    var inputObj = await stages.createMotorObj(req.body, company)
    inputObj.status = motorobject.status

    inputObj.tagID = parseInt(req.params.tagID)
    try{
      //Relpace Document
      methods.replaceDocument(client,'motors',req.params.tagID, inputObj)
      await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in Not Started')
      res.render('innerpages/mod_notstarted', {company:company, oncheckup: rpmhpobj, isAllowed: true, currStage: 'mod_notstarted', motordetails:motordetails, tagID:  req.params.tagID, motorobj: inputObj, url: fullUrl, user: req.user, stage: 'Not Started'});
    }catch(e){
      console.log(e)
    }
  } 
  else if(req.params.scope == 'oncheckup')
  { 
    var inputObj = await stages.createOncheckupObj(req.body, req.params.tagID)
    const OldOncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);

    inputObj.files.push({name: 'iarfront_img', loc: OldOncheckup.files[0].loc})
    inputObj.files.push({name: 'iarback_img', loc: OldOncheckup.files[1].loc})
    inputObj.files.push({name: 'iarfront_pdf', loc: OldOncheckup.files[2].loc})
    inputObj.files.push({name: 'iarback_pdf', loc:  OldOncheckup.files[3].loc})
    inputObj.files.push({name: 'bef_img', loc: OldOncheckup.files[4].loc})

    try{
      //Relpace Document
      await methods.replaceDocument(client,'oncheckup',req.params.tagID, inputObj)
      await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in On Checkup')
      let motorObj = await methods.getSingle(client, 'motors', req.params.tagID); 
      const oncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);
      if(oncheckup)
      res.render('innerpages/mod_oncheckup', {isAllowed: true, currStage: 'mod_oncheckup', motordetails:motordetails, tagID:  req.params.tagID, user: req.user, url: fullUrl,pdfURL: '../../io/asset/iar/front/'+req.params.tagID, pdfURL2: '../../io/asset/iar/back/'+req.params.tagID, motorobj: motorObj, oncheckup: inputObj, stage: 'On Checkup' });
      else 
        res.render('errorpages/error404', {id: req.params.tagID});

    }catch(e){
      console.log(e)
    }
  }else if(req.params.scope == 'prelimdocs')
  {

    const prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID);
    
    var oncheckup = await methods.getSingleOnCheckup(client, req.params.tagID);    
    var inputObj = await stages.createPrelimDocsObj(req.body, oncheckup, req.params.tagID)
    inputObj.isComplete = true
    var currDate = new Date();

    if(prelimdocs.qformPref == 'whole')
    {
      inputObj.tagID = parseInt(req.params.tagID)
      inputObj.qformPref = prelimdocs.qformPref,
      inputObj.qNo = 'R'+currDate.getFullYear().toString().substr(-2) + '-' + req.params.tagID + '/' + (currDate.getMonth()+1) + '-' + currDate.getDate()
      inputObj.files.push({name: 'qform_pdf', loc:prelimdocs.files[0].loc }) 
    }else
    {
      var qNoList = [];
      for(var i = 0; i < 5; i++)
      {
        qNoList.push('R'+currDate.getFullYear().toString().substr(-2) + '-' + req.params.tagID + '-' + (i+1) + '/' + (currDate.getMonth()+1) + '-' + currDate.getDate());
      }

      inputObj.tagID = parseInt(req.params.tagID)
      inputObj.qformPref = prelimdocs.qformPref, 
      inputObj.qNo = qNoList

      var scopes = ['stator', 'accessories', 'mechanical', 'dynamic', 'misc']
        for(var i=1; i<prelimdocs.qNo.length+1; i++) 
        {
          inputObj.files.push({name: 'qform_pdf_'+i, loc:prelimdocs.files[i].loc }) 
        }
    }

    
    try{
      methods.replaceDocument(client,'prelimdocs',req.params.tagID, inputObj)
      await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in Prelimdocs')
      let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagID, true); 
      

      if(prelimdocs)
        res.render('innerpages/mod_prelimdocs', {oncheckup: rpmhpobj, role: req.user.ROLE, isAllowed: true, currStage: 'mod_prelimdocs', motordetails:motordetails, user: req.user, pdfURL: '../../io/asset/'+req.params.tagID, tagID: req.params.tagID, motorObjOncheckup: motorObjOncheckup, prelimdocs: inputObj, stage: 'Prelim Documents', url: fullUrl});
      else 
        res.render('errorpages/error404', {id: req.params.tagID});

    }catch(e){
      console.log(e)
    } 
  }
  else if(req.params.scope == 'onrewind')
  {
      const oldOnrewind = await methods.getSingle(client, 'onrewind', parseInt(req.params.tagID))
      var inputObj = await stages.createOnRewindObj(req.body, req.params.tagID)
      inputObj.files.push({name: 'ris_pdf', loc: oldOnrewind.files[0].loc})
      
      try{
        methods.replaceDocument(client,'onrewind',req.params.tagID, inputObj)
        await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in On Rewind')
        res.render('innerpages/mod_onrewind', {oncheckup: rpmhpobj, isAllowed: true, currStage: 'mod_onrewind', motordetails:motordetails, user: req.user, tagID: req.params.tagID, onrewind: inputObj, stage: 'On Rewind', url: fullUrl});
      }catch(e){
        console.log(e)
      }
  }
  else if(req.params.scope == 'onfabrication')
  {
      let oncheckup = await methods.getSingleOnCheckup(client, req.params.tagID); 
      var inputObj = await stages.createOnFabricationObj(req.body, req.params.tagID, oncheckup)
      try{
        methods.replaceDocument(client,'onfabrication',req.params.tagID, inputObj)
        await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in On Fabrication')
        res.render('innerpages/mod_onfabrication', {oncheckup: rpmhpobj, isAllowed: true, currStage: 'mod_onfabrication', motordetails:motordetails, user: req.user, tagID: req.params.tagID, onfabrication: inputObj, stage: 'On Fabrication', url: fullUrl});
      }catch(e){  
        console.log(e)
      }
  } else if(req.params.scope == 'inbaking')
  {
      const Oldinbaking = await methods.getSingle(client, 'inbaking', req.params.tagID);
      var inputObj = await stages.createInBakingObj(req.body, req.params.tagID)
      
      try{
        // console.log(req.files)
        if(req.files)
        { 
          afterImage = req.files.afterimageselect;
          afterImage_loc = Oldinbaking.files[0].loc;
          
          afterImage.mv(afterImage_loc, async function(err) {
            if (err)
              return res.status(500).send(err);
          });
        }
        else 
        {
          inputObj.files.push({name: 'aft_img', loc: Oldinbaking.files[0].loc})
        }

        methods.replaceDocument(client,'inbaking',req.params.tagID, inputObj)
        await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in In Baking')
        
        await client.db("caic-sample").collection('inbaking')
          .updateOne({ tagID: parseInt(req.params.tagID) },
                      { $push: {files: {name: 'aft_img', loc: Oldinbaking.files[0].loc}}});
        
        res.render('innerpages/mod_inbaking', {oncheckup: rpmhpobj, isAllowed: true, currStage: 'mod_inbaking', motordetails:motordetails, tagID: req.params.tagID, inbaking: inputObj, stage: 'In Baking', url: fullUrl, user: req.user});

      }catch(e){  
        console.log(e)
      }
  }
  else if(req.params.scope == 'assemblyandtesting')
  {
    const assemblyandtesting = await methods.getSingle(client, 'assemblyandtesting', req.params.tagID);
    let oncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);
    var inputObj = await stages.createAssemblyAndTestingObj(req.body, req.params.tagID, oncheckup)
    const supervisors = await client.db("caic-sample").collection("users").find({ROLE: 'supervisor'}).project({'_id': 0, 'name': 1});
    try{
      methods.replaceDocument(client,'assemblyandtesting',req.params.tagID, inputObj)
      await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in Assembly and Testing')
      res.render('innerpages/mod_assemblyandtesting', {oncheckup: rpmhpobj, isAllowed: true, currStage: 'mod_assemblyandtesting', supervisors: await supervisors.toArray(), motordetails:motordetails, tagID: req.params.tagID, assemblyandtesting: inputObj, stage: 'Assembly and Testing', url: fullUrl, user: req.user});
      
      if(req.files){
        var uploadedMtr = req.files.uploadedMtr;
        var uploadedMtr_loc = assemblyandtesting.files[0].loc;
        uploadedMtr.mv(uploadedMtr_loc, async function(err) {
          if (err)
            return res.status(500).send(err);
        });  

        var locs = [
          {name: 'mtr_img', loc: uploadedMtr_loc},
          {name: 'mtr_pdf', loc: assemblyandtesting.files[1].loc}
        ] 
      }
      else {

        var locs = [
          {name: 'mtr_img', loc: assemblyandtesting.files[0].loc},
          {name: 'mtr_pdf', loc: assemblyandtesting.files[1].loc}
        ]
      }

      await client.db("caic-sample").collection('assemblyandtesting')
          .updateOne({ tagID: parseInt(req.params.tagID) },
                      { $set: {files: locs}});
    
    }catch(e){  
      console.log(e)
    }
  }
  else if(req.params.scope == 'painting')
  {
      var inputObj = await stages.createPaintingObj(req.body, req.params.tagID)

      try{
        methods.replaceDocument(client,'painting',req.params.tagID, inputObj)
        await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in Painting')
        res.render('innerpages/mod_painting', {oncheckup:rpmhpobj, isAllowed: true, currStage: 'mod_painting', motordetails:motordetails, tagID: req.params.tagID, painting: inputObj, stage: 'Painting', url: fullUrl, user: req.user});
      }catch(e){  
        console.log(e)
      }
  }
  else if(req.params.scope == 'fordelivery')
  {
      const fordelivery = await methods.getSingle(client, 'fordelivery', req.params.tagID)
      const prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID)
      const notstarted = await methods.getSingle(client, 'motors', req.params.tagID)
      var inputObj = await stages.createForDeliveryObj(req.body, req.params.tagID)
      var fordelivery_user = await methods.getUsers(client, ['admin', 'salesRep'])
      try{
        var parent = null 
        if(notstarted.submotor.isSubmotor == true)
          parent = notstarted.submotor.parent
        methods.replaceDocument(client,'fordelivery',req.params.tagID, inputObj)
        await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in For Delivery')
        const getFileDir = await methods.getFileDir(client)


        var dr_pdf_loc = fordelivery.files[0].loc
        var po_loc = fordelivery.files[1].loc
        var dr_loc = fordelivery.files[2].loc

        var locs = [
          {name: 'dr_pdf', loc: dr_pdf_loc},
          {name: 'po_img', loc: po_loc},
          {name: 'dr_img', loc: dr_loc}
        ]

        await client.db("caic-sample").collection('fordelivery')
        .updateOne({ tagID: parseInt(req.params.tagID) },
                    { $set: {files: locs}});
        
        
        if(req.files)
        {
          if(fordelivery.files)
          {
            
            var uploadedPO = req.files.uploadedPO;
            var uploadedDR = req.files.uploadedDR;

            uploadedPO.mv(po_loc, async function(err) {
              if (err)
                return res.status(500).send(err);
            });  
        
            uploadedDR.mv(dr_loc, async function(err) {
              if (err)
                return res.status(500).send(err);
            });

            
          }
        }
        
        
      }catch(e){  
        console.log(e)
      }

      res.render('innerpages/mod_fordelivery', {oncheckup: rpmhpobj, fordelivery_user:fordelivery_user, isAllowed: true, currStage: 'mod_fordelivery', motordetails:motordetails, prelimdocs: prelimdocs, tagID: req.params.tagID, fordelivery: inputObj, stage: 'For Delivery', url: fullUrl, user: req.user, parent: parent, isSubmotor: notstarted.submotor.isSubmotor, title: "Restricted!", message: 'This is a Submotor. Delivery Receipt and Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + notstarted.submotor.parent, errorType: 'danger'});
  }
  else if(req.params.scope == 'forbillingstatement')
  {
      const forbillingstatement = await methods.getSingle(client, 'forbillingstatement', req.params.tagID)
      const prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID)
      const notstarted = await methods.getSingle(client, 'motors', req.params.tagID)
      var company = await methods.getCompany(client, notstarted.company_id)
      var inputObj = await stages.createForBillingStatement(req.body, req.params.tagID, company) 
    
      try{
        var parent = null 
        if(notstarted.submotor.isSubmotor == true)
          parent = notstarted.submotor.parent
        methods.replaceDocument(client,'forbillingstatement',req.params.tagID, inputObj)
        await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in For Billing Statement')
        res.render('innerpages/mod_forbillingstatement', {oncheckup:rpmhpobj, isAllowed: true, currStage: 'mod_forbillingstatement', company: {compname: company.compname, address: company.street + ', ' + company.brgy + ', ' + company.city + ', ' + company.state}, motordetails:motordetails, prelimdocs: prelimdocs, tagID: req.params.tagID, forbillingstatement: inputObj, stage: 'For Billing Statement', url: fullUrl, user: req.user, parent: parent, isSubmotor: notstarted.submotor.isSubmotor, title: "Restricted!", message: 'This is a Submotor. Delivery Receipt and Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + notstarted.submotor.parent, errorType: 'danger'});
      }catch(e){  
        console.log(e)
      }

      if(req.files)
      {
        var uploadedSI = req.files.uploadedSI;
        var uploadedSI_loc = forbillingstatement.files[1].loc;
  
        uploadedSI.mv(uploadedSI_loc, async function(err) {
          if (err)
            return res.status(500).send(err);
        });

        var locs = [
          {name: 'si_pdf', loc: forbillingstatement.files[0].loc},
          {name: 'si_img', loc: uploadedSI_loc}
        ]
        
        await client.db("caic-sample").collection('forbillingstatement')
          .updateOne({ tagID: parseInt(req.params.tagID) },
                      { $set: {files: locs}});
      }
      else {
        var locs = [
          {name: 'si_pdf', loc: forbillingstatement.files[0].loc},
          {name: 'si_img', loc: forbillingstatement.files[1].loc}
        ]
        
        await client.db("caic-sample").collection('forbillingstatement')
          .updateOne({ tagID: parseInt(req.params.tagID) },
                      { $set: {files: locs}});
      }
  }
  else if(req.params.scope == 'foror')
  {
      const foror = await methods.getSingle(client, 'foror', req.params.tagID)
      const notstarted = await methods.getSingle(client, 'motors', req.params.tagID)
      const prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID)
      var inputObj = await stages.createForOr(req.body, req.params.tagID) 
    
      try{
        var parent = null 
        if(notstarted.submotor.isSubmotor == true)
          parent = notstarted.submotor.parent
        methods.replaceDocument(client,'foror',req.params.tagID, inputObj)
        await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in For OR')
        res.render('innerpages/mod_foror', {oncheckup:rpmhpobj,  isAllowed: true, currStage: 'mod_foror', motordetails:motordetails, prelimdocs: prelimdocs, tagID: req.params.tagID, foror: inputObj, stage: 'For Billing Statement', url: fullUrl, user: req.user, parent: parent, isSubmotor: notstarted.submotor.isSubmotor, title: "Restricted!", message: 'This is a Submotor. Delivery Receipt and Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + notstarted.submotor.parent, errorType: 'danger'});
      }catch(e){  
        console.log(e)
      }

      if(req.files)
      {
        var uploadedOR = req.files.uploadedOR;
        var uploadedOR_loc = foror.files[0].loc;
  
        uploadedOR.mv(uploadedOR_loc, async function(err) {
          if (err)
            return res.status(500).send(err);
        });
        
        await client.db("caic-sample").collection('foror')
          .updateOne({ tagID: parseInt(req.params.tagID) },
                      { $push: {files: {name: 'uploadedOR', loc: uploadedOR_loc}}});
      } 
      else {
        await client.db("caic-sample").collection('foror')
          .updateOne({ tagID: parseInt(req.params.tagID) },
                      { $push: {files: {name: foror.files[0].name, loc: foror.files[0].loc}}});
      }
  }
  else if(req.params.scope == 'completed')
  {
      const completed = await methods.getSingle(client, 'completed', req.params.tagID)
      var inputObj = await stages.createCompletedObj(req.body, req.params.tagID) 
      const summaryObj = await methods.createSummary(client, req.params.tagID)

      try{

        var parent = null 
        if(summaryObj.notstarted[0].submotor.isSubmotor == true)
          parent = summaryObj.notstarted[0].submotor.parent
        methods.replaceDocument(client,'completed',req.params.tagID, inputObj)
        await methods.addNotif(client, req.user, 'Edited motor item with TagID: '+ req.params.tagID + ' in Completed')
        
        res.render('innerpages/mod_completed', {oncheckup:rpmhpobj, currStage: 'mod_completed', summaryObj: summaryObj, tagID: req.params.tagID, completed: inputObj, stage: 'Completed', url: fullUrl, user: req.user, parent: parent, isSubmotor: summaryObj.notstarted[0].submotor.isSubmotor, title: "Restricted!", message: 'This is a Submotor. Delivery Receipt and Sales Invoice can only be accomplished via the MOTHER Motor. Please go to motor with TAGID: ' + summaryObj.notstarted[0].submotor.parent, errorType: 'danger'});
      }catch(e){  
        console.log(e)
      }
  }
});

//Save 
router.post('/save/:stage/:tagID',  async (req, res) => {
  var inputObj = {}
  var isDraft = await methods.getDraft(client, req.params.stage, req.params.tagID);

  if(req.params.stage == 'oncheckup') {
    var inputObj = await stages.createOncheckupObj(req.body, req.params.tagID)
    if(isDraft != null)
      inputObj.draft_file = isDraft[0].draft_file;
  }
  else if(req.params.stage == 'prelimdocs') {
    const oncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);
    var inputObj = await stages.createPrelimDocsObj(req.body, oncheckup, req.params.tagID)
  }
  else if(req.params.stage == 'onrewind'){
    var inputObj = await stages.createOnRewindObj(req.body, req.params.tagID)
  }
  else if(req.params.stage == 'onfabrication'){
    const oncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);
    var inputObj = await stages.createOnFabricationObj(req.body, req.params.tagID, oncheckup)
  }
  else if(req.params.stage == 'inbaking'){
    var inputObj = await stages.createInBakingObj(req.body, req.params.tagID)
  }
  else if(req.params.stage == 'assemblyandtesting'){
    let oncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);
    var inputObj = await stages.createAssemblyAndTestingObj(req.body, req.params.tagID, oncheckup)
  }
  else if(req.params.stage == 'painting'){
    var inputObj = await stages.createPaintingObj(req.body, req.params.tagID)
  }
  else if(req.params.stage == 'fordelivery'){
    var inputObj = await stages.createForDeliveryObj(req.body, req.params.tagID)
  }
  else if(req.params.stage == 'forbillingstatement') {
    const notstarted = await methods.getSingle(client, 'motors', req.params.tagID)
    var company = await methods.getCompany(client, notstarted.company_id)
    var inputObj = await stages.createForBillingStatement(req.body, req.params.tagID, company)
    if(req.body.compname != '') inputObj.compname = req.body.compname
    if(req.body.compaddress != '') inputObj.compaddress = req.body.compaddress
  }
  else if(req.params.stage == 'foror'){
    var inputObj = await stages.createForOr(req.body, req.params.tagID)
  }
  else if(req.params.stage == 'completed'){
    var inputObj = await stages.createCompletedObj(req.body, req.params.tagID)
  }

  await methods.saveDraft(client, inputObj, req.params.stage)
  res.send(200)
})

//Save files
router.post('/save_file/:stage/:tagID',  async (req, res) => {
  var isDraft = await methods.getDraft(client, req.params.stage, req.params.tagID);

  if(isDraft == null)
  {
    var inputObj = {}
    inputObj.tagID = parseInt(req.params.tagID);
    inputObj.stage = req.params.stage;
    inputObj.draft_file = [req.body.filename];
    await methods.saveDraft(client, inputObj, req.params.stage)
  }
  else 
  {
    //Check if draf_file already exists 
    var draft_files = isDraft[0].draft_file;
    if(draft_files.length > 0) 
    {
      //Look if the file is already existing, push if true
      if(draft_files.indexOf(req.body.filename) == -1)
      {
        isDraft[0].draft_file.push(req.body.filename);
        await methods.saveDraft(client, isDraft[0], req.params.stage)
      }
    } 
  }
  
  res.sendStatus(200);
})

//Get files
router.get('/save_file/:stage/:tagID',  async (req, res) => {
  res.send(await methods.getDraft(client, req.params.stage, req.params.tagID));
})

// @route   GET motor/hpTable/:hpval
// @desc    Get the record for a specific hp
// @access  Public
router.get('/kwTable/:hpval', async function (req, res) {
  var convertedKwtoHp = parseFloat(req.params.hpval) * 1.341;
  
  var hp = await methods.getHP(client, convertedKwtoHp)
  
  if(hp) {
    res.send(hp)
  }
})


// @route   GET motor/hpTable/:hpval
// @desc    Get the record for a specific hp
// @access  Public
router.get('/kwTable2/:hpval', async function (req, res) {
  var convertedKwtoHp = parseFloat(req.params.hpval) * 1.341;

  var hp = await methods.getHP2(client, convertedKwtoHp)
  if(hp) {
    res.send(hp)
  }
})


// @route   GET motor/hpTable/:hpval
// @desc    Get the record for a specific hp
// @access  Public
router.get('/hpTable/:hpval', async function (req, res) {
  var hp = await methods.getHP(client, req.params.hpval)
  if(hp) {
    res.send(hp)
  }
})

// @route   GET motor/hpTable/:hpval
// @desc    Get the record for a specific hp
// @access  Public
router.get('/hpTable2/:hpval', async function (req, res) {
  var hp = await methods.getHP2(client, req.params.hpval)
  if(hp) {
    res.send(hp)
  }
})


// @route   GET motor/priceList
// @desc    Get the table
// @access  Public
router.get('/priceList', async function (req, res) {
  res.send(await methods.getItemList(client));
})

router.get('/models', async function (req, res) {
  res.send(await methods.getModelNames(client));
})

// @route   GET motor/priceList/:itemname
// @desc    Get item price single
// @access  Public
router.get('/priceList/:itemname', async function (req, res) {
  res.send(await methods.getSingleItem(client, req.params.itemname));
})

// @route   GET motor/priceList/:itemname
// @desc    Get item price single
// @access  Public
router.get('/priceList/model/:model/:itemname', async function (req, res) {
  res.send(await methods.getSingleItemAndPrice(client, req.params.model, req.params.itemname));
})

// @route   GET motor/pricelist/:type
// @desc    Get prices and model types by type
// @access  Public
router.get('/priceList/model/:type', async function (req, res) {
  res.send(await methods.getItemsByModelType(client, req.params.type));
}) 

// @route   POST motor/:tagid/:qformPref 
// @desc    Add preferences
// @access  Public
router.post('/prelimdocs/:tagid/:qformPref', async function (req, res) {
  res.send(await methods.insertQformPref(client, req.params.tagid, req.params.qformPref));
})


 
// @route   GET motor/prelimdocs/:tagid/:qformPref
// @desc    Insert Quotation Format 
// @access  Public
router.get('/prelimdocs/:tagid/qformpref/', async function (req, res) {
  res.send(await methods.getQformPref(client, req.params.tagid, req.params.qformPref)); 
})


// @route   GET motor/tester
// @desc    Register a motor
// @access  Public
router.get('/test/:tagid/:qformPref', async function (req, res) {
  res.send(await methods.insertQformPref(client, req.params.tagid, req.params.qformPref));
})


// @route   GET motor/getcode
// @desc    Get passcode
// @access  Public
router.get('/passcode/:type', async function (req, res) {
 res.send(await methods.getPassCode(client, req.params.type));
})

router.get('/rewinder/:tagid', async function (req, res) {
  res.send(await methods.getRewinder(client, req.params.tagid));
})

// @route   GET motor/oncheckup/:tagid
// @desc    Get Oncheckup details
// @access  Public
router.get('/oncheckup/:tagid', async function (req, res) {
  let motorObjOncheckup = await methods.getSingleOnCheckup(client, req.params.tagid, false);
  res.send(motorObjOncheckup);
})

// @route   GET motor/oncheckup/:tagid
// @desc    Get Oncheckup details
// @access  Public
router.get('/list/:dbname/:itemname', async function (req, res) {
  let list = await methods.getList(client, req.params.dbname, req.params.itemname);
  res.send(list);
})

router.post('/delete/:stage/:tagID',  async (req, res) => {
  try {

    var stages = ['notstarted','oncheckup','prelimdocs','onrewind', 'onfabrication', 'inbaking', 'assemblyandtesting', 'painting', 'fordelivery', 'forbillingstatement', 'foror', 'completed'];
    var stage = ''
    if(req.params.stage == 'notstarted') stage = 'motors'
    else stage = req.params.stage
    
    for(var i=stages.indexOf(req.params.stage); i<stages.length; i++)
    { 
      if(stages[i] == 'notstarted')
        var getCurrStage = await methods.getSingle(client, 'motors', req.params.tagID)
      else 
        var getCurrStage = await methods.getSingle(client, stages[i], req.params.tagID)
      
      if(getCurrStage != null)
      {
        if(stages[i]  == 'notstarted')
        {
          const maxTagID = await methods.getMaxTagID(client)
          //If the tagID of the to-be-deleted motor equals the TAGID then readjust the sequence minus 1
          if(parseInt(req.params.tagID) == maxTagID[0].maxNumber)
          {
            await client.db("caic-sample").collection("sequence")
              .updateOne({ tagID: parseInt(req.params.tagID)+1 },
                          { $set: {tagID: parseInt(req.params.tagID)}});
          }

          await client.db('caic-sample').collection('motors').deleteOne( { tagID : parseInt(req.params.tagID)});
          await methods.addNotif(client, req.user, 'Deleted a motor item with tagID: '+req.params.tagID+' in motors')
        }
        else 
        {
          
          await client.db('caic-sample').collection(stages[i]).deleteOne( { tagID : parseInt(req.params.tagID)});
          await methods.addNotif(client, req.user, 'Deleted a motor item with tagID: '+req.params.tagID+' in '+stages[i])
        }
          
        console.log('Deleted: '+stages[i])
      } 
      else 
        break;
    }

    if(req.params.stage != 'notstarted')
    {
      try {
        await methods.updateStatus(client, stages[stages.indexOf(req.params.stage)-1], req.params.tagID,)
      } catch (error) {
        console.log(error)
      } 
    }

    res.send({stage: req.params.stage, tagID: req.params.tagID})
  } catch (e) {
      console.log(e)
  }
})

router.get('/tagID/all', async function (req, res) {
  const pipeline = [
    {
      '$match': {
        'submotor.isSubmotor':{
          '$eq': false
        },
        'submotor.child':{
          '$eq': null
        }
      }
    },
    {
      '$group': {
        '_id': '$tagID'
      }
    }

  ];

  const aggCursor = await client.db("caic-sample").collection("motors").aggregate(pipeline);
  const tagID_list = await aggCursor.toArray()
  res.send(tagID_list)
})

router.post('/textsearch', async function (req, res) {

  var result = null
  var field = req.body.searchfield
  var limit = parseInt(req.body.limit)
  var stage2 = req.body.stage
  var skipNo = 0
  var company_id = null
  if(req.body.company_id)
    company_id = req.body.company_id

  if(req.body.searchmode == 'keyword')
    result = await methods.searchMotorByKeyword(client, 'motors', {$text: {$search: field}}, {_id: 1, tagID: 1, datePulledOut: 1, status: 1, company: 1, company_id: 1, motorType: 1, power: 1, pmID: 1, remarks: 1, submotor:1 }, limit, skipNo, field, stage2, company_id)
  else if(req.body.searchmode == 'tagid')
    result = await methods.searchMotor(client, 'motors', parseInt(field), {_id: 1, tagID: 1, datePulledOut: 1, status: 1, company: 1, company_id: 1, motorType: 1, power: 1, pmID: 1, remarks: 1, submotor:1 }, limit, skipNo, field, stage2, company_id)
  else if(req.body.searchmode == null)
    result = await methods.searchMotor(client, 'motors', parseInt(field), {_id: 1, tagID: 1, datePulledOut: 1, status: 1, company: 1, company_id: 1, motorType: 1, power: 1, pmID: 1, remarks: 1, submotor:1 }, 10, 0, field, 'all', company_id)
  
  res.send(await result.toArray())
})

router.post('/textsearch/page/:no', async function (req, res) {
  
  var result = null
  var field = req.body.searchfield
  var limit = parseInt(req.body.limit)
  var skipNo = (parseInt(req.params.no)*limit)-limit
  var stage2 = req.body.stage
  var company_id = null
  if(req.body.company_id)
    company_id = req.body.company_id
  
  if(req.body.searchmode == 'keyword')
    result = await methods.searchMotorByKeyword(client, 'motors', {$text: {$search: field}}, {_id: 1, tagID: 1, datePulledOut: 1, status: 1, company: 1, company_id: 1, motorType: 1, power: 1, pmID: 1, remarks: 1, submotor:1 }, limit, skipNo, field, stage2, company_id)
  else if(req.body.searchmode == 'tagid')
    result = await methods.searchMotor(client, 'motors', parseInt(field), {_id: 1, tagID: 1, datePulledOut: 1, status: 1, company: 1, company_id: 1, motorType: 1, power: 1, pmID: 1, remarks: 1, submotor:1 }, limit, skipNo, field, stage2, company_id)
  
  res.send(await result.toArray())
})

router.post('/motors', async function (req, res) {
  var limit = 10
  var company_id = null
  if(req.body.limit)
    limit = parseInt(req.body.limit)
  
  if(req.body.company_id)
    company_id = req.body.company_id
  
  var stage2 = 'all'
  if(req.body.stage)
    stage2 = req.body.stage
  
  console.log(stage2)
  var skipNo = 0
  var result = await methods.getMotors(client, 'motors', {_id: 1, tagID: 1, datePulledOut: 1, status: 1, company: 1, company_id: 1, motorType: 1, power: 1, pmID: 1, remarks: 1, submotor:1 }, limit, skipNo, stage2, company_id)
  res.send(result)
})

router.post('/modelcoll', async function (req, res) {
  var modelname = req.body.modelname
  await methods.addModelColumn(client, modelname)
  res.sendStatus(200)
})

router.get('/motorHP/:tagID', async function (req, res) {
  var hp = await methods.getMotorHP(client, req.params.tagID)
  res.send(hp)
})

router.get('/export', async (req, res) => {
  var notifs = await methods.getNotifs(client, 5, 0)
  var notifctr = notifs.length;
  var fullUrl = req.protocol + '://' + req.get('host');

  res.render('innerpages/export', {notifications: notifs, notifctr:notifctr, statusStats: null, username: req.user.username, role: req.user.ROLE, fullUrl: fullUrl, statusStats: await methods.getStatusStats(client)})
})

router.get('/export/extract', async (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host');
  const dir = await methods.getFileDir(client)
  const fastcsv = require('fast-csv');
  var data = [{
      "id": 1,
      "name": "Adnan",
      "age": 29
  }, {
      "id": 2,
      "name": "Ali",
      "age": 31
  }, {
      "id": 3,
      "name": "Ahmad",
      "age": 33
  }];

  var ws = fs.createWriteStream(dir.dir+"export.csv");
  fastcsv
      .write(data, { headers: true })
      .on("finish", function() {
          
          res.send("<a href='"+fullUrl+"/io/downloadUploaded/export'>Export</a>");
      })
      .pipe(ws);

  // res.send(200)
})  

module.exports  = router;