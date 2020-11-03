const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
const fs = require('fs');

router.get('/asset/:filename', function(req, res){
    var tempFile="public/pdfs/"+req.params.filename+".pdf";
    fs.readFile(tempFile, function (err,data){
      res.contentType("application/pdf");
      res.send(data);
    });
});

module.exports  = router;