                // create a document and pipe to a blob
                const doc = new PDFDocument({size: 'LEGAL', margins : { 
                    top: 25, 
                    bottom: 25,
                    left: 25,
                    right: 25
                },});
                
                var stream = doc.pipe(blobStream());
                
                doc.fontSize(10);
                doc.text("DATE RECEIVED: ", {
                    'align': 'right'
                }).fontSize(15);
                doc.moveDown();
                doc.text("CALAMBA ALLIED INDUSTRIAL CORPORATION", {
                'align': 'center',
                'lineGap ': 5
                }).fontSize(10);
                doc.moveDown();
                doc.text("MAIN OFFICE: CAIC BUILDING SAN CRISTOBAL, CALAMBA CITY, LAGUNA", doc.x, doc.y-10, {
                'align': 'center'
                }).fontSize(12);
                doc.moveDown();
                doc.text("INDIVIDUAL ACCOMPLISHMENT REPORT", doc.x, doc.y, {
                'align': 'center'
                }).fontSize(10);
                
                var docy = doc.y+10;
                var docx = doc.x;
                var pwidth = doc.page.width;
                
                doc.moveDown();
                doc.text("CUSTOMER: ", {
                 width: doc.page.width/3, 
                'align': 'left',
                'lineGap ': 10
                }).text("ADDRESS: ",{
                'align': 'left',
                }).text("P.O. NO.: ",{
                'align': 'left',
                });
                
                doc.moveDown();
                doc.text("SALES REP: ", doc.page.width/3+25, docy, {
                 width: doc.page.width/3, 
                'align': 'left',
                'lineGap ': 10
                }).text("GATE PASS: ",{
                'align': 'left',
                }).text("P.R. NO.: ",{
                'align': 'left',
                });
                
                doc.moveDown();
                doc.text("J.O. NO: ", doc.page.width*2/3+25, docy, {
                 width: doc.page.width/3, 
                'align': 'left',
                'lineGap ': 10
                }).text("R.I.S. NO: ",{
                'align': 'left',
                }).text("DATE REQ'D: ",{
                'align': 'left',
                });
                
                docy = doc.y+10;
                docx = doc.x;
                
                doc.moveDown();
                doc.roundedRect(pwidth*(1/6)+25, doc.y+5, 60, 15)
                doc.stroke();
                doc.text("RUSH ", pwidth*(1/6)+25+65, doc.y+10, {
                 width: pwidth/2, 
                'align': 'left',
                'lineGap ': 10
                })
                
                doc.moveDown();
                doc.roundedRect(pwidth*(1/2)+25, docy+6, 60, 15)
                doc.stroke();
                doc.text("NORMAL ", pwidth*(1/2)+25+65, docy+10, {
                 width: pwidth/2, 
                'align': 'left',
                'lineGap ': 10
                })
                
                doc.moveDown();
                
                doc.fontSize(15);
                doc.moveDown();
                doc.text("MOTOR SPECIFICATION", 25, doc.y, {
                'align': 'center',
                'lineGap ': 5
                })
                doc.fontSize(10);
                doc.moveDown();
                
                docy = doc.y+10;
                docx = doc.x;
                
                doc.moveDown();
                doc.text("NAME: ", {
                 width: doc.page.width/3, 
                'align': 'left',
                'lineGap ': 10
                }).text("AS PER GATE PASS: ", doc.x+40, doc.y, {
                'align': 'left',
                })
                doc.lineCap('butt')
                    .moveTo(docx+35, doc.y-15)
                    .lineTo(180, doc.y-15)
                    .stroke();
                
                doc.moveDown();
                doc.roundedRect(pwidth*(1/3), docy-10,pwidth/3-8,25)
                doc.stroke().text('HP', pwidth*(1/3)+5, docy-5, {
                    'align': 'left',
                })
                
                doc.moveDown();
                doc.roundedRect(pwidth*(2/3)-8, docy-10, pwidth/3-8, 25)
                doc.stroke().text('K.W.', pwidth*(2/3)+5-8, docy-5, {
                    'align': 'left'
                })
                
                doc.moveDown();
                
                docy = doc.y+20;
                pwidth = doc.page.width-50;
                doc.text("RPM: ", 25, docy, {
                 width: doc.page.width/4, 
                'align': 'left',
                'lineGap ': 10
                })
                doc.lineCap('butt')
                    .moveTo(docx+35, doc.y-5)
                    .lineTo(150, doc.y-5)
                    .stroke()
                    
                doc.text("TYPE: ", 25, docy+20, {
                 width: doc.page.width/4, 
                'align': 'left',
                'lineGap ': 10
                })
                doc.lineCap('butt')
                    .moveTo(docx+35, doc.y-5)
                    .lineTo(150, doc.y-5)
                    .stroke()
                    
                doc.text("RPM: ", pwidth/4+25, docy, {
                 width: doc.page.width/4, 
                'align': 'left',
                'lineGap ': 10
                })
                doc.lineCap('butt')
                    .moveTo(pwidth/4+25+30, doc.y-5)
                    .lineTo(pwidth/4+145, doc.y-5)
                    .stroke()
                    
                doc.text("TYPE: ",  pwidth/4+25, docy+20, {
                 width: doc.page.width, 
                'align': 'left',
                'lineGap ': 10
                })
                doc.lineCap('butt')
                    .moveTo(pwidth/4+25+30, doc.y-5)
                    .lineTo(pwidth/4+145, doc.y-5)
                    .stroke()
                    
                    
                doc.text("RPM: ", pwidth*1/2+25, docy, {
                 width: doc.page.width/2, 
                'align': 'left',
                'lineGap ': 10
                })
                doc.lineCap('butt')
                    .moveTo(pwidth*1/2+25+30, doc.y-5)
                    .lineTo(pwidth*1/2+145, doc.y-5)
                    .stroke()
                    
                doc.text("TYPE: ",  pwidth*1/2+25, docy+20, {
                 width: doc.page.width/2, 
                'align': 'left',
                'lineGap ': 10
                })
                doc.lineCap('butt')
                    .moveTo(pwidth*1/2+25+30, doc.y-5)
                    .lineTo(pwidth*1/2+145, doc.y-5)
                    .stroke()
                
                doc.text("RPM: ", pwidth*3/4+25, docy, {
                 width: doc.page.width/2, 
                'align': 'left',
                'lineGap ': 10
                })
                doc.lineCap('butt')
                    .moveTo(pwidth*3/4+25+30, doc.y-5)
                    .lineTo(pwidth*3/4+145, doc.y-5)
                    .stroke()
                    
                doc.text("TYPE: ",  pwidth*3/4+25, docy+20, {
                 width: doc.page.width*2/32, 
                'align': 'left',
                'lineGap ': 10
                })
                doc.lineCap('butt')
                    .moveTo(pwidth*3/4+25+30, doc.y-5)
                    .lineTo(pwidth*3/4+145, doc.y-5)
                    .stroke()
                
              doc.moveDown();
              doc.lineCap('butt')
                .moveTo(25, doc.y)
                .lineTo(pwidth+25, doc.y)
                .stroke()
                
                docy = doc.y+10;
                docx = 25;
                
                doc.moveDown();
                doc.text("BACKJOB", 25, doc.y, {
                 width: doc.page.width/3, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                doc.text("FINDINGS", pwidth/3+25, docy, {
                 width: doc.page.width/3-25, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                doc.text("ORIGINAL WIRE (SAMPLE)", pwidth*2/3+25, docy, {
                 width: doc.page.width/3, 
                'align': 'center',
                'lineGap ': 10
                })
                
                
                doc.moveDown();
                doc.lineCap('butt')
                .moveTo(25, doc.y-5)
                .lineTo(pwidth+25, doc.y-5)
                .stroke()
                
                doc.moveDown();
                
                pwidth = doc.page.width-50;
                doc.text("DATE REWIND: ", 25, doc.y-5, {
                 width: doc.page.width/4, 
                'align': 'left',
                'lineGap ': 10
                }).text("REWINDER: ", 25, doc.y+5, {
                 width: doc.page.width/4, 
                'align': 'left',
                'lineGap ': 10
                }).text("INV NO.: ", 25, doc.y+5, {
                 width: doc.page.width/4, 
                'align': 'left',
                'lineGap ': 10
                })
               
               
                doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y-5)
                .lineTo(pwidth+25, doc.y-5)
                .stroke()
                
                docy = doc.y;
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(pwidth/3+25, docy-5)
                .lineTo(pwidth/3+25, docy-68)
                .stroke()
                
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(pwidth*2/3+25, docy-5)
                .lineTo(pwidth*2/3+25, docy-68)
                .stroke()     
                
                
                docy = doc.y-10;
                docx = 25;
                
                doc.moveDown();
                doc.text("ORIGINAL DATA RECORD", 0, docy-5, {
                 width: doc.page.width*0.6, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                doc.text("ORIGINAL TEST REPORT", pwidth*0.6, docy-5, {
                 width: doc.page.width*0.4, 
                'align': 'center',
                'lineGap ': 10
                })
                
                
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y-5)
                .lineTo(pwidth+25, doc.y-5)
                .stroke()
                
                docx = doc.x
                docy = doc.y
                
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("LENGTH", 25, doc.y+10, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("OUTSIDE DIA", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("INSIDE DIA", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("SLOTS", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("# OF COIL GROUP", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("GROUPS", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("SPANS", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("TURNS", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("SIZE OF WIRE", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                })
                
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y)
                .lineTo(pwidth+25, doc.y)
                .stroke()
                
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("ROTOR", pwidth*0.2, docy+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                .text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("STATOR", pwidth*0.4, docy+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                .text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                
                 
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(pwidth*0.6, docy-5)
                .lineTo(pwidth*0.6, docy)
                .stroke()
                
                doc.fontSize(11)
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("COIL RESISTANCE_________________OHMS", pwidth*0.6+10, docy+5, {
                 width: doc.page.width*0.40, 
                'align': 'left',
                'lineGap ': 10
                }).text("INSUL RESISTANCE________________OHMS", pwidth*0.6+10, doc.y+5, {
                 width: doc.page.width*0.40, 
                'align': 'left',
                'lineGap ': 10
                })
                
                doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(pwidth*0.6, doc.y-85)
                .lineTo(pwidth*0.6, doc.y+345)
                .stroke()
                
                docy = doc.y
                
                doc.fontSize(11)
                doc.text("AMP. W/O LOAD", pwidth*0.6, doc.y+15, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("AT_________VOLTS", pwidth*0.6, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L1_________AMPS", pwidth*0.6, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L2_________AMPS", pwidth*0.6, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L3_________AMPS", pwidth*0.6, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("AMP W/ LOAD", pwidth*0.8+25, docy+15, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("AT_________VOLTS", pwidth*0.8+25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L1_________AMPS", pwidth*0.8+25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L2_________AMPS", pwidth*0.8+25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L3_________AMPS", pwidth*0.8+25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                
                docy = doc.y+50;
                docx = 25;
                doc.fontSize(10);
                doc.moveDown();
                doc.text("REVISION DATA RECORD", 0, docy-5, {
                 width: doc.page.width*0.6, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                doc.text("REVISION TEST REPORT", pwidth*0.6, docy-5, {
                 width: doc.page.width*0.4, 
                'align': 'center',
                'lineGap ': 10
                })
                
                
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y-5)
                .lineTo(pwidth+25, doc.y-5)
                .stroke()
                
                docx = doc.x
                docy = doc.y
                
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("LENGTH", 25, doc.y+10, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("OUTSIDE DIA", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("INSIDE DIA", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("SLOTS", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("# OF COIL GROUP", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("GROUPS", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("SPANS", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("TURNS", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                }).text("SIZE OF WIRE", 25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'left',
                'lineGap ': 10
                })
                
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y)
                .lineTo(pwidth+25, doc.y)
                .stroke()
                
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("________________", pwidth*0.2, docy+20, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                .text("________________", pwidth*0.2, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("________________", pwidth*0.4, docy+20, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                .text("________________", pwidth*0.4, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                
                
                doc.fontSize(11)
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("COIL RESISTANCE_________________OHMS", pwidth*0.6+10, docy+5, {
                 width: doc.page.width*0.40, 
                'align': 'left',
                'lineGap ': 10
                }).text("INSUL RESISTANCE________________OHMS", pwidth*0.6+10, doc.y+5, {
                 width: doc.page.width*0.40, 
                'align': 'left',
                'lineGap ': 10
                })
                
                doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(pwidth*0.6, doc.y-5)
                .lineTo(pwidth+25, doc.y-5)
                .stroke()
                
                docy = doc.y
                
                doc.fontSize(11)
                doc.text("AMP. W/O LOAD", pwidth*0.6, doc.y+15, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("AT_________VOLTS", pwidth*0.6, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L1_________AMPS", pwidth*0.6, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L2_________AMPS", pwidth*0.6, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L3_________AMPS", pwidth*0.6, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                pwidth = doc.page.width-50;
                doc.text("AMP W/ LOAD", pwidth*0.8+25, docy+15, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("AT_________VOLTS", pwidth*0.8+25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L1_________AMPS", pwidth*0.8+25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L2_________AMPS", pwidth*0.8+25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                }).text("L3_________AMPS", pwidth*0.8+25, doc.y+5, {
                 width: doc.page.width*0.20, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                docy = doc.y+35;
                docx = 25;
                doc.fontSize(10);
                doc.moveDown();
                doc.text("MATERIALS USED", 0, docy-5, {
                 width: doc.page.width*0.6, 
                'align': 'center',
                'lineGap ': 10
                })
                
                doc.moveDown();
                doc.text("REVISION WIRE / SAMPLE", pwidth*0.6, docy-5, {
                 width: doc.page.width*0.4, 
                'align': 'center',
                'lineGap ': 10
                })
                
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y-5)
                .lineTo(pwidth+25, doc.y-5)
                .stroke()
                docy = doc.y-15
                pwidth = doc.page.width-50;
                
                doc.text("QTY", 0, docy+20, {
                 width: doc.page.width*0.15, 
                'align': 'center',
                'lineGap ': 10
                })
                
                pwidth = doc.page.width-50;
                doc.text("ITEM/S", pwidth*0.15-10, docy+20, {
                 width: doc.page.width*0.30, 
                'align': 'center',
                'lineGap ': 10
                })        
                
                pwidth = doc.page.width-50;
                doc.text("COST", pwidth*0.45, docy+20, {
                 width: doc.page.width*0.15, 
                'align': 'center',
                'lineGap ': 10
                })  
                 
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y-5)
                .lineTo(pwidth*0.6, doc.y-5)
                .stroke()
              
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y)
                .lineTo(pwidth*0.6, doc.y)
                .stroke()
    
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y+3)
                .lineTo(pwidth*0.6, doc.y+3)
                .stroke()
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y+5)
                .lineTo(pwidth*0.6, doc.y+5)
                .stroke()
                
                doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(25, doc.y-80)
                .lineTo(25, doc.y-7)
                .stroke()
                
                 docy = doc.y
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(pwidth*0.6, docy-80)
                .lineTo(pwidth*0.6, docy-6)
                .stroke()
                
                 doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(pwidth*0.45, docy-80)
                .lineTo(pwidth*0.45, docy-6)
                .stroke()
                
                doc.moveDown();
                 doc.lineCap('butt')
                .moveTo(pwidth*0.15, docy-80)
                .lineTo(pwidth*0.15, docy-6)
                .stroke()
                
                // end and display the document in the iframe to the right
                doc.end();
                stream.on('finish', function() {
                iframe.src = stream.toBlobURL('application/pdf');
                });