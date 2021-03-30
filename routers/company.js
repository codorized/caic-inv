const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
var client = require('../db/config').client;
const { checkAuthenticated } = require('./../auth')
router.all('*', checkAuthenticated);

// @route   GET company/newCompany
// @desc    Create a new company
// @access  Public

router.get('/single/:action',  async (req, res) => {
    
    var fullUrl = req.protocol + '://'   + req.get('host');
    if(req.params.action == 'new')
    {
        if(req.user.ROLE == 'admin' || req.user.ROLE == 'marketing'){
            res.render('innerpages/newCompany', {company: null, url: fullUrl});
        }
        else 
            return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
    }
    else
    {
        var company = await methods.getCompany(client, req.params.action)
        
        if(company == null) company = {}
        res.render('innerpages/newCompany', {company: company, url: fullUrl});
    }
    
});

router.get('/single/search/motor/:id',  async (req, res) => {
    
    var fullUrl = req.protocol + '://'   + req.get('host');
    const items = await methods.getMotors(client, 'motors', {_id: 1, tagID: 1, datePulledOut: 1, status: 1, company: 1, company_id: 1, motorType: 1, power: 1, pmID: 1, remarks: 1, submotor:1 }, 10, 0, 'all', req.params.id)
    
    var company = await methods.getCompany(client, req.params.action)
    if(company == null) company = {}
    res.render('companyMotors', {items: items, company_id: req.params.id, url: fullUrl});

});

// @route   POST company/newCompany
// @desc    Create a new company
// @access  Public

router.post('/single/:action',  async (req, res) => {
    
    if(req.params.action == 'new')
    {
        var inputObj = {
            currdate: req.body.currdate,
            id:  Date.now().toString(),
            compname: req.body.compname,
            contact1: req.body.contact1,
            contact2: req.body.contact2,
            jobtitle: req.body.jobtitle,
            email: req.body.email,
            webpage: req.body.webpage,
            bphone: req.body.bphone,
            hphone: req.body.hphone,
            mphone: req.body.mphone,
            faxnumber: req.body.faxnumber,
            street: req.body.street,
            brgy: req.body.brgy,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            country: req.body.country,
            notes: req.body.notes,
        }
        await methods.insertCompany(client, inputObj);
        
        await methods.addNotif(client, req.user, 'Created a company item with ID: '+ inputObj.id)
        res.render('innerpages/newCompany', {company: null});
    }
    else {
        var company = await methods.getCompany(client, req.params.action)
        var inputObj = {
            currdate: company.currdate,
            id:  company.id,
            compname: req.body.compname,
            contact1: req.body.contact1,
            contact2: req.body.contact2,
            jobtitle: req.body.jobtitle,
            email: req.body.email,
            webpage: req.body.webpage,
            bphone: req.body.bphone,
            hphone: req.body.hphone,
            mphone: req.body.mphone,
            faxnumber: req.body.faxnumber,
            street: req.body.street,
            brgy: req.body.brgy,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            country: req.body.country,
            notes: req.body.notes,
        }
        await methods.insertCompany(client, inputObj);
        await methods.addNotif(client, req.user, 'Edited a company item with ID: '+ inputObj.id)
        
        res.render('innerpages/newCompany', {company: inputObj, url: fullUrl, company_id: inputObj.company_id});
    }
});

router.post('/single/delete/:id',  async (req, res) => {
    var deleted = await methods.deleteSingleCompany(client, req.params.id)
    await methods.addNotif(client, req.user, 'Deleted a company item with ID: '+ req.params.id)
    console.log('Number of items delete: '+deleted)
})

router.get('/singleItem/:id',  async (req, res) => {
    
    var company = await methods.getCompany(client, req.params.id, {projection: {compname: 1}})
    res.send(company)
})





module.exports  = router;