const express = require('express');
const router = express.Router();
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

router.post('/asset/quotation/:filename', function(req, res){
  try {
    const doc = new PDFDocument({size: 'LEGAL', margins : { 
        top: 25, 
        bottom: 25,
        left: 25,
        right: 25
    },});

    pdfURL = 'public/pdfs/qform/'+ req.params.filename+'.pdf';

    doc.pipe(fs.createWriteStream(pdfURL));
    files.createQuotationPDF(fs, doc, pdfURL);

    res.sendStatus(200);

  } catch(err)
  {
    res.send(err);
  }
});


module.exports  = router;