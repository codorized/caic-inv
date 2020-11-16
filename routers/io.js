const express = require('express');
const router = express.Router();

var client = require('../db/config').client;
const methods = require('../db/methods');
const files = require('../db/files');
const fs = require('fs');
const PDFDocument = require('pdfkit');

router.get('/asset/:filename', function(req, res){
    var tempFile="public/pdfs/"+req.params.filename+".pdf";
    fs.readFile(tempFile, function (err,data){
      res.contentType("application/pdf");
      res.send(data);
    });
});

router.get('/asset/quotation/:filename', function(req, res){
  var tempFile="public/pdfs/qform/"+req.params.filename+".pdf";
  fs.readFile(tempFile, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
});

router.post('/asset/quotation/:filename', async function(req, res){
  try {
    const doc = new PDFDocument({size: 'LEGAL', margins : { 
        top: 25, 
        bottom: 25,
        left: 25,
        right: 25
    },});
    console.log(req.body);
    pdfURL = 'public/pdfs/qform/'+ req.params.filename+'.pdf';

    doc.pipe(fs.createWriteStream(pdfURL));
    let motordetails = await methods.getSingle(client, req.params.filename);
    let companydetails = await methods.getSingleCompany(client, motordetails.company)
    files.createQuotationPDF(fs, doc, pdfURL, req.body, motordetails, companydetails);

    res.sendStatus(200);

  } catch(err)
  {
    res.send(err);
  }
});


module.exports  = router;