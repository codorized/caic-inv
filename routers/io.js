const express = require('express');
const router = express.Router();

var client = require('../db/config').client;
const methods = require('../db/methods');
const files = require('../db/files');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const { checkAuthenticated } = require('./../auth')
router.all('*', checkAuthenticated)

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




router.post('/asset/onrewind/ris/:fileStatus/:tagID', async function(req, res){
  let motors = await methods.getSingle(client, 'motors', req.params.tagID);
  let companydetails = await methods.getCompany(client, motors.company_id);
  let prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID);
  try {
    function currencyFormat(num) {
      num = parseFloat(num)
      return 'P ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
     
    function chechValue(value)
    {
      if(value == '') return ''
      return parseFloat(value).toFixed(2)
    }

    function displayTable(body)
    {
      var obj = [
        [{ text:'ITEMS', margin: [0,4],  fontSize: 10 }, {text:'QTY RECD', fontSize: 10, margin: [0,4]}, {text:'QTY RET', fontSize: 10, margin: [0,4]} ,{text:'QTY USED', fontSize: 10, margin: [0,4]}, { text:'AMT', margin: [0,4], fontSize: 10}, ' ', {text:'QTY RECD', fontSize: 10,margin: [0,4]}, {text:'QTY RET', fontSize: 10,margin: [0,4]}, {text:'QTY USED', fontSize: 10,margin: [0,4]}, { text:'AMT', margin: [0,4], fontSize: 10}],
        [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center', margin: [0,3]}, {text: '', width: '90%', alignment: 'left', fontSize: 8, margin: [0,3]}]}, {text: '', fontSize: 10, margin:[]}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}, { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10, margin: [0,3],}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}],
        [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center', margin: [0,3]}, {text: '', width: '90%', alignment: 'left', fontSize: 8, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}, { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10, margin: [0,3],}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}],
          [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center', margin: [0,3]}, {text: '', width: '90%', alignment: 'left', fontSize: 8, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}, { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10, margin: [0,3],}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}],
          [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center', margin: [0,3]}, {text: '', width: '90%', alignment: 'left', fontSize: 8, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}, { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10, margin: [0,3],}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}],
          [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center', margin: [0,3]}, {text: '', width: '90%', alignment: 'left', fontSize: 8, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}, { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10, margin: [0,4],}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}],
          [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center', margin: [0,3]}, {text: '', width: '90%', alignment: 'left', fontSize: 8, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}, { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10, margin: [0,3],}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}],
          [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center', margin: [0,3]}, {text: '', width: '90%', alignment: 'left', fontSize: 8, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}, { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10, margin: [0,3],}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}],
          [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center', margin: [0,3]}, {text: '', width: '90%', alignment: 'left', fontSize: 8, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}, { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}],
          [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center', margin: [0,3]}, {text: '', width: '90%', alignment: 'left', fontSize: 8, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}, { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10, margin: [0,3]}]}, {text: '', fontSize: 10}, {text: '', fontSize: 10} ,{text: '', fontSize: 10}, {text: '', fontSize: 10}],
      ]
      
      if(body.checkitem)
      { 
        if(typeof body.checkitem == 'string')
        {
          for(var i=0; i<=4; i++)
          {
            
            if(i == 0) obj[1][0].columns[1].text =body[body.checkitem][0]
            else if(i > 0 && i <= 3) obj[1][i].text = chechValue(body[body.checkitem][i])
            //else obj[1][i].text = currencyFormat(body[body.checkitem][i])
          }
          
        }else 
        {
          
          var temp = 1; 
          for(var i=1; i<=body.checkitem.length; i++)
          {
            if(i <= 9) 
            {
              for(var j=0; j<=4; j++)
              {
                if(j == 0) obj[i][0].columns[1].text = body[body.checkitem[i-1]][0]
                else if(j > 0 && j <= 3) obj[i][j].text = chechValue(body[body.checkitem[i-1]][j])
                //else obj[i][j].text = currencyFormat(body[body.checkitem[i-1]][j])
                
                
              }
            }
            else {
              for(var j=0; j<=4; j++)
              {
                if(j == 0) obj[i%9][5].columns[1].text = body[body.checkitem[i-1]][0]
                else if(j > 0 && j <= 3) obj[i%9][j+5].text = chechValue(body[body.checkitem[i-1]][j])
                //else obj[i%9][j+5].text = currencyFormat(body[body.checkitem[i-1]][j])
              }
            }
          }
        }
      }
      return obj
    }
    var mydate = new Date();
    var month =mydate.getMonth() + 1
    var day = mydate.getDate()
    var year = mydate.getFullYear()
    var finaldate = month + '/' + day + '/' + year;

    const getFileDir = await methods.getFileDir(client)
    pdfURL = getFileDir.dir+'pdfs/ris/ris-'+req.params.tagID+'.pdf'

    var docDefinition = {
      pageSize: 'LETTER',
      pageMargins: 25,
      content: [
          {
            text:'CALAMBA ALLIED INDUSTRIAL CORPORATION',
            alignment: 'center',
            bold: true,
            fontSize: 13
                
            },
            {
            text:'MAIN OFFICE: CAIC BUILDING SAN CRISTOBAL, CALAMBA CITY, LAGUNA',
            alignment: 'center',
            fontSize: 8
          
          },
          {
            text:'TAG ID. ' + motors.tagID,
            margin: [400, -5, 0, 0],
            alignment: 'center',
            fontSize: 15,
            bold: true
        },
        {
            text:'REQUISITION AND ISSUANCE SLIP',
            margin: [0, 0],
            alignment: 'center',
            fontSize: 10
            
        },
        {
          columns: [
                {
                    text:'CUSTOMER: '+companydetails.compname,
                    margin: [0, 8],
                    alignment: 'left',
                    fontSize: 10,
                    width: '70%'
                },
                // {
                //     text:'J.O.\# ________________________',
                //     margin: [0, 8],
                //     alignment: 'left',
                //     fontSize: 10,
                //     width: '30%'
                    
                // },
            ],
        },
        {
            columns: [
                {
                    text:'ADDRESS: ' + companydetails.street+', '+ companydetails.city + ', ' + companydetails.zip,
                    margin: [0, -5],
                    alignment: 'left',
                    fontSize: 10,
                    width: '70%'
                },
                {
                    text:'DATE: '+finaldate,
                    margin: [0, -5],
                    alignment: 'left',
                    fontSize: 10,
                    width: '30%'
                    
                },
            ],
            margin: [0, 0, 0, 15]
        },
        {
            table: {
            widths: ['20%', 'auto', 'auto', 'auto', '*', '20%', 'auto', 'auto', 'auto', 'auto'],
            margin: [0, 5, 0, 15],
            body: displayTable(req.body)
            
          },
          alignment: 'center'
        },
        {
          stack: [
              {
                  columns: [
                      {
                      text:'REWINDER: ' + prelimdocs.rewindername,
                      alignment: 'left',
                      fontSize: 10,
                      width: '33%'
                      },
                      {
                          text:'APPROVED BY: __________________',
                        alignment: 'left',
                        fontSize: 10,
                        width: '33%'
                      },
                      ,
                      {
                          text:'ISSUED BY: ____________________',
                      alignment: 'left',
                      fontSize: 10,
                      width: '33%'
                      }
                  ]
                
                  
              }
          ],
          margin: [0, 10, 0, 0]
      }
      ],
      // footer: {
      //     stack: [
      //         {
      //             columns: [
      //                 {
      //                     text:'REWINDER: ' + prelimdocs.rewindername,
      //                 alignment: 'left',
      //                 fontSize: 10,
      //                 width: '33.33%'
      //                 },
      //                 {
      //                     text:'APPROVED BY: __________________',
      //                 alignment: 'left',
      //                 fontSize: 10,
      //                 width: '33.33%'
      //                 },
      //                 ,
      //                 {
      //                     text:'ISSUED BY: ____________________',
      //                 alignment: 'left',
      //                 fontSize: 10,
      //                 width: '33.33%'
      //                 }
      //             ]
                
                  
      //         }
      //     ],
      //     margin: [40,-5, 25, 25]
      // },
      defaultStyle: {
        font: 'Helvetica'
      }
    };
      
      var options = {
        // ...
      }
      
      var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
      pdfDoc.pipe(fs.createWriteStream(pdfURL));
      pdfDoc.end();
      res.send(pdfURL); 
   
  } catch(err)
  {
    console.log(err)
    res.send(err);
  }
});
 
router.get('/asset/onrewind/ris/:fileStatus/:tagID', async function(req, res){

  const getFileDir = await methods.getFileDir(client)
  
  var pdfURL = ''

  if(req.params.fileStatus == 'notexists')
  {
    pdfURL = getFileDir.dir + 'pdfs/ris/ris-'+req.params.tagID+'.pdf'
  }
  else if(req.params.fileStatus == 'exists'){
    const onrewind = await methods.getSingle(client, 'onrewind', parseInt(req.params.tagID))
    pdfURL = onrewind.files[0].loc
  }


  fs.readFile(pdfURL, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
})

router.post('/asset/assemblyandtesting/mtr/:fileStatus/:tagID', async function(req, res){
  let motors = await methods.getSingle(client, 'motors', req.params.tagID);
  let oncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);
  try {
    
    var mydate = new Date();
    var month =mydate.getMonth() + 1
    var day = mydate.getDate()
    var year = mydate.getFullYear() 
    var finaldate = month + '/' + day + '/' + year;
    var hp, kw

    function formalDate(inputdate){
      var now = new Date(inputdate); 
      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 1)).slice(-2);
      var finaldate = now.getFullYear()+"-"+(month)+"-"+(day) ;

      return finaldate
    }
    
    function checkPower(power) {
        if(power.split(' ')[1] == 'HP'){
          kw = 'N/A'
          hp = power.split(' ')[0]
        }
        else {
          hp = 'N/A'
          kw = power.split(' ')[0]
        }
    }

    checkPower(oncheckup.power)
    //MTR Data
    //BEFORE

    var befinsulationResult = {
      wielding: '',
      insulation: '',
      highpotential: '',
      surgetest: ''
    }

    var befctrs3 = {phase1: 0, phase2: 0};
    var befphase1list = ['', '', '']
    if(oncheckup.before.befphase1)
    {
      if (typeof oncheckup.before.befphase1 == 'string') {
        befctrs3.phase1 = 1
        if(oncheckup.before.befphase1 == 'coiltocoil') befphase1list[0] = 'x'
        if(oncheckup.before.befphase1 == 'opencoil') befphase1list[1] = 'x'
        if(oncheckup.before.befphase1 == 'arching') befphase1list[2] = 'x'
      }
      else if (typeof oncheckup.before.befphase1 == 'object') 
      {
        if(oncheckup.before.befphase1.length > 0) befctrs3.phase1 = 1
        for(var i=0; i<3; i++)
        {
          if(oncheckup.before.befphase1[i] == 'coiltocoil') befphase1list[0] = 'x'
          if(oncheckup.before.befphase1[i] == 'opencoil') befphase1list[1] = 'x'
          if(oncheckup.before.befphase1[i] == 'arching') befphase1list[2] = 'x'
        }
      }
    }

    if(oncheckup.before.befphase2)
    {
      befctrs3.phase2 = 1
    }

    if(oncheckup.before.befphase1 || oncheckup.before.befphase2)
    {
      var befphase2list = ''
      if(befctrs3.phase1 == 0 && befctrs3.phase2 == 1) 
      {
        befphase2list = 'x'
      }
    }


    var befinsulationVoltdependent = [{items: ['','']}, {items: ['','']}]
    var befhighpotential = [{items: ['', '', '']}, {items: ['', '', '']}]
    //Before Insulation Resistance Test (MEGA-OHMS)
    if(parseFloat(oncheckup.voltage) < 440)
    {
     
      if(oncheckup.before.befinsulation1 == '') befinsulationVoltdependent[0].items[0] = ''
      else befinsulationVoltdependent[0].items[0] = oncheckup.before.befinsulation1 + ' M ohm'
      befinsulationVoltdependent[1].items[0] = ''

      if(oncheckup.before.befinsulation2 == '') befinsulationVoltdependent[1].items[0] = ''
      else befinsulationVoltdependent[0].items[1] = oncheckup.before.befinsulation2 + ' M ohm'
      befinsulationVoltdependent[1].items[1] = ''
      
      for(var i=0; i<oncheckup.before.befhighpotential.length; i++)
        befhighpotential[0].items[i] = oncheckup.before.befhighpotential[i]
      
    }
    else if(parseFloat(oncheckup.voltage) >= 440)
    {
      if(oncheckup.before.befinsulation1 == '') befinsulationVoltdependent[1].items[0] = ''
      else befinsulationVoltdependent[1].items[0] = oncheckup.before.befinsulation1 + ' M ohm'
      befinsulationVoltdependent[0].items[0] = ''

      if(oncheckup.before.befinsulation2 == '') befinsulationVoltdependent[1].items[1] = ''
      else befinsulationVoltdependent[1].items[1] = oncheckup.before.befinsulation2 + ' M ohm'
      befinsulationVoltdependent[0].items[1] = ''

      for(var i=0; i<oncheckup.before.befhighpotential.length; i++)
        befhighpotential[1].items[i] = oncheckup.before.befhighpotential[i]
    }

    var befcheckrewindrecon = ['', '']
    if(oncheckup.before.befrewindrecon == 'rewind') {befcheckrewindrecon[0] = '-->'; befcheckrewindrecon[1] = ''}
    else if (oncheckup.before.befrewindrecon == 'recon') {befcheckrewindrecon[0] = ''; befcheckrewindrecon[1] = '-->'}


    var inputObj = {}
    //AFTER
    inputObj.afttestingwoload1 = req.body.afttestingwoload1
    inputObj.afttestingwoload2 = req.body.afttestingwoload2
    inputObj.afttestingwoload3 = req.body.afttestingwoload3

    inputObj.afttestingwload1 = req.body.afttestingwload1
    inputObj.afttestingwload2 = req.body.afttestingwload2
    inputObj.afttestingwload3 = req.body.afttestingwload3


    var aftinsulationResult = {
      wielding: '',
      insulation: '',
      highpotentioal: '',
      surgetest: ''
    }
    var afthighpotential = [{items: ['', '', '']}, {items: ['', '', '']}]
    var aftinsulationVoltdependent = [{items: ['','']}, {items: ['','']}]

    //After Winding Resistance Test
    inputObj.aftwinding = req.body.aftwinding
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
    inputObj.afthighpotential = req.body.afthighpotential

    //After Insulation Resistance Test (MEGA-OHMS)
    inputObj.aftinsulation1 = req.body.aftinsulation1
    inputObj.aftinsulation2 = req.body.aftinsulation2

    inputObj.aftpi = req.body.aftpi
    if(parseInt(oncheckup.voltage) < 440)
    {
     
      if(inputObj.aftinsulation1 == '') aftinsulationVoltdependent[0].items[0] = ''
      else aftinsulationVoltdependent[0].items[0] = inputObj.aftinsulation1 + ' M ohm'
      aftinsulationVoltdependent[1].items[0] = ''

      if(inputObj.aftinsulation2 == '') aftinsulationVoltdependent[0].items[1] = ''
      else aftinsulationVoltdependent[0].items[1] = inputObj.aftinsulation2 + ' M ohm'
      aftinsulationVoltdependent[1].items[1] = ''
      
      for(var i=0; i<req.body.afthighpotential.length; i++)
        afthighpotential[0].items[i] = inputObj.afthighpotential[i]
      

        if(inputObj.aftinsulation2 == '' && inputObj.aftinsulation1 == '')
          aftinsulationResult.insulation = ''
        else if(inputObj.aftinsulation2 == '')
        {
          if(parseFloat(inputObj.aftinsulation1) > 50 && parseFloat(inputObj.aftpi) >= 1) aftinsulationResult.insulation = 'PASSED'
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
      else aftinsulationVoltdependent[1].items[0] = inputObj.aftinsulation1 + ' M ohm'
      aftinsulationVoltdependent[0].items[0] = ''

      if(inputObj.aftinsulation2 == '') aftinsulationVoltdependent[1].items[1] = ''
      else aftinsulationVoltdependent[1].items[1] = inputObj.aftinsulation2 + ' M ohm'
      aftinsulationVoltdependent[0].items[1] = ''

      for(var i=0; i<req.body.afthighpotential.length; i++)
        afthighpotential[1].items[i] =  inputObj.afthighpotential[i]
      
      if(inputObj.aftinsulation2 == '' && inputObj.aftinsulation1 == '')
        aftinsulationResult.insulation = ''
      else if(inputObj.aftinsulation2 == '')
      {
        if(parseFloat(inputObj.aftinsulation1) > 100 && parseFloat(inputObj.aftpi) >= 1) aftinsulationResult.insulation = 'PASSED'
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

    //After Surge Test/Comparison Test 
    var aftctrs3 = {phase1: 0, phase2: 0};
    var aftphase1list = ['', '', '']
    if(req.body.aftphase1)
    {
      inputObj.aftphase1 = req.body.aftphase1
      if (typeof inputObj.aftphase1 == 'string') {
        aftctrs3.phase1 = 1
        if(req.body.aftphase1 == 'coiltocoil') aftphase1list[0] = 'x'
        if(req.body.aftphase1 == 'opencoil') aftphase1list[1] = 'x'
        if(req.body.aftphase1 == 'arching') aftphase1list[2] = 'x'
      }
      else if (typeof inputObj.aftphase1 == 'object') 
      {
        if(inputObj.aftphase1.length > 0) aftctrs3.phase1 = 1
        for(var i=0; i<3; i++)
        {
          if(req.body.aftphase1[i] == 'coiltocoil') aftphase1list[0] = 'x'
          if(req.body.aftphase1[i] == 'opencoil') aftphase1list[1] = 'x'
          if(req.body.aftphase1[i] == 'arching') aftphase1list[2] = 'x'
        }
      }
    }

    if(req.body.aftphase2)
    {
      inputObj.aftphase2 = req.body.aftphase2
      aftctrs3.phase2 = 1
    }
   
    if(req.body.aftphase1 || req.body.aftphase2)
    {
      var aftphase2list = ''
      if(aftctrs3.phase1 == 0 && aftctrs3.phase2 == 1) 
      {
        aftinsulationResult.surgetest = 'PASSED'
        aftphase2list = 'x'
      }
      else aftinsulationResult.surgetest = 'FAILED'
    }
    
    inputObj.aftnotes = req.body.aftnotes
    inputObj.aftremarks = req.body.aftremarks

    
    

    var docDefinition = {
      pageSize: 'FOLIO',
      pageMargins: 25,

    content: [
        {
            text:'CALAMBA ALLIED INDUSTRIAL CORPORATION',
          alignment: 'center',
          bold: true,
          fontSize: 13
              
          },
      {
          text:'MOTOR TEST REPORT',
          margin: [0, 5],
          alignment: 'center',
          fontSize: 10
          
      },
      {
          columns: [
              {
                  text:'______________________________________',
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7.5,
                  width: '70%'
              },
              {
                  text:'______________________________________',
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7.5,
                  width: '70%'
              }
          ],
          margin: [0, 0, 0, 0]
      },
      {
            text:'______________________________________',
          margin: [0, 0, 0, 8],
          alignment: 'left',
          fontSize: 7.5,
          width: '70%',
          
        
      },
      {
            text:'______________________________________',
          alignment: 'left',
          fontSize: 7.5,
          width: '70%',
          margin: [0, 0, 0, 15]
        
      },
      {
          text:'BRAND/NAME : ' + motors.motorType,
          alignment: 'left',
          fontSize: 9,
          width: '70%',
          margin: [0, 0, 0, 8],
          bold: true
        
      },
      {
        text:'TAG ID: ' + motors.tagID,
        alignment: 'left',
        fontSize: 9,
        width: '70%',
        margin: [0, 0, 0, 8],
        bold: true
      
      },
      {
          columns: [
              {
                  text:' H.P. ' + hp,
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7,
                  width: '12.5%'
                
              },
              {
                  text:' K.W. ' + kw,
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7,
                  width: '12.5%'
              },
              ,
              {
                  text:' AMP: '+ oncheckup.current,
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7,
                  width: '12.5%'
              },
              {
                  text:' RPM: ' + oncheckup.rpm,
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7,
                  width: '12.5%'
              },
              {
                  text:' VOLTS: ' + oncheckup.voltage,
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7,
                  width: '12.5%'
              },
              {
                  text:' PHASE: ' + oncheckup.phase,
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7,
                  width: '12.5%'
              },
              {
                  text:' HZ: ' + oncheckup.frequency,
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7,
                  width: '12.5%'
              },
              {
                  text:' SR# ________',
                  margin: [0, 8],
                  alignment: 'left',
                  fontSize: 7,
                  width: '12.5%'
              },
          ],
        
      },
      {
          table: {
          widths: ['3%', '9%', '8%', '15%', '8%', '11%', '11%', '11%', '9%', '10%', '5%'],
          margin: [0, 5, 0, 15],
          
          body: [
            [ {text:'A. BEFORE RECONDITION', colSpan: 5, alignment: 'left', bold: true, fontSize: 10}, {}, {}, {}, {}, {text:'DATE: ' + formalDate(oncheckup.before.startdate), colSpan: 6, alignment: 'left'}, {}, {}, {}, {}, {}],
            [ {text:'A1.', rowSpan: 2, alignment: 'left'}, {text:'WINDING RESISTANCE TEST (OHMS)', rowSpan: 2, colSpan:2,alignment: 'left'}, {}, {text: 'INSULATION RESISTANCE TEST (MEGA-OHMS)', colSpan: 4, alignment: 'center'}, {}, {}, {}, {},  {text: 'TESTING W/O LOAD (AMPS.)', rowSpan: 2}, {text: 'TESTING WITH LOAD (AMPS.)', rowSpan: 2, colSpan: 2}, {}],
            [ {}, {}, {}, {text: 'TIME'}, {text: 'T-G @500V', colSpan: 2},  {},  {text: 'T-G @1000V'},{text: 'T-G @2000V'}, {}, {}],
            [ {text: '', rowSpan: 3}, {text: 'T1-T2/Pri'}, {text: oncheckup.before.befwinding[0]}, {text: '30 SECONDS'}, {text: '', colSpan: 2}, {}, {text: ''}, {text: ''}, {text: 'L1'}, {text: 'L1', colSpan: 2},  {}],
            [ {}, {text: 'T1-T3/Sec'}, {text: oncheckup.before.befwinding[1]}, {text: '1 MINUTE'}, {text: befinsulationVoltdependent[0].items[0], colSpan: 2},{},  {text: befinsulationVoltdependent[1].items[0]}, {text: ''}, {text: 'L2'}, {text: 'L2', colSpan: 2},  {}],
            [ {}, {text: 'T2-T3'}, {text: oncheckup.before.befwinding[2]}, {text: '10 MINUTES'}, {text: befinsulationVoltdependent[0].items[1], colSpan: 2},{},  {text: befinsulationVoltdependent[1].items[1]}, {text: ''}, {text: 'L3'}, {text: 'L3', colSpan: 2}, {}],
              [ {text: '', rowSpan: 3}, {text: '',  border:[false,false,false,false]}, {text: '', border:[false,false,false,false]}, {text: 'Polarization Index'}, {text: oncheckup.before.befpi, colSpan: 2, alignment: 'center', colSpan: 3}, {},{text: ''},  {text: ''}, {text: 'L4'}, {text: 'L4', colSpan: 2},  {}],
            [ {}, {text: 'REMARKS',  border:[true,false,false,false]},{text: oncheckup.before.befinsulationResult.wielding, border:[false,false,false,false], bold: true}, {text: 'WINDING TEMP.'}, {text: 'C°', alignment: 'center', colSpan: 2}, {}, {text: 'ABM. TEMP.'}, {text: 'C°', alignment: 'center'}, {text: 'L5'}, {text: 'L5', colSpan: 2},  {}],
            [ {}, {text: '',  border:[false,false,false,true]}, {text: '', border:[false,false,false,true]}, {text: 'REMARKS:', border:[true,false,false,false]}, {text:oncheckup.before.befinsulationResult.insulation, border:[false,false,false,false], bold: true}, {text: '', border:[false,false,false,false]}, {text: '', border:[false,false,false,false]}, {text: '', border:[false,false,false,false]}, {text: 'L6'}, {text: 'L6',  colSpan: 2},  {}],
            
            [ {text:'A2.', rowSpan: 6, alignment: 'left'}, {text:'HIGH POTENTIAL TEST (MICRO-AMPS)', colSpan:3,alignment: 'center'}, {}, {}, {}, {}, {text: 'TESTING W/O LOAD (AMPS.)', colSpan: 5, alignment: 'center'}, {}, {text: '',rowSpan: 2},  {}, {}],
            [ {}, {}, {text: 'T-G@500V'}, {text: 'T-G@1000V',}, {text: 'T-G@1500V'}, {text: 'T-G@2000V'}, {text: ''}, {text: 'Pri. (Volts)'}, {text: 'Sec. (Volts)'},  {text: 'Pri. (Amps)' }, {text: 'Sec (Amps.)' }],
            [ {text: '', rowSpan: 3}, {text: 'T1'}, {text: befhighpotential[0].items[0]}, {text: befhighpotential[1].items[0]}, {text: ''}, {text: ''}, {text: 'L1'}, {text: '', fontSize: 8}, {}, {}, {}],
            [ {}, {text: 'T2'}, {text: befhighpotential[0].items[1]}, {text: befhighpotential[1].items[1]}, {text: '', }, {}, {text: 'L2'}, {text: ''},  {}, {}, {}],
            [ {}, {text: 'T3'}, {text: befhighpotential[0].items[2]}, {text: befhighpotential[1].items[2]}, {text: ''}, {}, {text: 'L3'}, {text: ''},  {}, {}, {}],
            [ {}, {text: 'REMARKS'},{text: oncheckup.before.befinsulationResult.highpotentioal, bold: true}, {text: '', colSpan: 2}, {}, {}, {}, {}, {}, {}, {}],
            [ {text: 'A3.'}, {text: 'SURGE TEST/COMPARISON TEST:', colSpan: 5},{}, {}, {}, {}, {text:'VOLTAGE INPUT: 1500', colSpan: 5}, {}, {}, {}, {}],
            
              
          ]
        },
        alignment: 'center',
        alignment: 'left',
        fontSize: 6,
      },
      {
        style: 'tableExample',
        
        table: {
            widths: ['60%', '40%'],
            
          body: [
            
            [
              [

                {
                    
                  table: {
                      
                      widths: ['13%', '13%', '13%', '*'],
                      
                    body: [
                        [ {text: 'PHASE',  colSpan: 3, border: [false, false, false, false]}, {}, {}, {text: '', border: [false, false, false, false]}],
                        [ {text: '1-2', border: [false, false, false, false]}, {text: '1-3', border: [false, false, false, false]}, {text: '2-3',  border: [false, false, false, false]}, {text:'', fontSize:7.5, alignment: 'left', border: [false, false, false, false]}],
                        [ {text: ' '}, {text: ' '}, {text: ' ', }, {text:'TURN TO TURN SHORT', alignment: 'left', border: [false, false, false, false]}],
                        [ {text: befphase1list[0]}, {text: befphase1list[0]}, {text: befphase1list[0]}, {text:'COIL TO COIL SHORT',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text: ' '}, {text: ' '}, {text: ' ',}, {text:'REVERSED COIL CONNECTION',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text: befphase1list[1]}, {text: befphase1list[1]}, {text: befphase1list[1] }, {text:'OPEN COIL CONNECTION',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text: befphase1list[2]}, {text: befphase1list[2]}, {text: befphase1list[2]}, {text:'ARCING BETWEEN THE WINDINGS OR PHASES', alignment: 'left', border: [false, false, false, false]}],
                        [ {text: '\nRemarks: ', border: [false, false, false, false]}, {text: '\n' + oncheckup.before.befinsulationResult.surgetest, border: [false, false, false, false], bold: true}, {text: ' ', border: [false, false, false, false]}, {text:'', alignment: 'left', border: [false, false, false, false]}],
                    ],
                  },
                  fontSize: 6,
                  alignment: 'center',
                  margin: [16, 0, 10, 10],
                },
                
              ],
              [
                {
                  table: {
                      
                      widths: ['13%', '13%', '13%', '*'],
                      border: [false, false, false, false],
                    body: [
                        [ {text: 'PHASE',  colSpan: 3, border: [false, false, false, false],}, {}, {}, {text: '', border: [false, false, false, false]}],
                        [ {text: '1-2', border: [false, false, false, false]}, {text: '1-3',border: [false, false, false, false]}, {text: '2-3',  border: [false, false, false, false]}, {text: '', border: [false, false, false, false]}],
                        [ {text: ' ' }, {text: ' '}, {text: ' '}, {text:'COMPLETE GROUND', alignment: 'left', border: [false, false, false, false]}],
                        [ {text: ' '}, {text: ' '}, {text: ' '}, {text:'PARTIAL GROUND',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text: ' '}, {text: ' '}, {text: ' '}, {text:'PHASE TO PHASE SHORT', alignment: 'left', border: [false, false, false, false]}],
                        [ {text: befphase2list}, {text: befphase2list}, {text: befphase2list}, {text:'GOOD WINDING',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text:'\n ' +befcheckrewindrecon[0]+ ' For Rewind',  alignment: 'left', border: [false, false, false, false], colSpan: 2}, {}, {text: ' ', border: [false, false, false, false]}, {text:'\n '+befcheckrewindrecon[1]+' For Recon',  alignment: 'left', border: [false, false, false, false]}],
                    ]
                  },
                  alignment: 'center',
                  margin: [20, 0, 10, 10],
                  fontSize: 6,
                  
                },
                
                
              ]
            ]
          ]
        },
      },
      {
        style: 'tableExample',
        table: {
          widths: ['30%', '70%'],
            border: [false , false, false, false],
            heights: [10, 10],
          
          body: [
            [{text:'RECOMMENDATION:', margin:[5,5,5,5]}, {fontSize: 8, margin: [5,5,5,5], text: oncheckup.before.befremarks}],
            [{text:'NOTE:', margin:[5,5,5,5]}, {fontSize: 8, margin: [5,5,5,5], text: oncheckup.before.befnotes}]
          ]
        
        },
        fontSize: 6,
      
      },
      {
          table: {
          widths: ['3%', '9%', '8%', '15%', '8%', '11%', '11%', '11%', '9%', '10%', '5%'],
          margin: [0, 5, 0, 15],
          body: [
            //[ {text:'Recommendation: ' + inputObj.befremarks, colSpan: 5, alignment: 'left'}, {}, {}, {}, {}, {text:'Notes: ' + inputObj.befnotes, colSpan: 6, alignment: 'left'}, {}, {}, {}, {}, {}],
            [ {text:'B. AFTER RECONDITION/REWINDING', colSpan: 5, alignment: 'left'}, {}, {}, {}, {}, {text:'DATE: ' + formalDate(Date.now()), colSpan: 6, alignment: 'left'}, {}, {}, {}, {}, {}],
            [ {text:'B1.', rowSpan: 2, alignment: 'left'}, {text:'WINDING RESISTANCE TEST (OHMS)', rowSpan: 2, colSpan:2,alignment: 'left'}, {}, {text: 'INSULATION RESISTANCE TEST (MEGA-OHMS)', colSpan: 4, alignment: 'center'}, {}, {}, {}, {},  {text: 'TESTING W/O LOAD (AMPS.)', rowSpan: 2}, {text: 'TESTING WITH LOAD (AMPS.)', rowSpan: 2, colSpan: 2}, {}],
            [ {}, {}, {}, {text: 'TIME'}, {text: 'T-G @500V', colSpan: 2},  {},  {text: 'T-G @1000V'},{text: 'T-G @2000V'}, {}, {}],
            [ {text: '', rowSpan: 3}, {text: 'T1-T2/Pri'}, {text: inputObj.aftwinding[0]}, {text: '30 SECONDS'}, {text: '', colSpan: 2}, {}, {text: ''}, {text: ''}, {text: 'L1 - '+inputObj.afttestingwoload1}, {text: 'L1 - ' + inputObj.afttestingwload1, colSpan: 2},  {}],
            [ {}, {text: 'T1-T3/Sec'}, {text: inputObj.aftwinding[1]}, {text: '1 MINUTE'}, {text: aftinsulationVoltdependent[0].items[0], colSpan: 2},{},  {text: aftinsulationVoltdependent[1].items[0]}, {text: ''}, {text: 'L2 - '+ inputObj.afttestingwoload2}, {text: 'L2 - ' + inputObj.afttestingwload2, colSpan: 2},  {}],
            [ {}, {text: 'T2-T3'}, {text: inputObj.aftwinding[2]}, {text: '10 MINUTES'}, {text: aftinsulationVoltdependent[0].items[1], colSpan: 2},{},  {text: aftinsulationVoltdependent[1].items[1]}, {text: ''}, {text: 'L3 - ' + inputObj.afttestingwoload3}, {text: 'L3 - ' + inputObj.afttestingwload3, colSpan: 2}, {}],
            [ {text: '', rowSpan: 3}, {text: '',  border:[false,false,false,false]}, {text: '', border:[false,false,false,false]}, {text: 'Polarization Index'}, {text: inputObj.aftpi, colSpan: 2, alignment: 'center', colSpan: 3}, {},{text: ''},  {text: ''}, {text: 'L4'}, {text: 'L4', colSpan: 2},  {}],
            [ {}, {text: 'REMARKS',  border:[true,false,false,false]},{text: aftinsulationResult.wielding, border:[false,false,false,false], bold: true}, {text: 'WINDING TEMP.'}, {text: 'C°', alignment: 'center', colSpan: 2}, {}, {text: 'ABM. TEMP.'}, {text: 'C°', alignment: 'center'}, {text: 'L5'}, {text: 'L5', colSpan: 2},  {}],
            [ {}, {text: '',  border:[false,false,false,true]}, {text: '', border:[false,false,false,true]}, {text: 'REMARKS:', border:[true,false,false,false]}, {text:aftinsulationResult.insulation, border:[false,false,false,false], bold: true}, {text: '', border:[false,false,false,false]}, {text: '', border:[false,false,false,false]}, {text: '', border:[false,false,false,false]}, {text: 'L6'}, {text: 'L6',  colSpan: 2},  {}],
            
            [ {text:'B2.', rowSpan: 6, alignment: 'left'}, {text:'HIGH POTENTIAL TEST (MICRO-AMPS)', colSpan:3,alignment: 'center'}, {}, {}, {}, {}, {text: 'TESTING W/O LOAD (AMPS.)', colSpan: 5, alignment: 'center'}, {}, {text: '',rowSpan: 2},  {}, {}],
            [ {}, {}, {text: 'T-G@500V'}, {text: 'T-G@1000V',}, {text: 'T-G@1500V'}, {text: 'T-G@2000V'}, {text: ''}, {text: 'Pri. (Volts)'}, {text: 'Sec. (Volts)'},  {text: 'Pri. (Amps)' }, {text: 'Sec (Amps.)' }],
            [ {text: '', rowSpan: 3}, {text: 'T1'}, {text: afthighpotential[0].items[0]}, {text: afthighpotential[1].items[0]}, {text: ''}, {text: ''}, {text: 'L1'}, {text: '', fontSize: 8}, {}, {}, {}],
            [ {}, {text: 'T2'}, {text: afthighpotential[0].items[1]}, {text: afthighpotential[1].items[1]}, {text: '', }, {}, {text: 'L2'}, {text: ''},  {}, {}, {}],
            [ {}, {text: 'T3'}, {text: afthighpotential[0].items[2]}, {text: afthighpotential[1].items[2]}, {text: ''}, {}, {text: 'L3'}, {text: ''},  {}, {}, {}],
            [ {}, {text: 'REMARKS'},{text: aftinsulationResult.highpotentioal, bold: true}, {text: '', colSpan: 2}, {}, {}, {}, {}, {}, {}, {}],
            [ {text: 'B3.'}, {text: 'SURGE TEST/COMPARISON TEST:', colSpan: 5},{}, {}, {}, {}, {text:'VOLTAGE INPUT: 1500', colSpan: 5}, {}, {}, {}, {}],
            
              
          ]
        },
        alignment: 'center',
        alignment: 'left',
        fontSize:6,
      },
      {
        style: 'tableExample',
        //layout: 'noBorders',
        table: {
            widths: ['60%', '40%'],
          body: [
            
            [
              [

                {
                    
                  table: {
                      
                      widths: ['13%', '13%', '13%', '*'],
                      
                    body: [
                        [ {text: 'PHASE',  colSpan: 3, border: [false, false, false, false]}, {}, {}, {text: '', border: [false, false, false, false]}],
                        [ {text: '1-2', border: [false, false, false, false]}, {text: '1-3', border: [false, false, false, false]}, {text: '2-3',  border: [false, false, false, false]}, {text:'', fontSize:7.5, alignment: 'left', border: [false, false, false, false]}],
                        [ {text: ' '}, {text: ' '}, {text: ' ', }, {text:'TURN TO TURN SHORT', alignment: 'left', border: [false, false, false, false]}],
                        [ {text: aftphase1list[0]}, {text: aftphase1list[0]}, {text: aftphase1list[0]}, {text:'COIL TO COIL SHORT',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text: ' '}, {text: ' '}, {text: ' ',}, {text:'REVERSED COIL CONNECTION',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text: aftphase1list[1]}, {text: aftphase1list[1]}, {text: aftphase1list[1] }, {text:'OPEN COIL CONNECTION',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text: aftphase1list[2]}, {text: aftphase1list[2]}, {text: aftphase1list[2]}, {text:'ARCING BETWEEN THE WINDINGS OR PHASES', alignment: 'left', border: [false, false, false, false]}],
                        [ {text: '\nRemarks: ', border: [false, false, false, false]}, {text: '\n' + aftinsulationResult.surgetest, border: [false, false, false, false], bold: true}, {text: ' ', border: [false, false, false, false]}, {text:'', alignment: 'left', border: [false, false, false, false]}],
                    ],
                  },
                  fontSize: 6,
                  alignment: 'center',
                  margin: [16, 0, 10, 10],
                },
                
              ],
              [
                {
                  table: {
                      
                      widths: ['13%', '13%', '13%', '*'],
                      border: [false, false, false, false],
                    body: [
                        [ {text: 'PHASE',  colSpan: 3, border: [false, false, false, false],}, {}, {}, {text: '', border: [false, false, false, false]}],
                        [ {text: '1-2', border: [false, false, false, false]}, {text: '1-3',border: [false, false, false, false]}, {text: '2-3',  border: [false, false, false, false]}, {text: '', border: [false, false, false, false]}],
                        [ {text: ' ' }, {text: ' '}, {text: ' '}, {text:'COMPLETE GROUND', alignment: 'left', border: [false, false, false, false]}],
                        [ {text: ' '}, {text: ' '}, {text: ' '}, {text:'PARTIAL GROUND',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text: ' '}, {text: ' '}, {text: ' '}, {text:'PHASE TO PHASE SHORT', alignment: 'left', border: [false, false, false, false]}],
                        [ {text: aftphase2list}, {text: aftphase2list}, {text: aftphase2list}, {text:'GOOD WINDING',  alignment: 'left', border: [false, false, false, false]}],
                        [ {text:'',  alignment: 'left', border: [false, false, false, false], colSpan: 2}, {}, {text: ' ', border: [false, false, false, false]}, {text:'',  alignment: 'left', border: [false, false, false, false]}],
                    ]
                  },
                  alignment: 'center',
                  margin: [20, 0, 10, 10],
                  fontSize: 6,
                  
                },
                
                
              ]
            ]
          ]
        },
      },
      {
        style: 'tableExample',
        table: {
          widths: ['30%', '70%'],
            border: [false , false, false, false],
            heights: [10, 10],
          
          body: [
            [{text:'RECOMMENDATION:', margin:[5,5,5,5]}, {fontSize: 8, margin: [5,5,5,5], text: req.body.aftremarks}],
            [{text:'NOTE:', margin:[5,5,5,5]}, {fontSize: 8, margin: [5,5,5,5], text: req.body.aftnotes}]
          ]
        
        },
        fontSize: 6,
      
      },
      {
          table: {
          widths: ['33.33%', '33.33%', '33.33%'],
          
          body: [
            [ {text:'TESTED BY: ', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [true, true, false, false], margin: [10, 10, 0, 0]},
              {text:'RECEIVED BY: ', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [false, true, false, false], margin: [10, 10, 0, 0]},
              {text:'CERTIFIED BY: ', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [false, true, true, false], margin: [10, 10, 0, 0] }],
              [ {text:'', alignment: 'left', fillColor: 'white', color: 'black', bold: false, border: [true, false, false, false], margin:[10,0,0,-15]},
              {text:'', alignment: 'left', fillColor: 'white', color: 'black', bold: false, border: [false, false, false, false], margin:[10,0,0,-15]},
              {text:'Walter A. Opulencia', alignment: 'left', fillColor: 'white', color: 'black', bold: false, border: [false, false, true, false], margin:[10,0,0,-15]}],
              [ {text:'___________________________________ ', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [true, false, false, true], margin: [10, 0, 0, 0]},
              {text:'___________________________________', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [false, false, false, true], margin: [10, 0, 0, 0]},
              {text:'___________________________________', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [false, false, true, true], margin: [10, 0, 0, 10]}],
          ],
          
        },
        layout: {
          
          defaultBorder: false,
        },
        alignment: 'center',
        fontSize: 6,
        margin: [0, 5, 0, 0],
        
        
      },
    ],
    defaultStyle: {
      font: 'Helvetica'
    }

  } 

    var pdfURL = ''
    if(req.params.fileStatus == 'notexists')
    {
      const getFileDir = await methods.getFileDir(client)
      pdfURL = getFileDir.dir+'pdfs/mtr/mtr-'+req.params.tagID+'.pdf'
    }
    else if(req.params.fileStatus == 'exists'){
      const assemblyandtesting = await methods.getSingle(client, 'assemblyandtesting', parseInt(req.params.tagID))
      pdfURL = assemblyandtesting.files[1].loc
      
    }
      
    
    var options = {}
    
    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream(pdfURL));
    pdfDoc.end();
    res.send(pdfURL); 

    
   
  } catch(err)
  {
    console.log(err)
    res.send(err);
  }
});

router.get('/asset/assemblyandtesting/mtr/:fileStatus/:tagID', async function(req, res){

  var pdfURL = ''

  if(req.params.fileStatus == 'notexists')
  {
    const getFileDir = await methods.getFileDir(client)
    pdfURL = getFileDir.dir + 'pdfs/mtr/mtr-'+req.params.tagID+'.pdf'
  }
  else if(req.params.fileStatus == 'exists')
  {
    var assemblyandtesting = await methods.getSingle(client, 'assemblyandtesting', parseInt(req.params.tagID))
    pdfURL = assemblyandtesting.files[0].loc
  }

  fs.readFile(pdfURL, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
})


router.post('/asset/fordelivery/dr/:fileStatus/:tagID', async function(req, res){
  
  let motors = await methods.getSingle(client, 'motors', req.params.tagID);
  let oncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);
  let prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID)
  let childmotors
  let childoncheckup
  let childprelimdocs
  if(motors.submotor.child != null)
  {
    childmotors = await methods.getSingle(client, 'motors', motors.submotor.child);
    childoncheckup = await methods.getSingle(client, 'oncheckup', motors.submotor.child);
    childprelimdocs = await methods.getSingle(client, 'prelimdocs', motors.submotor.child)
  }

  let fordelivery = await methods.getSingle(client, 'fordelivery', req.params.tagID);
  let company = await methods.getCompany(client, motors.company_id);
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  try {
    
    var mydate = new Date();
    var month =mydate.getMonth() + 1
    var day = mydate.getDate()
    var year = mydate.getFullYear()
    var address = company.street + ', ' + company.brgy + ', ' + company.city + ', ' + company.state + ', ' + company.zip;
    const getFileDir = await methods.getFileDir(client)
    if(req.params.fileStatus == 'notexists')
    {
      
      pdfURL = getFileDir.dir+'pdfs/dr/dr-'+req.params.tagID+'.pdf'
    }
    else if(req.params.fileStatus == 'exists')
    {
        const fordelivery = await methods.getSingle(client, 'fordelivery', parseInt(req.params.tagID))
        pdfURL = fordelivery.files[0].loc
    }
    
    console.log(pdfURL)
     
    function isInvoice(invoicestate)
    {
      
      if(invoicestate)
        return {
          style: 'tableExample',
          table: {
            body: [
              [{text:'INVOICE TO FOLLOW', alignment: 'center', fontSize: 10, margin: [2.5,2.5,2.5,2.5]}],
              [
                  { 
                    stack: displayIDs(prelimdocs.qNo),
                    margin: [0,10, 0, 0],
                    border: [false, false, false, false]
                  }
              ]
            
            ]
          },
          absolutePosition: {x:468, y:300.63}, fontSize: 9, bold: true
        }
      return {
        style: 'tableExample',
        table: {
          body: [
            [
                { 
                  stack: displayIDs(prelimdocs.qNo),
                  margin: [0,10, 0, 0],
                  border: [false, false, false, false]
                }
            ]
          
          ]
        },
        absolutePosition: {x:468, y:300.63}, fontSize: 9, bold: true
      }
    }

    function dynamicResize(data)
    {
      if(data.length > 80) 
        return {text: data, fontSize: 7, bold: true, width: 10}
      else if(data.length > 48) 
        return {text: data, fontSize: 8, bold: true, width: 10}
      return {text: data, fontSize: 10, bold: true, width: 10}
    }

    function addMotor()
    {
      //Check if motor has child
      if(motors.submotor.child == null)
      { 
        //if no child, then as is
        var obj = [ 
          [{text: '1 UNIT', width: 57.6, alignment: 'center', margin: [10,10,10,10]},{text: [{text:'', bold: true}, ''], width: 300, margin: [10, 0, 0, 0], margin: [10,10,10,10], lineHeight: 1.25}, ''],
        ]
        obj[0][1].text[0].text = motors.motorType + '\n'
        obj[0][1].text[1] = " (" + oncheckup.power + ", " + oncheckup.voltage + " V, " + oncheckup.rpm + " RPM, " + oncheckup.current + " AMPS, " + oncheckup.frequency + " HZ, " + oncheckup.phase + "PHASE) \nTAG NO. " + motors.tagID 
        return obj
      }
    
      // if there's a child, then also accomodate the child
      var obj = [ 
        [{text: ''},{
          absolutePosition: {x:20, y:232.6},
          layout: 'noBorders',
          //This is the subtable
          table: {
            widths: [70.8661,340.157,140],
            body: []
          },
        }, {text: ''}],
      ]

      //Fill the subtable body with the mother motor and the submotor

      //Push the mother motor
      var motorDetails = motors.motorType + '\n'
          motorDetails += " (" + motors.power + ", " + oncheckup.voltage + " V, " + motors.rpm + " RPM, " + oncheckup.current + " AMPS, " + oncheckup.frequency + " HZ, " + oncheckup.phase + "PHASE) \nTAG NO. " + motors.tagID 
      //Push the submotor
      var submotorDetails = childmotors.motorType + '\n'
          submotorDetails += " (" + childoncheckup.power + ", " + childoncheckup.voltage + " V, " + childoncheckup.rpm + " RPM, " + childoncheckup.current + " AMPS, " + childoncheckup.frequency + " HZ, " + childoncheckup.phase + "PHASE) \nTAG NO. " + childmotors.tagID 
      
      obj[0][1].table.body.push([{text: '1 UNIT', alignment: 'center', margin: [10, 10,10,10]}, {text: motorDetails, margin: [10, 10,10,10], lineHeight: 1.5}, {text: ''}])
      obj[0][1].table.body.push([{text: '1 UNIT', alignment: 'center', margin: [10, 10,10,10]}, {text: submotorDetails, margin: [10, 10,10,10], lineHeight: 1.5}, {text: ''}])


      return obj
    }

    function displayIDs(qcodes)
    {
      var quotationNo = ''
      if(typeof qcodes == 'string')
      {
        quotationNo = prelimdocs.qNo
      }
      else {
        quotationNo = [{text: 'Q# : \n'}]
        for(var i=0; i<qcodes.length; i++)
        {
          if(i == 0 && prelimdocs.stator.length > 0) 
            quotationNo.push({text: qcodes[i]+"\n"})
          if(i == 1 && prelimdocs.accessories.length > 0) 
            quotationNo.push({text: qcodes[i]+"\n"})
          if(i == 2 && prelimdocs.mechanical.length > 0) 
            quotationNo.push({text: qcodes[i]+"\n"})
          if(i == 3 && prelimdocs.dynamic.length > 0) 
            quotationNo.push({text: qcodes[i]+"\n"})
          if(i == 4 && prelimdocs.misc.length > 0) 
            quotationNo.push({text: qcodes[i]+"\n"})
        }
      }

      //Submotor

      //Is there a child?
      if(motors.submotor.child != null)
      {
        
        if(typeof childprelimdocs.qNo == 'object')
        {
          //If there is, is it a list?
          if(typeof quotationNo == 'object')
          {
            for(var i=0; i<childprelimdocs.qNo.length; i++)
              quotationNo.push({text: childprelimdocs.qNo[i]+"\n"})
          }
          else 
          {
            for(var i=0; i<childprelimdocs.qNo.length; i++)
              quotationNo += "\n"+childprelimdocs.qNo[i]
          }
          
        }
        else {
          //If there is, is it a string?

            if(typeof quotationNo == 'object')
            {
              quotationNo.push({text: childprelimdocs.qNo})
            }
            else
            {
              quotationNo += '\n' + childprelimdocs.qNo
            }
        }
      }

      return [ 
        {text: quotationNo, fontSize: 10, lineHeight: 1.5},
        {text: 'GP# : ' + motors.gatepass, fontSize: 10},
        {text: ' '},
        {text: 'PR/SHC No.: '},
        {text: 'PO No. : ' + req.body.pono}
      ]

    }

    var docDefinition = {
        pageSize: {
            width: 612,
            height: 792 
        },
        pageMargins: 25,
    
      content: [
        {
          style: 'tableExample',
          
          table: {
            widths: ['65%', '10%', '20%'],
            heights: 17, 
            body: [
              [dynamicResize(company.compname), '', {text: monthNames[month-1].toUpperCase() +' '+day+', '+year, fontSize: 10, bold: true}],
              [dynamicResize(address), '', {text: req.body.drno}]
            ]
          },
          absolutePosition: {x:90.6, y:115.079}, 
          layout: 'noBorders'
        },
        {
          columns: [
            {
              // stack: addMotor()
            }
            
          ],
          absolutePosition: {x:40, y:237.6},
          fontSize: 9,
          bold: true
        },
        {
          style: 'tableExample',
          absolutePosition: {x:20, y:232.6},
          fontsize: 8,
          table: {
            heights: 283.465,
            widths: [70.8661,340.157,140],
            body: addMotor()
          }
        },
        isInvoice(req.body.invoice)
        ],
      defaultStyle: {
        font: 'Helvetica'
      }
      
    }
      
    var options = {}
   

    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream(pdfURL));
    pdfDoc.end();
    res.send(pdfURL); 
   
  } catch(err)
  {
    console.log(err)
    res.send(err);
  }
});

router.get('/asset/fordelivery/dr/:fileStatus/:tagID', async function(req, res){
  var pdfURL = ''

  if(req.params.fileStatus == 'notexists')
  {
    const getFileDir = await methods.getFileDir(client)
    pdfURL = getFileDir.dir + 'pdfs/dr/dr-'+req.params.tagID+'.pdf'
  }
  else if(req.params.fileStatus == 'exists')
  {
    var fordelivery = await methods.getSingle(client, 'fordelivery', parseInt(req.params.tagID))
    pdfURL = fordelivery.files[0].loc
  }
  
  fs.readFile(pdfURL, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
})

router.post('/asset/forbillingstatement/si/:fileStatus/:tagID', async function(req, res){
  let motors = await methods.getSingle(client, 'motors', req.params.tagID);
  let oncheckup = await methods.getSingle(client, 'oncheckup', req.params.tagID);
  let prelimdocs = await methods.getSingle(client, 'prelimdocs', req.params.tagID)
  
  let childmotors
  let childoncheckup
  let childprelimdocs
  if(motors.submotor.child != null)
  {
    childmotors = await methods.getSingle(client, 'motors', motors.submotor.child);
    childoncheckup = await methods.getSingle(client, 'oncheckup', motors.submotor.child);
    childprelimdocs = await methods.getSingle(client, 'prelimdocs', motors.submotor.child)
  }

  let fordelivery = await methods.getSingle(client, 'fordelivery', req.params.tagID);
  let company = await methods.getCompany(client, motors.company_id);
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  try {
    
    var mydate = new Date();
    var month =mydate.getMonth() + 1
    var day = mydate.getDate()
    var year = mydate.getFullYear()
    var address = company.street + ', ' + company.city + ', ' + company.zip;

    
    var total = computeTotal(prelimdocs);
    function currencyFormat(num) {
      num = parseFloat(num)
      return 'P ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    function getdiscount(total)
    {
        if(prelimdocs.discount)
        {
          if(prelimdocs.discount[1] == 'fixed')
          return parseFloat(prelimdocs.discount[0]) 
      
          if(prelimdocs.discount[1] == 'percent'){
              var percentage = parseFloat(prelimdocs.discount[0])/100
              var total_discount = percentage*total;
              return total_discount;
          } 
        }
    
        return 0
    }

    function isDiscount(total)
    {
      if(prelimdocs.discount)
      {
        return [
          [{text: 'SUB-TOTAL AMOUNT'}, {text: currencyFormat(getSubTotal()), fontSize: 10}],
          [{text: 'DISCOUNT'}, {text: currencyFormat(getdiscount(getSubTotal())), fontSize: 10} ],
          [{text: 'ADD 12% VAT'}, {text: currencyFormat(getSubTotal()*0.12), fontSize: 10} ],
          [{text: 'TOTAL AMOUNT', bold: true, fontSize: 12}, {text: currencyFormat((getSubTotal()-getdiscount(getSubTotal())) * 1.12), fontSize: 12, bold: true} ]
        ]
      } 
      return [
        [{text: 'SUB-TOTAL AMOUNT'}, {text: currencyFormat(getSubTotal()), fontSize: 10}],
        [{text: 'ADD 12% VAT'}, {text: currencyFormat(getSubTotal()*0.12), fontSize: 10} ],
        [{text: 'TOTAL AMOUNT', bold: true, fontSize: 12}, {text: currencyFormat((getSubTotal()-getdiscount(getSubTotal())) * 1.12), fontSize: 12, bold: true} ]
      ]
    }

    function computeTotal(prelimdocs)
    { 
      
      var total = 0
      //General Reqs
      for(var i=0; i<prelimdocs.gen.length; i++)
      {
        total += parseFloat(prelimdocs.gen[i].totalcost)
      }

      //Stator
      for(var i=0; i<prelimdocs.stator.length; i++)
      {
        total += parseFloat(prelimdocs.stator[i].totalcost)
      }
      //Accessories
      for(var i=0; i<prelimdocs.accessories.length; i++)
      {
        total += parseFloat(prelimdocs.accessories[i].totalcost)
      }
      //Mechanical
      for(var i=0; i<prelimdocs.mechanical.length; i++)
      {
        total += parseFloat(prelimdocs.mechanical[i].totalcost)
      }
      //Dynamic
      for(var i=0; i<prelimdocs.dynamic.length; i++)
      {
        total += parseFloat(prelimdocs.dynamic[i].totalcost)
      }
      //Misc
      for(var i=0; i<prelimdocs.misc.length; i++)
      {
        total += parseFloat(prelimdocs.misc[i].totalcost)
      }

      // if(prelimdocs.discount)
      // {
      //   if(prelimdocs.discount[1] == 'fixed') total = total-parseFloat(prelimdocs.discount[0])
      //   else if(prelimdocs.discount[1] == 'percent') total = total - (total*parseFloat(prelimdocs.discount[0]))
      // }

      return total 
    }

    function dynamicResize(data)
    {
      if(data.length > 80) 
        return {text: data, fontSize: 7, bold: true, width: 10}
      else if(data.length > 48) 
        return {text: data, fontSize: 8, bold: true, width: 10}
      return {text: data, fontSize: 10, bold: true, width: 10}
    }

    
    function determineCompanyName(compname)
    {
      var compobjname = compname
      
      if(req.body.compname != '') 
      {
        compobjname.text = req.body.compname
      }

      return compobjname
    }

    function determineCompanyAddress(compaddress)
    {
      var compobjadd = compaddress
      
      if(req.body.compaddress != '') 
      {
        compobjadd.text = req.body.compaddress
      }

      return compaddress
    }

    function addMotor()
    {
      if(motors.submotor.child == null)
      { 
        var obj = [ 
          [{text: '1', width: 57.6, alignment: 'center', margin: [10,10,10,10], fontSize: 10}, {text: 'UNIT', width: 57.6, alignment: 'center', margin: [10,10,10,10], fontSize: 10}, {text: [{text:'', bold: true, fontSize: 10}, ''], width: 300, margin: [10, 0, 0, 0], margin: [10,10,10,10], lineHeight: 1.25, fontSize: 10}, {text: currencyFormat(computeTotal(prelimdocs)), width: 57.6, alignment: 'center', margin: [5,15,5,5], fontSize: 10}, {text: currencyFormat(computeTotal(prelimdocs)), width: 57.6, alignment: 'center', margin: [5,15,5,5], fontSize: 10}]
        ]
        obj[0][2].text[0].text = motors.motorType + '\n'
        obj[0][2].text[1] = " (" + oncheckup.power + ", " + oncheckup.voltage + " V, " + oncheckup.rpm + " RPM, " + oncheckup.current + " AMPS, " + oncheckup.frequency + " HZ, " + oncheckup.phase + "PHASE) \nTAG NO. " + motors.tagID 
        return obj
      }

      // if there's a child, then also accomodate the child
      var obj = [ 
        [{text: ''},{
          absolutePosition: {x:20, y:262.6},
          layout: 'noBorders',
          fontSize: 9,
          //This is the subtable
          table: {
            widths: [48,56,280, 70, 80],
            body: []
          },
        }, {text: ''}, {text: ''}, {text: ''}],
      ]

      //Fill the subtable body with the mother motor and the submotor

      //Push the mother motor
      var motorDetails = motors.motorType + '\n'
          motorDetails += " (" + oncheckup.power + ", " + oncheckup.voltage + " V, " + oncheckup.rpm + " RPM, " + oncheckup.current + " AMPS, " + oncheckup.frequency + " HZ, " + oncheckup.phase + "PHASE) \nTAG NO. " + motors.tagID 
      //Push the submotor
      var submotorDetails = childmotors.motorType + '\n'
          submotorDetails += " (" + childoncheckup.power + ", " + childoncheckup.voltage + " V, " + childoncheckup.rpm + " RPM, " + childoncheckup.current + " AMPS, " + childoncheckup.frequency + " HZ, " + childoncheckup.phase + "PHASE) \nTAG NO. " + childmotors.tagID 
      
      obj[0][1].table.body.push([{text: '1', alignment: 'center', margin: [10, 10,10,10]}, {text: 'UNIT', margin: [10, 10,10,10], alignment: 'center'}, {text: motorDetails, margin: [10, 10,10,10], lineHeight: 1.5}, {text: currencyFormat(computeTotal(prelimdocs)), width: 57.6, alignment: 'center', margin: [5,15,5,5], fontSize: 10}, {text: currencyFormat(computeTotal(prelimdocs)), width: 57.6, alignment: 'center', margin: [5,15,5,5], fontSize: 10}])
      obj[0][1].table.body.push([{text: '1', alignment: 'center', margin: [10, 10,10,10]}, {text: 'UNIT', margin: [10, 10,10,10], alignment: 'center'}, {text: submotorDetails, margin: [10, 10,10,10], lineHeight: 1.5}, {text: currencyFormat(computeTotal(childprelimdocs)), width: 57.6, alignment: 'center', margin: [5,15,5,5], fontSize: 10}, {text: currencyFormat(computeTotal(childprelimdocs)), width: 57.6, alignment: 'center', margin: [5,15,5,5], fontSize: 10}])

      return obj

    }

    function displayIDs()
    {
      
        return [ 
                {text: 'PO# : '+ fordelivery.pono, fontSize: 10, lineHeight: 2},
                {text: 'CAIC DR# : '+ fordelivery.drno, fontSize: 10, lineHeight: 2},
                {text: 'TAG NO. : ' + motors.tagID}
        ]
      
    }

    function getSubTotal()
    {
      if(motors.submotor.child != null)
        total = computeTotal(prelimdocs) + computeTotal(childprelimdocs)
      else
        total = computeTotal(prelimdocs)
      return total
    }

    var docDefinition = {
        pageSize: {
            width: 612,
            height: 792 
        },
        pageMargins: 25,
    
      content: [
        {
          style: 'tableExample',
          
          table: {
            widths: ['65%', '10%', '20%'],
            heights: 10, 
            body: [
              ['','',{text:'S.I# '+req.body.sino, fontSize: 12, margin:[0,0,10,10], bold: true}],
              [determineCompanyName(dynamicResize(company.compname)), '', {absolutePosition: {x:480, y:185.0}, text: monthNames[month-1].toUpperCase() +' '+day+', '+year, fontSize: 9}],
              [determineCompanyAddress(dynamicResize(address)), '',''],
              [{text:'TIN#', fontSize: 8}, '', {text:motors.salesRep, fontSize: 8}]
            ]
          },
          absolutePosition: {x:90.6, y:161.0}, 
          layout: 'noBorders'
        },
        {
          columns: [
            {
              // stack: addMotor()
            }
            
          ],
          absolutePosition: {x:40, y:237.6},
          fontSize: 9,
          bold: true
        },
        {
          style: 'tableExample',
          absolutePosition: {x:20, y:262.6},
          fontsize: 8,
          table: {
            heights: 283.465,
            widths: [48,56,280, 70, 80],
            body: addMotor()
          }
        },
        {
          style: 'tableExample',
          table: {
            body: [
              [
                  { 
                    stack: displayIDs(),
                    margin: [0,10, 0, 0],
                    
                    border: [false, false, false, false]
                  }
              ]
            
            ]
          },
          absolutePosition: {x:42.5197, y:568.583}, fontSize: 9, bold: true
        },
        {
          style: 'tableExample',
          table: {
            widths: [99.2126, 99.2126],
            heights: [15, 15],
            body: isDiscount(total)
          },
          absolutePosition: {x:382.6772, y:580.583}, fontSize: 9, bold: true,
          layout: 'noBorders'
        }
        
        ],
      defaultStyle: {
        font: 'Helvetica'
      }
      
    }
      
    var options = {}
    var pdfURL = ''
    if(req.params.fileStatus == 'notexists')
    {
      const getFileDir = await methods.getFileDir(client)
      pdfURL = getFileDir.dir+'pdfs/si/si-'+req.params.tagID+'.pdf'
    }
    else if(req.params.fileStatus == 'exists')
    {
      const forbillingstatement = await methods.getSingle(client, 'forbillingstatement', parseInt(req.params.tagID))
      pdfURL = forbillingstatement.files[0].loc
    }
    
    console.log(pdfURL)

    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream(pdfURL));
    pdfDoc.end();
    res.send(pdfURL); 
   
  } catch(err)
  {
    console.log(err)
    res.send(err);
  }
});

router.get('/asset/forbillingstatement/si/:fileStatus/:tagID', async function(req, res){
  var pdfURL = ''
  if(req.params.fileStatus == 'notexists')
  {
    const getFileDir = await methods.getFileDir(client)
    pdfURL = getFileDir.dir + 'pdfs/si/si-'+req.params.tagID+'.pdf'
  }
  else if(req.params.fileStatus == 'exists')
  {
    const forbillingstatement = await methods.getSingle(client, 'forbillingstatement',  parseInt(req.params.tagID))
    pdfURL = forbillingstatement.files[0].loc
  }
  

  fs.readFile(pdfURL, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
})



router.get('/asset/:stage/iar/front/:fileStatus/:filename', async function(req, res){

    var tempFile = ''
    if(req.params.fileStatus == 'notexists')
    {
      const getFileDir = await methods.getFileDir(client)
      tempFile=getFileDir.dir+"pdfs/iar/iar-front-"+req.params.filename+".pdf"
    }
    else if(req.params.fileStatus == 'exists')
    {
      const obj = await methods.getSingle(client, req.params.stage, req.params.filename)
      tempFile=obj.files[2].loc
    }

    fs.readFile(tempFile, function (err,data){
      res.contentType("application/pdf");
      res.send(data);
    });
});

router.get('/asset/:stage/iar/back/:fileStatus/:filename', async  function(req, res){
  var tempFile = ''
  if(req.params.fileStatus == 'notexists')
  {
    const getFileDir = await methods.getFileDir(client)
    tempFile=getFileDir.dir + "pdfs/iar/iar-back-"+req.params.filename+".pdf";
  }
  else if(req.params.fileStatus == 'exists')
  {
    const obj = await methods.getSingle(client, req.params.stage, req.params.filename)
    tempFile=obj.files[3].loc
  }

  fs.readFile(tempFile, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
});

router.post('/asset/:stage/iar/:fileStatus/:tagID', async function(req, res){

    let motorObj = await methods.getSingle(client, 'motors', req.params.tagID); 
    var pdfURL = ''
    var pdfURL2 = ''

    var company_details = await methods.getCompany(client, motorObj.company_id);

    if(req.params.fileStatus == 'notexists')
    {
      const getFileDir = await methods.getFileDir(client)
      pdfURL = getFileDir.dir + 'pdfs/iar/iar-front-'+ req.params.tagID+'.pdf';
      pdfURL2 = getFileDir.dir + 'pdfs/iar/iar-back-'+req.params.tagID+'.pdf'
    }
    else if(req.params.fileStatus == 'exists')
    {
      let obj = await methods.getSingle(client, req.params.stage, req.params.tagID); 
      pdfURL = obj.files[2].loc;
      pdfURL2 = obj.files[3].loc
    }

    //IAR FRONT
    var iarfrontobj = await files.createIARFront(motorObj, company_details, req.body); 
    var pdfDoc = printer.createPdfKitDocument(iarfrontobj, {});
    pdfDoc.pipe(fs.createWriteStream(pdfURL));
    pdfDoc.end();

    //IAR BACK 
    var iarbackobj = await files.createIARBack(); 
    var pdfDoc = printer.createPdfKitDocument(iarbackobj, {});
    pdfDoc.pipe(fs.createWriteStream(pdfURL2));
    pdfDoc.end();

    res.send(200)
});


router.get('/asset/prelimdocs/quotation/:fileStatus/:filename', async function(req, res){
  const getFileDir = await methods.getFileDir(client)
  
  var pdfURL = ''

  if(req.params.fileStatus == 'notexists')
  {
    pdfURL = getFileDir.dir+'pdfs/qform/'+ req.params.filename+'.pdf';
  }
  else if(req.params.fileStatus == 'exists')
  {
    const prelimdocs = await methods.getSingle(client,'prelimdocs', parseInt(req.params.filename))
    pdfURL = prelimdocs.files[0].loc;
  }
    

  fs.readFile(pdfURL, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
});


router.post('/asset/prelimdocs/quotation/:fileStatus/:filename', async function(req, res){
  
  try {
    const getFileDir = await methods.getFileDir(client)
    let motordetails = await methods.getSingle(client, 'motors', req.params.filename);
    let companydetails = await methods.getCompany(client, motordetails.company_id);
    let qformIDs = await methods.getQformIDs(client, req.params.filename);
    let oncheckupObj = await methods.getSingleOnCheckup(client, req.params.filename, true);
    let name = req.user.name
    let position = req.user.position
    var pdfURL = ''

    if(req.params.fileStatus == 'notexists')
      pdfURL = getFileDir.dir+'pdfs/qform/'+ req.params.filename+'.pdf';
    else if(req.params.fileStatus == 'exists')
    {
      const prelimdocs = await methods.getSingle(client,'prelimdocs', parseInt(req.params.filename))
      pdfURL = prelimdocs.files[0].loc;
    }
      
    try {
      var qformObj = files.createQuotationPDF2(motordetails, companydetails, qformIDs, req.body, oncheckupObj, name, position);
      var pdfDoc = printer.createPdfKitDocument(qformObj, {});
      pdfDoc.pipe(fs.createWriteStream(pdfURL));
      pdfDoc.end();
    }catch(e){ console.log(e)}
    
    res.sendStatus(200);

  } catch(err)
  {
    res.send(err);
  }
});


router.get('/asset/prelimdocs/quotation/:fileStatus/:filename/:scope', async function(req, res){

  const getFileDir = await methods.getFileDir(client)
  var pdfURL = ''

  if(req.params.fileStatus == 'notexists')
  {
    pdfURL = getFileDir.dir+"pdfs/subqform/"+req.params.filename+"-" + req.params.scope + ".pdf";
  }
  else if(req.params.fileStatus == 'exists')
  {
    const prelimdocs = await methods.getSingle(client,'prelimdocs', parseInt(req.params.filename))
    var fileIndx = 0;
    if(req.params.scope == 'stator') fileIndx = 0;
    else if(req.params.scope == 'accessories') fileIndx = 1;
    else if(req.params.scope == 'mechanical') fileIndx = 2;
    else if(req.params.scope == 'dynamic') fileIndx = 3;
    else if(req.params.scope == 'misc') fileIndx = 4;

    pdfURL = prelimdocs.files[fileIndx].loc;
  }
     

  fs.readFile(pdfURL, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
});

router.post('/asset/prelimdocs/quotation/:fileStatus/:filename/:scope', async function(req, res){
    let motordetails = await methods.getSingle(client, 'motors', req.params.filename);
    let companydetails = await methods.getCompany(client, motordetails.company_id)
    try {
      let motordetails = await methods.getSingle(client, 'motors', req.params.filename);
      let qformIDs = await methods.getQformIDs(client, req.params.filename);
      let oncheckupObj = await methods.getSingleOnCheckup(client, req.params.filename, true);
      let name = req.user.name

      var pdfURL = ''
     
      if(req.params.fileStatus == 'notexists')
      {
        const getFileDir = await methods.getFileDir(client)
        pdfURL = getFileDir.dir+'pdfs/subqform/'+ req.params.filename+'-'+req.params.scope+'.pdf';
      }
      else if(req.params.fileStatus == 'exists')
      {
        const prelimdocs = await methods.getSingle(client,'prelimdocs', parseInt(req.params.filename))
        var fileIndx = 0;
        if(req.params.scope == 'stator') fileIndx = 0;
        else if(req.params.scope == 'accessories') fileIndx = 1;
        else if(req.params.scope == 'mechanical') fileIndx = 2;
        else if(req.params.scope == 'dynamic') fileIndx = 3;
        else if(req.params.scope == 'misc') fileIndx = 4;

        pdfURL = prelimdocs.files[fileIndx].loc;
      }
        
      
      try {var qformObj = files.createQuotationPDFSingle2(motordetails, companydetails, qformIDs, req.body, oncheckupObj, req.params.scope, name);}catch(e){ console.log(e)}
      var pdfDoc = printer.createPdfKitDocument(qformObj, {});
      pdfDoc.pipe(fs.createWriteStream(pdfURL));
      pdfDoc.end();

      res.sendStatus(200);
      
      //files.createQuotationPDFSingle(doc, pdfURL, req.body, motordetails, companydetails, req.params.scope, qformIDs);
    } catch(err)
    {
      res.send(err);
    }
});

router.get('/downloadUploaded/:stage/:tagID/:filename', async function(req, res){
  const obj = await methods.getSingle(client, req.params.stage, parseInt(req.params.tagID))
  var fileDir = ''
  for(var i=0; i<obj.files.length; i++)
    if((obj.files[i].loc).includes(req.params.filename))
      fileDir = obj.files[i].loc

  try{
    res.download(fileDir); 
  }
  catch(e) {
    console.log(e)
  }
});

router.get('/downloadUploaded/export', async function(req, res){
  const dir = await methods.getFileDir(client)
  var fileDir = dir.dir + "export.csv"
  try{
    res.download(fileDir); 
  }
  catch(e) {
    console.log(e)
  }
});

router.get('/downloadPDF/:stage/:fileType/:tagID/:filename', async function(req, res){
  const obj = await methods.getSingle(client, req.params.stage, parseInt(req.params.tagID))
  var fileDir = ''

  for(var i=0; i<obj.files.length; i++)
    if((obj.files[i].loc).includes(req.params.filename))
      fileDir = obj.files[i].loc

  try{
    res.download(fileDir);
  }
  catch(e) {
    console.log(e)
  }
});

router.post('/uploadFile/:tagID/:stage/:file/:status', async function(req, res){
  
  var stageObj = null;
  let fileobj = req.files[req.params.file];
  let fileloc = '';
  if(req.params.stage == 'oncheckup')
    stageObj = await methods.getSingle(client, 'oncheckup', req.params.tagID);

  if(req.params.status == 'new')
  {
    var filename = ''
    if(req.params.file == 'beforeimage') filename = 'beforeimage-'+req.params.tagID+'.jpg';
    else if (req.params.file == 'iar1') filename = 'iarfront-'+req.params.tagID+'.jpg';
    else if (req.params.file == 'iar2') filename = 'iarback-'+req.params.tagID+'.jpg';  

    const getFileDir = await methods.getFileDir(client)
    
    fileloc = getFileDir.dir+'uploads/'+req.params.stage+'/'+ filename;
  }
  else if(req.params.status == 'old')
  {
    if(stageObj)
    {
      if(req.params.stage == 'oncheckup')
      {
        console.log('Heyz');
        if(req.params.file == 'iar1')
          fileloc = stageObj.files[0].loc;
        else if(req.params.file == 'iar2')
          fileloc = stageObj.files[1].loc;
        else if(req.params.file == 'beforeimage')
          fileloc = stageObj.files[4].loc;
      }
      
    }
  }

  fileobj.mv(fileloc, async function(err) {
    if (err)
      return res.status(500).send(err);
    else 
      console.log('Upload successful!')
  });

  res.send(200);

});

router.get('/checkFiles/:tagID/:stage', async function(req, res){
  
  var fileCtr = 0; 
  const stage = await client.db("caic-sample").collection(req.params.stage).find({tagID: parseInt(req.params.tagID)}, { projection:({ _id: 0, files: 1 })});
  const stage_files = await stage.toArray();
  var file_status = { found: [], notfound: []}

 

  stage_files[0].files.forEach(file => {
    try {
      if (fs.existsSync(file.loc)) {
        file_status.found.push(file.name)
      }
      else 
      {
        file_status.notfound.push(file.name)
      }
    } catch(err) {
      console.error(err)
    }
  });

  res.send(file_status);

});

module.exports  = router;