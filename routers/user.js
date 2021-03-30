const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
var client = require('../db/config').client;
const bcrypt = require('bcrypt')
const { checkAuthenticated } = require('./../auth')
router.all('*', checkAuthenticated);

// @route   GET company/newCompany
// @desc    Create a new company
// @access  Public

router.get('/single/:action',  async (req, res) => {
    if(req.params.action == 'new')
    {
        res.render('innerpages/newUser', {user: null});
    }
    else
    {
        
        var user = await methods.getUser(client, req.params.action)
        if(user == null) user ={}
        res.render('innerpages/newUser', {user: user});
    }
    
});

// @route   POST company/newUser
// @desc    Create a new user
// @access  Public

router.post('/single/:action',  async (req, res) => {
    
    
        if(req.params.action == 'new')
        {
            try {
                var inputObj = {
                    id:  Date.now().toString(),
                    
                }
                await methods.insertUser(client, inputObj);
                await methods.addNotif(client, req.user, 'Created a user item with ID: '+ inputObj.id)
                res.render('innerpages/newUser', {user: null});
            } catch (error) {
                if(error.code == 11000)
                {
                    console.log('ERROR: There is already an account with username: '+ error.keyValue.username)   
                    res.render('innerpages/newUser', {user: inputObj, error: {type: 'danger', title: 'Duplicate Error', desc: 'Please Try again. There is already a username of: '+ error.keyValue.username}});
                }
            }
        }
        else {
            try {
                var user = await methods.getUser(client, req.params.action)
                var inputObj = {
                    id: user.id,
                    username: req.body.username,
                    ROLE: req.body.role,
                    name: req.body.name,
                    position: req.body.position  
                }
                await methods.insertUser(client, inputObj);
                await methods.addNotif(client, req.user, 'Edited a user item with ID: '+ inputObj.id)
                res.render('innerpages/newUser', {user: inputObj, alert: {type: 'success', title: 'Editing User Success!', desc: ''}});
            } catch (error) {
                if(error.code == 11000)
                {
                    console.log('ERROR: There is already an account with username: '+ error.keyValue.username)   
                    res.render('innerpages/newUser', {user: inputObj, alert: {type: 'danger', title: 'Duplicate Error', desc: 'Please Try again. There is already a username of: '+ error.keyValue.username}});
                }
            }
        }    
    
    
});
 
router.post('/single/delete/:id',  async (req, res) => {
    var deleted = await methods.deleteSingleUser(client, req.params.id)
    await methods.addNotif(client, req.user, 'Deleted a user item with ID: '+ req.params.id)
    console.log('Number of items delete: '+deleted)
})

router.get('/changepassword',  async (req, res) => {
    res.render('innerpages/newPassword', {user: req.user, reload: false});
})

router.post('/changepassword',  async (req, res) => {
    if(await bcrypt.compare(req.body.oldpassword, req.user.password))
    {
        result = await client.db("caic-sample").collection('users')
            .updateOne({ id: req.user.id },{ $set: {password: await bcrypt.hash((req.body.newpassword).toString(), 10)}});

        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        res.render('innerpages/newPassword', {user: req.user, msg: 'Password Successfully Changed!', errorType: 'success', reload: true});
    }
    else 
        res.render('innerpages/newPassword', {user: req.user, msg: 'Incorrect Old Password! Please try again', errorType: 'danger', reload: false});
})


module.exports  = router;