const createQuotationPDF = (fs, doc, pdfURL) => {
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
    doc.text("TAG#: ", doc.page.width*2/3+25, doc.y-20, {
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
    
    doc.text("Customer: ", 25, docy, {
        width: doc.page.width*0.4, 
    'align': 'left',
    'lineGap ': 10
    }).text("Address/Location: ",{
    'align': 'left',
    }).text("Contact Person: ",{
    'align': 'left',
    })
    .text("Project Title: ",{
    'align': 'left',
    });
    
    
    doc.moveDown();
    doc.text("Sales Rep: ", doc.page.width*0.6, docy, {
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
    doc.text("Motor Name: ", 25, docy, {
        width: doc.page.width*0.4, 
    'align': 'left',
    'lineGap ': 10
    }).text("Capacity  Rating: ",{
    'align': 'left',
    }).text("Current: ",{
    'align': 'left',
    })
    .text("Project Title: ",{
    'align': 'left',
    });

    doc.moveDown();
    doc.text("Voltage: ", doc.page.width*0.6, docy, {
        width: doc.page.width*0.3, 
    'align': 'left',
    'lineGap ': 10
    }).text("Speed (rpm): ",{
    'align': 'left',
    }).text("Q-no.2020: ",{
    'align': 'left',
    }).text("Phase: ",{
    'align': 'left',
    }).text("Frequency: ", doc.page.width*0.6+100, doc.y-13, {
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
    
    categ({
        heading: 'A. Stator  Assembly',
        showSubheading: false,
        isSubHeading: true,
        middleLineHeight: 10,
         content: [
        {
            name: 'Inspection and Checking of unit and Data Recording',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
          {
              name: 'stator-complete',
              qty: '1.00' + ' lot',
              unitcost: '1.00',
              totalcost: 'Php ' + '3,000'
          },
        {
              name: 'Complete Reconditioning Package (Includes all stated above EXCEPT Stator  coil Rewinding)',
              qty: '1.00' + ' lot',
              unitcost: '1.00',
              totalcost: 'Php ' + '3,000'
          }
            ]
    }, doc.x, doc.y+10)
   
   
  //  doc.lineWidth(1);
  //   doc.lineCap('butt')
  //   .moveTo(doc.page.width*0.6-35, doc.y+15)
  //   .lineTo(doc.page.width*0.6-35, doc.y-149)
  //   .stroke()
      
   categ({
        heading: 'B. Accessories',
        showSubheading: false,
        showItemheading: true,
        isSubHeading: true,
        isInsideSubHeading: true,
         content: [
        {
            name: 'Replacement  of bearing (Load Side)',
            item: '6310 zz',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Replacement  of bearing (Fan Side)',
            item: '6310 zz',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Replacement  of bearing (Gear Box)',
            item: '6206 ZZ',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Replacement  of bearing (Gear Box)',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Replacement  of bearing (Gear Box)',
           
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Replacement  of bearing (Gear Box)',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Replacement  of bearing (Gear Box)',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Replacement  of Running Capacitor',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Replacement  of Both Fan Blade',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Supply of Oil Seal',
            item: '25X40X7',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        
        
            ]
    }, 25, doc.y+20)
  
  // doc.lineWidth(1);
  //   doc.lineCap('butt')
  //   .moveTo(doc.page.width*0.6-35, doc.y+5)
  //   .lineTo(doc.page.width*0.6-35, doc.y-229)
  //   .stroke()
   
   
  categ({
        heading: 'C. Mechanical',
        showSubheading: false,
        showItemheading: false,
        isSubHeading: true,
        isInsideSubHeading: true,
         content: [
        {
            name: 'Fabrication of Fan Cover',
           
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Fabrication of Terminal Cover',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Welding of Endplate',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Fabrication of Terminal Post',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Supply of Gear Oil',
           
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Fabrication of Adaptor Cable',
            
            qty: '1.00' + 'lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Fabrication of Shafting including Alignment',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Replacement of Flange Coupling including Reboring',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Build up and Machining of Shafting',
            
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Welding of Motor Base',
            item: '25X40X7',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Reboring of Bearing Housing',
            item: '25X40X7',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
        {
            name: 'Sleeving of Bearing Housing',
            item: '25X40X7',
            qty: '1.00' + ' lot',
            unitcost: '1.00',
            totalcost: 'Php ' + '1.00'
        },
            ]
    }, 25, doc.y+10);
   
   
    
  
    categ({
            heading: 'D. Dynamic balancing of',
            showSubheading: false,
            showItemheading: false,
            isSubHeading: true,
            isInsideSubHeading: true,
            content: [
                {
                    name:'Blower',
                    qty: '1.00' + ' lot',
                    unitcost: '1.00',
                    totalcost: 'Php ' + '1.00'
                    
                    
                }]
        }, 25, doc.y+10)
    
    categ({
            heading: 'E. Miscelleneous',
            showSubheading: false,
            showItemheading: false,
            isSubHeading: true,
            isInsideSubHeading: true,
            content: [
                {
                    name:'Supply of Oil Seal (Gear Box Side) 30x62x10',
                    qty: '1.00' + ' pc',
                    unitcost: 'Php 325.00',
                    totalcost: 'Php 325.00',
                    
                    
                }]
        }, 25, doc.y+10)
    
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
    
            if(obj.content[i].name == 'stator-complete')
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
               
               
               
                if(docy > 970){
                    docy = 25
                
                }
                
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