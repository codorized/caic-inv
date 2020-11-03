const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
var client = require('../db/config').client;

// @route   GET company/newCompany
// @desc    Create a new company
// @access  Public

router.get('/newCompany',  async (req, res) => {
    res.render('innerpages/newCompany', {});
});

// @route   POST company/newCompany
// @desc    Create a new company
// @access  Public

router.post('/newCompany',  async (req, res) => {
    console.log(req.body);

    var inputObj = {
        currdate: req.body.currdate,
        compid:  req.body.compid,
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
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country,
        notes: req.body.notes,
      }
    await methods.insertCompany(client, inputObj);

    res.render('innerpages/newCompany');
    // res.render('innerpages/newCompany', {});
});



module.exports  = router;