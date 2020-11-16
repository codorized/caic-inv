const createQuotationPDF = (fs, doc, pdfURL, inputs, motordetails, companydetails) => {

    var contents = inputs;

    doc.fontSize(8);
    doc.text("FORM REVISION (SEPT. 2020)  AKCOM ", {
        'align': 'right'
    }).fontSize(15);
    doc.moveDown();
    doc.text("CALAMBA ALLIED INDUSTRIAL CORPORATION", {
    'align': 'center',
    'lineGap ': 5
    }).fontSize(10);
    doc.moveDown();
    doc.text("Lakeshore Subd. Bay, Laguna", doc.x, doc.y-10, {
    'align': 'center'
    }).fontSize(10);
    doc.moveDown();
    doc.text("Telefax: +63495317085 to 86", doc.x, doc.y-10, {
    'align': 'center'
    }).fontSize(10);
    doc.moveDown();
    doc.text("www.caic.com.ph", doc.x, doc.y-10, {
    'align': 'center'
    })
    doc.moveDown();
    doc.fontSize(10);
    doc.fillColor('red')
    doc.text("GENERAL CONTRACTOR", doc.x, doc.y-10, {
    'align': 'center',
    'color': 'red'
    }).fillColor('black').text("CIVIL *** MECHANICAL *** ELECTRICAL",  {
    'align': 'center',
    'color': 'red'
    })
    doc.moveDown();
    doc.fontSize(10);
    doc.text("TAG#: " + motordetails.tagID, doc.page.width*2/3+25, doc.y-20, {
        width: doc.page.width/3, 
    'align': 'left',
    'lineGap ': 10
    }).text("DR#: ",{
    'align': 'left',
    });
    
    var docy = doc.y+10;
    var docx = doc.x;   
    var pwidth = doc.page.width;
    
    doc.moveDown();
    doc.lineWidth(2);
    doc.lineCap('butt')
    .moveTo(25, doc.y-7)
    .lineTo(pwidth-25, doc.y-7)
    .stroke()
    
    doc.text("Customer: "+ motordetails.company, 25, docy, {
        width: doc.page.width*0.4, 
    'align': 'left',
    'lineGap ': 10
    }).text("Address/Location: "+companydetails.city+", "+companydetails.state,{
    'align': 'left',
    }).text("Contact Person: "+ companydetails.contact1,{
    'align': 'left',
    })
    .text("Project Title: ",{
    'align': 'left',
    });
    
    
    doc.moveDown();
    doc.text("Sales Rep: "+ motordetails.salesRep, doc.page.width*0.6, docy, {
        width: doc.page.width*0.3, 
    'align': 'left',
    'lineGap ': 10
    }).text("TIN#: ",{
    'align': 'left',
    }).text("Q-no.2020: ",{
    'align': 'left',
    }).text("Gate Pass #: ",{
    'align': 'left',
    });
    
    docy = doc.y+10;
    docx = doc.x;

    
    doc.moveDown();
    doc.lineWidth(2);
    doc.lineCap('butt')
    .moveTo(25, doc.y-10)
    .lineTo(pwidth-25, doc.y-10)
    .stroke()
    doc.fontSize(12);
    doc.moveDown();
    doc.font('Helvetica-Bold');
    doc.text("INDUSTRIAL MOTOR SPECIFICATIONS AND RATING CAPACITY", 25, doc.y-20, {
    'align': 'center',
    'lineGap ': 5
    })
    doc.fontSize(10);
    doc.moveDown();
    doc.lineWidth(2);
    doc.lineCap('butt')
    .moveTo(25, doc.y-13)
    .lineTo(pwidth-25, doc.y-13)
    .stroke()
    
    docy = doc.y-5;
    docx = doc.x;
    doc.font('Helvetica')
    doc.moveDown();
    doc.moveDown();
    doc.text("Motor Name: "+ motordetails.motorType, 25, docy, {
        width: doc.page.width*0.4, 
    'align': 'left',
    'lineGap ': 10
    }).text("Capacity  Rating: "+ motordetails.power,{
    'align': 'left',
    }).text("Current: " + inputs.current,{
    'align': 'left',
    })
    .text("Project Title: ",{
    'align': 'left',
    });

    doc.moveDown();
    doc.text("Voltage: "+ inputs.voltage, doc.page.width*0.6, docy, {
        width: doc.page.width*0.3, 
    'align': 'left',
    'lineGap ': 10
    }).text("Speed (rpm): " + motordetails.rpm,{
    'align': 'left',
    }).text("Q-no.2020: ",{
    'align': 'left',
    }).text("Phase: "+ inputs.phase,{
    'align': 'left',
    }).text("Frequency: " + inputs.frequency, doc.page.width*0.6+100, doc.y-13, {
    'align': 'left',
    });

    doc.moveDown();
    
    categ({
        heading: 'I. General Requirements ',
        showSubheading: true,
        isMainHeading: true,
        content: [
        {
            name: 'Pickup and Delivery',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Dismantling and Installation',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '3,000'
        }
            ]

    }, 25, doc.y)

    categ({
        heading: 'II. Scope of Works',
        showSubheading: false,
        isMainHeading: true,
    }, 25, doc.y+10)
    
    //STATOR
    inputsobj = [];
    for(var i=1; i <= inputs.stator.length; i++)
    {
        var tempobj = {};
        if(inputs.stator[i-1].name == 'stator-inspection')
        {
            tempobj.name = 'Inspection and Checking of unit and Data Recording';
        }
        else if(inputs.stator[i-1].name == 'stator-complete-rewinding')
        {
            tempobj.name = 'Complete Stator Coil Rewinding Package (Includes the following:)';
            tempobj.formalname = 'stator-complete-rewinding';
        }
        else if(inputs.stator[i-1].name == 'stator-complete-recon')
        {
            tempobj.name = 'Complete Reconditioning Package (Includes all stated above EXCEPT Stator  coil Rewinding)';
            tempobj.formalname = 'stator-complete-recon';
        }
        else if(inputs.stator[i-1].name == 'conversion:')
        {
            tempobj.name = 'Conversion of motor any parameter';
        }

        tempobj.qty = inputs['stator-qty-'+i];
        tempobj.unitcost = inputs['stator-unitcost-'+i];
        tempobj.totalcost = inputs['stator-totalcost-'+i];
        inputsobj.push(tempobj);
    }


    categ({
        heading: 'A. Stator  Assembly',
        showSubheading: false,
        isSubHeading: true,
        middleLineHeight: 10,
         content: inputsobj
    }, doc.x, doc.y+10);
   
   
  //  doc.lineWidth(1);
  //   doc.lineCap('butt')
  //   .moveTo(doc.page.width*0.6-35, doc.y+15)
  //   .lineTo(doc.page.width*0.6-35, doc.y-149)
  //   .stroke()
      
  //ACCESSORIES
    
    inputsobj = [];
    if(inputs.accessories)
    {
        for(var i=1; i <= inputs.accessories.length; i++)
        {
            var tempobj = {};
            if(inputs.accessories[i-1].name == 'rotor-loadside')
            {
                tempobj.name = 'Replacement of Bearing (Load Side)';
                
            }
            else if(inputs.accessories[i-1].name == 'rotor-fanslide')
            {
                tempobj.name = 'Replacement of Bearing (Load Side)';
                
            }
            else if(inputs.accessories[i-1].name == 'rotor-gearbox1')
            {
                tempobj.name = 'Replacement of Bearing (Gear Box)';
                
            }
            else if(inputs.accessories[i-1].name == 'rotor-gearbox2')
            {
                tempobj.name = 'Replacement of Bearing (Gear Box)';
                
            }
            else if(inputs.accessories[i-1].name == 'rotor-gearbox3')
            {
                tempobj.name = 'Replacement of Bearing (Gear Box)';
                
            }
            else if(inputs.accessories[i-1].name == 'rotor-gearbox4')
            {
                tempobj.name = 'Replacement of Bearing (Gear Box)';
                
            }
            else if(inputs.accessories[i-1].name == 'rotor-gearbox5')
            {
                tempobj.name = 'Replacement of Bearing (Gear Box)';
                
            }
            else if(inputs.accessories[i-1].name == 'rotor-gearbox6')
            {
                tempobj.name = 'Replacement of Bearing (Gear Box)';
                
            }
            else if(inputs.accessories[i-1].name == 'acce-options-capacitor')
            {
                tempobj.name = inputs.accessories[i-1]['acce-options-capacitor1'] + ' of ' + inputs.accessories[i-1]['acce-options-capacitor2'];
                
            }
            else if(inputs.accessories[i-1].name == 'acce-options-fanblade')
            {
                tempobj.name = inputs.accessories[i-1]['acce-options-fanblade1'] + ' of ' + inputs.accessories[i-1]['acce-options-fanblade2'];
                
            }
            else if(inputs.accessories[i-1].name == 'acce-options-oilseal')
            {
                tempobj.name = inputs.accessories[i-1]['acce-options-oilseal1'] + ' of ' + inputs.accessories[i-1]['acce-options-oilseal2'];
                
            }
            else if(inputs.accessories[i-1].name == 'acce-options-shaftseal')
            {
                tempobj.name = inputs.accessories[i-1]['acce-options-shaftseal1'] + ' of ' + inputs.accessories[i-1]['acce-options-shaftseal2'];
                
            }
            else if(inputs.accessories[i-1].name == 'acce-options-oring-or-packing')
            {
                tempobj.name = 'Replacement of ' + inputs.accessories[i-1]['acce-options-oring-or-packing1'];
                
            }
           
            tempobj.item = inputs['acce-item-'+i];
            tempobj.qty = inputs['acce-qty-'+i];
            tempobj.unitcost = inputs['acce-unitcost-'+i];
            tempobj.totalcost = inputs['acce-totalcost-'+i];
            inputsobj.push(tempobj);
        }
     
    
        categ({
            heading: 'B. Accessories',
            showSubheading: false,
            showItemheading: true,
            isSubHeading: true,
            isInsideSubHeading: true,
            content: inputsobj
        }, 25, doc.y+20)
    }
    
  
  // doc.lineWidth(1);
  //   doc.lineCap('butt')
  //   .moveTo(doc.page.width*0.6-35, doc.y+5)
  //   .lineTo(doc.page.width*0.6-35, doc.y-229)
  //   .stroke()
    
    if(inputs.mechanical)
    {
        inputsobj = [];
        for(var i=1; i <= inputs.mechanical.length; i++)
        {
            var tempobj = {};
            if(inputs.mechanical[i-1].name == 'acce-fancover')
            {
                tempobj.name = 'Fabrication of Fan Cover';
                
            } else if(inputs.mechanical[i-1].name == 'acce-terminal')
            {
                tempobj.name = 'Fabrication of Terminal Cover';
                
            }
            else if(inputs.mechanical[i-1].name == 'acce-wielding')
            {
                tempobj.name = 'Welding of Endplate';
                
            }
            else if(inputs.mechanical[i-1].name == 'acce-terminalpost')
            {
                tempobj.name = 'Fabrication of Terminal Post';
                
            }
            else if(inputs.mechanical[i-1].name == 'acce-options-capilla-or-gear')
            {
                tempobj.name = inputs.mechanical[i-1]['acce-options-capilla-or-gear1'] + ' of ' + inputs.mechanical[i-1]['acce-options-capilla-or-gear2'];
                
            }
            else if(inputs.mechanical[i-1].name == 'acce-cable')
            {
                tempobj.name = 'Fabrication of Adaptor Cable';
                
            }
            else if(inputs.mechanical[i-1].name == 'acce-alignment')
            {
                tempobj.name = 'Fabrication of Shafting including Alignment';
                
            }
    
            else if(inputs.mechanical[i-1].name == 'acce-finge-coupling')
            {
                tempobj.name = 'Replacement of Flange Coupling including Reboring';
                
            }
            else if(inputs.mechanical[i-1].name == 'acce-shafting')
            {
                tempobj.name = 'Build up and Machining of Shafting';
                
            }
            else if(inputs.mechanical[i-1].name == 'acce-welding-motor')
            {
                tempobj.name = 'Welding of Motor Base';
                
            }
            else if(inputs.mechanical[i-1].name == 'acce-reboring-housing')
            {
                tempobj.name = 'Reboring of Bearing Housing';
                
            }
            else if(inputs.mechanical[i-1].name == 'acce-sleeving')
            {
                tempobj.name = 'Sleeving of Bearing Housing';
                
            }
           
            tempobj.item = inputs['mech-item-'+i];
            tempobj.qty = inputs['mech-qty-'+i];
            tempobj.unitcost = inputs['mech-unitcost-'+i];
            tempobj.totalcost = inputs['mech-totalcost-'+i];
            inputsobj.push(tempobj);
        }
       
        categ({
            heading: 'C. Mechanical',
            showSubheading: false,
            showItemheading: false,
            isSubHeading: true,
            isInsideSubHeading: true,
             content: inputsobj
        }, 25, doc.y+10);
           
    }
    
    
    inputsobj = [];
    if(inputs.dynamic)
    {
        for(var i=1; i <= inputs.dynamic.length; i++)
        {
            var tempobj = {};
            if(inputs.dynamic[i-1].name == 'dynamic-options')
            {
                tempobj.name = inputs.dynamic[i-1]['dynamic-options2'];
            } 
            tempobj.qty = inputs['dynamic-qty-'+i];
            tempobj.unitcost = inputs['dynamic-unitcost-'+i];
            tempobj.totalcost = inputs['dynamic-totalcost-'+i];
            
            inputsobj.push(tempobj);
            console.log(tempobj);
        }
        categ({
            heading: 'D. Dynamic balancing of',
            showSubheading: false,
            showItemheading: false,
            isSubHeading: true,
            isInsideSubHeading: true,
            content: inputsobj
        }, 25, doc.y+10);
    }
    
    
    
    if(inputs.misc)
    {
        inputsobj = [];
        for(var i=1; i <= inputs.misc.length; i++)
        {
            var tempobj = {};
            tempobj.name = inputs.misc[i-1].name;
            tempobj.qty = inputs['misc-qty-'+i];
            tempobj.unitcost = inputs['misc-unitcost-'+i];
            tempobj.totalcost = inputs['misc-totalcost-'+i];
            inputsobj.push(tempobj);
        }
        categ({
                heading: 'E. Miscelleneous',
                showSubheading: false,
                showItemheading: false,
                isSubHeading: true,
                isInsideSubHeading: true,
                content: inputsobj
            }, 25, doc.y+10)
    }
    
    
    categ({
            heading: 'SUB -TOTAL AMOUNT',
            showSubheading: false,
            showItemheading: false,
            isInsideSubHeading: true,
            istotal: true,
            istotalVal: '1000'
    }, 25, doc.y+10)
    categ({
            heading: 'ADD: 12% VAT',
            showSubheading: false,
            showItemheading: false,
            isInsideSubHeading: true,
            istotal: true,
            istotalVal: '1000'
    }, 25, doc.y+10)
    categ({
            heading: 'III. TOTAL AMOUNT',
            isMainHeading: true,
            showSubheading: false,
            showItemheading: false,
            istotal: true,
            istotalVal: '25,864.00',
            istotalValSize: 15,
            istotalValStyle: 'Helvetica-Bold'
    }, 25, doc.y+5)
    categ({
            heading: '',
            showSubheading: false,
            showItemheading: false,
            contents: [
                {
                    
                }]
    }, 25, doc.y+5)

    docy = doc.y;
             
            doc.text('IV. Work Duration: 1 Working Day/s', docx, docy, {
                 width: doc.page.width*0.5, 
                 isSubHeading: true,
                'align': 'left',
                'lineGap ': 10
                })
            
            doc.text('Term of Payment: ', pwidth*0.5, docy, {
                 width: doc.page.width*0.5, 
                'align': 'left',
                'lineGap ': 10
                })
            if(doc.y > 960){
                    doc.addPage();
            }
            doc.text('Validty: 2 day/s upon accepted by the Buyer\'s Authorized representative', docx, doc.y, {
                 width: doc.page.width, 
                'align': 'left',
                'lineGap ': 10
                })
            
            doc.moveDown();
            doc.lineWidth(2);
            doc.lineCap('butt')
            .moveTo(25, doc.y-5)
            .lineTo(pwidth-25, doc.y-5)
            .stroke()
            
            docy = doc.y+10;
            
            doc.text('Prepared by: ', docx, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
            doc.text('Checked  & Appoved by :', pwidth*0.33, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
             doc.text('COMFORME / RECEIVED BY: ', pwidth*0.66, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
                
            docy = doc.y+10;
            
            doc.text('____________________________', docx, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
            doc.text('_____________________________', pwidth*0.33, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
             doc.text('____________________________', pwidth*0.66, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
            docy = doc.y+5;
            
            doc.text('Amiel Kit Maranan', docx, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
            doc.text('Walter A. Opulencia', pwidth*0.33, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
            docy = doc.y+5;
            
            doc.text('Assistant Production Manager', docx, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
            doc.text('Production/Operations Manager', pwidth*0.33, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
            doc.text('Customer Representative', pwidth*0.66, docy, {
                 width: doc.page.width*0.33, 
                'align': 'left',
                'lineGap ': 10
                })
            
            
            doc.moveDown();
            doc.lineWidth(2);
            doc.lineCap('butt')
            .moveTo(25, doc.y-5)
            .lineTo(pwidth-25, doc.y-5)
            .stroke()
    function breakifneed(docy)
    {
        if(docy > 950)
        {
            doc.addPage()
        }
    }
    function categ(obj, docx, docy){       
        doc.moveDown();
        if(obj.isMainHeading){
            doc.lineWidth(2);
            doc.lineCap('butt')
            .moveTo(25, docy-5)
            .lineTo(pwidth-25, docy-5)
            .stroke()
        }
        if(obj.isInsideSubHeading)
        {
            doc.lineWidth(2)
            doc.lineCap('butt')
            .moveTo(25, docy-5)
            .lineTo(pwidth-25, docy-5)
            .stroke()
        }
        doc.text(obj.heading, docx, docy, {
            width: doc.page.width*0.5, 
            'align': 'left',
            'lineGap ': 10
        })
     
        if(obj.isMainHeading){
            doc.lineCap('butt')
            .moveTo(25, doc.y+2)
            .lineTo(pwidth-25, doc.y+2)
            .stroke()
            .lineWidth(3)
        }
    
        if(obj.isSubHeading){
            doc.lineWidth(2)
            doc.lineCap('butt')
            .moveTo(25, doc.y+2)
            .lineTo(pwidth-25, doc.y+2)
            .stroke()
        }
        doc.lineWidth(1);
    
        if(obj.showSubheading){
            doc.text("Quantity", pwidth*0.55, docy, {
                width: doc.page.width*0.10, 
                'align': 'center',
                'lineGap ': 10
                })
            doc.text("Unit Cost", pwidth*0.65, docy, {
                width: doc.page.width*0.175, 
                'align': 'center',
                'lineGap ': 10
                })
            doc.text("Total Cost", pwidth*0.825, docy, {
                width: doc.page.width*0.175, 
                'align': 'center',
                'lineGap ': 10
                })
        } 
        if (obj.showItemheading){
            doc.text("Item", pwidth*0.43, docy, {
                width: doc.page.width*0.10, 
                'align': 'center',
                'lineGap ': 10
                })
        }
    
        if(obj.istotalValSize) doc.fontSize(obj.istotalValSize);
        if(obj.istotalValStyle) doc.font('Helvetica-Bold');
        if(obj.istotal)
        {
            doc.text("Php "+obj.istotalVal, pwidth*0.825-25, docy, {
                width: doc.page.width*0.175, 
                'align': 'right',
                'lineGap ': 10
                })
            
        }
    
        if(obj.istotalValSize) doc.fontSize(10);
        if(obj.istotalValStyle) doc.font('Helvetica');
    
        if(obj.content){
            for( var i=0; i < obj.content.length; i++){
            if(i == 0) docy = doc.y+10;
            else docy = doc.y
            
            
            if(obj.content[i].formalname && obj.content[i].formalname == 'stator-complete-rewinding')
            {
                doc.text('- Complete Stator Coil Rewinding Package (Includes the following:)', docx, docy, {
                    width: doc.page.width*0.5, 
                    'align': 'left',
                    'lineGap ': 10
                    })
                 doc.text(obj.content[i].qty, pwidth*0.55, docy, {
                    width: doc.page.width*0.10, 
                    'align': 'center',
                    'lineGap ': 10
                    })
                doc.text(obj.content[i].unitcost, pwidth*0.65, docy, {
                    width: doc.page.width*0.175, 
                    'align': 'center',
                    'lineGap ': 10
                    })
                doc.text('Php ' + obj.content[i].totalcost, pwidth*0.825, docy, {
                    width: doc.page.width*0.175, 
                    'align': 'center',
                    'lineGap ': 10
                    })
                
                
                doc.text('  - Stator coil Rewinding ', docx+10, doc.y+5, {
                    width: doc.page.width*0.5, 
                    'align': 'left',
                    'lineGap ': 10
                    })
                doc.text('  - Surge Comparison Hi-pot Testing ', docx+10, doc.y+5, {
                    width: doc.page.width*0.5, 
                    'align': 'left',
                    'lineGap ': 10
                    })
                doc.text('  - Polarization and Resistance Test ', docx+10, doc.y+5, {
                    width: doc.page.width*0.5, 
                    'align': 'left',
                    'lineGap ': 10
                    })
                doc.text('  - Varnishing and Baking ', docx+10, doc.y+5, {
                    width: doc.page.width*0.5, 
                    'align': 'left',
                    'lineGap ': 10
                    })
                doc.text('  - Cleaning and Painting of Unit ', docx+10, doc.y+5, {
                    width: doc.page.width*0.5, 
                    'align': 'left',
                    'lineGap ': 10
                    })
            }
            else if(obj.content[i].formalname && obj.content[i].formalname == 'stator-complete-recon')
            {
                doc.text('- Complete Stator Coil Rewinding Package (Includes the following:)', docx, docy, {
                    width: doc.page.width*0.5, 
                    'align': 'left',
                    'lineGap ': 10
                    })
                 doc.text(obj.content[i].qty, pwidth*0.55, docy, {
                    width: doc.page.width*0.10, 
                    'align': 'center',
                    'lineGap ': 10
                    })
                doc.text(obj.content[i].unitcost, pwidth*0.65, docy, {
                    width: doc.page.width*0.175, 
                    'align': 'center',
                    'lineGap ': 10
                    })
                doc.text(obj.content[i].totalcost, pwidth*0.825, docy, {
                    width: doc.page.width*0.175, 
                    'align': 'center',
                    'lineGap ': 10
                    })
                
                
                doc.text('(Includes all stated above EXCEPT Stator  coil Rewinding)', docx+10, doc.y+5, {
                    width: doc.page.width*0.5, 
                    'align': 'left',
                    'lineGap ': 10
                    })
            }
            else {
               
                
                if(obj.content[i].item){
                     doc.text('- '+obj.content[i].name , docx, docy, {
                    width: doc.page.width*0.35, 
                    'align': 'left',
                    'lineGap ': 10
                    })
                    
                    doc.text(obj.content[i].item, doc.page.width*0.40, docy, {
                    width: doc.page.width*0.15, 
                    'align': 'center',
                    'lineGap ': 10
                    })
                
                } else {
                     doc.text('- '+obj.content[i].name, docx, docy, {
                    width: doc.page.width*0.40, 
                    'align': 'left',
                    'lineGap ': 10
                    })
                    
                }
               
               
               
                // if(docy > 970){
                //     docy = 25
                // }
               
                
              doc.text(obj.content[i].qty, pwidth*0.55, docy, {
                width: doc.page.width*0.10, 
                'align': 'center',
                'lineGap ': 10
                })
              
                doc.text(obj.content[i].unitcost, pwidth*0.65, docy, {
                    width: doc.page.width*0.175, 
                    'align': 'center',
                    'lineGap ': 10
                    })
                doc.text(obj.content[i].totalcost, pwidth*0.825, docy, {
                    width: doc.page.width*0.175, 
                    'align': 'center',
                    'lineGap ': 10
                    })
                
                }
            
            if(i != obj.content.length-1)
            {
                doc.moveDown();
                doc.lineCap('butt')
                .moveTo(25, doc.y-5)
                .lineTo(pwidth-25, doc.y-5)
                .stroke()
            }
           
           
            if(obj.middleLineHeight)
            {
                if(i == 0)
                {
                    
                    doc.lineWidth(1);
                    doc.lineCap('butt')
                    .moveTo(doc.page.width*0.6-35, docy+155)
                    .lineTo(doc.page.width*0.6-35, docy-50)
                    .stroke()
                }
            } else {
                doc.lineWidth(1);
                doc.lineCap('butt')
                .moveTo(doc.page.width*0.6-35, docy+17)
                .lineTo(doc.page.width*0.6-35, docy-6)
                .stroke()
                
            }
            
            }
            
        }
    
    }

    doc.end();
}



exports.createQuotationPDF = createQuotationPDF;