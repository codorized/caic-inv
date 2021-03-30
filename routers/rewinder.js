const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
var client = require('../db/config').client;
const { checkAuthenticated } = require('./../auth')
router.all('*', checkAuthenticated);

router.get('/single/:action',  async (req, res) => {
    if(req.params.action == 'new'){
        if(req.user.ROLE == 'admin')
            res.render('innerpages/newRewinder', {rewinder: null});
        else
            return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
    }
    else if (req.params.action == 'all')
    {
        const rewinders = await methods.getRewinders(client)
        res.send(rewinders);
    }
    else 
    {
        var rewinder = await methods.getSingleRewinder(client, req.params.action)
        if(rewinder == null) rewinder ={}
        res.render('innerpages/newRewinder', {rewinder: rewinder});
    }
});

router.post('/single/:action',  async (req, res) => {
    var isAllowed = false 
  
    if(req.params.action == 'new'){
        var inputObj = {}
        inputObj.id = Date.now().toString();
        inputObj.rewindername = req.body.rewindername;
        inputObj.currdate = req.body.currdate;

        await methods.insertRewinder(client, inputObj);
        await methods.addNotif(client, req.user, 'Created a rewinder item with ID: '+ inputObj.id)
        res.render('innerpages/newRewinder', {rewinder: null}); 
    }
    else 
    {
        var inputObj = {}
        inputObj.id = req.params.action;
        inputObj.rewindername = req.body.rewindername;
        var rewinder = await methods.getSingleRewinder(client, req.params.action)
        inputObj.currdate = rewinder[0].currdate;
        
        var inputObjArray = [inputObj]
        await methods.insertRewinder(client, inputObj);
        await methods.addNotif(client, req.user, 'Edited a rewinder item with ID: '+ inputObj.id)
        res.render('innerpages/newRewinder', {rewinder: inputObjArray});
    }
});

router.post('/single/delete/:id',  async (req, res) => {
    var deleted = await methods.deleteSingleRewinder(client, req.params.id)
    await methods.addNotif(client, req.user, 'Deleted a rewinder item with ID: '+ req.params.id)
    console.log('Number of items delete: '+deleted)
})

module.exports  = router;