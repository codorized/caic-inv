// create a document and pipe to a blob
const doc = new PDFDocument({size: [612.00, 396.00], margins : { 
    top: 25, 
    bottom: 25,
    left: 25,
    right: 25
},});
var stream = doc.pipe(blobStream());
var docy;

doc.fontSize(12);
doc.text("CALAMBA ALLIED INDUSTRIAL CORPORATION", {
'align': 'center',
'lineGap ': 5
}).fontSize(10);
doc.moveDown();
doc.text("MAIN OFFICE: CAIC BUILDING SAN CRISTOBAL, CALAMBA CITY, LAGUNA", doc.x, doc.y-10, {
'align': 'center'
}).fontSize(10);
doc.moveDown();
doc.moveDown();
doc.text("REQUISITION AND ISSUANCE SLIP", doc.x, doc.y-10, {
'align': 'center'
}).fontSize(10);
doc.moveDown();
docy = doc.y
doc.text("CUSTOMER: ____________________________________________", 25, doc.y, {
 width: doc.page.width*0.75, 
'align': 'left'
}).fontSize(10);
doc.text("J.O#: ________________", doc.page.width*0.70, docy, { 
 width: doc.page.width*0.25, 
'align': 'left'
}).fontSize(10);

docy = doc.y
doc.text("ADDRESS: ____________________________________________", 25, doc.y, {
 width: doc.page.width*0.75, 
'align': 'left'
}).fontSize(10);
doc.text("DATE: ________________", doc.page.width*0.70, docy, { 
 width: doc.page.width*0.25, 
'align': 'left'
}).fontSize(10);

doc.text("______________________________________________________________________________________________________", 25, doc.y, { 
 width: doc.page.width, 
'align': 'left'
}).fontSize(10);
doc.moveDown(1);

docy = doc.y
doc.text("ITEMS", 0, doc.y, { 
 width: doc.page.width*0.20, 
'align': 'center'
}).fontSize(10);

doc.text("QTY\nRECD", doc.page.width*0.20, docy-5, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("QTY\nRET", doc.page.width*0.20 + doc.page.width*0.075, docy-5, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("QTY\nUSED", doc.page.width*0.20 + (doc.page.width*0.075)*2, docy-5, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("AMT", doc.page.width*0.20 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.5, docy-5, { 
 width: doc.page.width*0.15, 
'align': 'center'
}).fontSize(10);

doc.text("QTY\nRECD", doc.page.width*0.5 + doc.page.width*0.15, docy-5, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("QTY\nRET", doc.page.width*0.5+  doc.page.width*0.15 + doc.page.width*0.075, docy-5, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("QTY\nUSED",doc.page.width*0.5 + doc.page.width*0.15 + (doc.page.width*0.075)*2, docy-5, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("AMT", doc.page.width*0.5+doc.page.width*0.15 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("______________________________________________________________________________________________________", 25, doc.y, { 
 width: doc.page.width, 
'align': 'left'
}).fontSize(10);

doc.moveDown(0.5);

docy = doc.y

doc.rect(25, docy-1, 10, 10).lineWidth(1).stroke();

doc.text("     M.W.# _____", 25, doc.y, { 
 width: doc.page.width*0.15, 
'align': 'left'
}).fontSize(10);

doc.text("", doc.page.width*0.15, docy, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + doc.page.width*0.075, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*2, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.rect(doc.page.width*0.5, docy-1, 10, 10).lineWidth(1).stroke();
doc.text("     SHAFT SEAL OVERLOAD",  doc.page.width*0.5, docy, { 
 width: doc.page.width*0.15, 
'align': 'left'
}).fontSize(10);


doc.moveDown(0.5);
docy = doc.y

doc.rect(25, docy-1, 10, 10).lineWidth(1).stroke();

doc.text("     M.W.# _____", 25, doc.y, { 
 width: doc.page.width*0.15, 
'align': 'left'
}).fontSize(10);

doc.text("", doc.page.width*0.15, docy, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + doc.page.width*0.075, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*2, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.moveDown();
doc.moveDown(0.5);
docy = doc.y

doc.rect(25, docy-1, 10, 10).lineWidth(1).stroke();

doc.text("     BEARING# ___", 25, doc.y, { 
 width: doc.page.width*0.15, 
'align': 'left'
}).fontSize(10);

doc.text("", doc.page.width*0.15, docy, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + doc.page.width*0.075, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*2, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.moveDown();
doc.moveDown(0.5);
docy = doc.y
doc.rect(25, docy-1, 10, 10).lineWidth(1).stroke();

doc.text("     BEARING# ___", 25, doc.y, { 
 width: doc.page.width*0.15, 
'align': 'left'
}).fontSize(10);


doc.text("", doc.page.width*0.15, docy, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + doc.page.width*0.075, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*2, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.moveDown();
doc.moveDown(0.5);
docy = doc.y
doc.rect(25, docy-1, 10, 10).lineWidth(1).stroke();
doc.text("     TUBING# _____", 25, doc.y, { 
 width: doc.page.width*0.15, 
'align': 'left'
}).fontSize(10);

doc.text("", doc.page.width*0.15, docy, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + doc.page.width*0.075, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*2, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.moveDown();
doc.moveDown(0.5);
docy = doc.y
doc.rect(25, docy-1, 10, 10).lineWidth(1).stroke();
doc.text("CAPILLA OIL CAPACITOR", 25+15, doc.y, { 
 width: doc.page.width*0.15, 
'align': 'left'
}).fontSize(10);

doc.text("", doc.page.width*0.15, docy, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + doc.page.width*0.075, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*2, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.moveDown();
doc.moveDown();
doc.moveDown(0.5);
docy = doc.y
doc.rect(25, docy-1, 10, 10).lineWidth(1).stroke();
doc.text("     ____mid____", 25, doc.y, { 
 width: doc.page.width*0.15, 
'align': 'left'
}).fontSize(10);

doc.text("", doc.page.width*0.15, docy, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + doc.page.width*0.075, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*2, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.moveDown();
doc.moveDown(0.5);
docy = doc.y
doc.rect(25, docy-1, 10, 10).lineWidth(1).stroke();
doc.text("     BOLTS & NUTS", 25, doc.y, { 
 width: doc.page.width*0.15, 
'align': 'left'
}).fontSize(10);

doc.text("", doc.page.width*0.15, docy, { 
 width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + doc.page.width*0.075, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*2, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);
doc.text("", doc.page.width*0.15 + (doc.page.width*0.075)*3, docy, { 
width: doc.page.width*0.075, 
'align': 'center'
}).fontSize(10);

// doc.lineWidth(1);
// doc.lineCap('butt')
// .moveTo(doc.page.width*0.6-35, doc.y+5)
// .lineTo(doc.page.width*0.6-35, doc.y-229)
// .stroke()



// end and display the document in the iframe to the right
doc.end();
stream.on('finish', function() {
  iframe.src = stream.toBlobURL('application/pdf');
});