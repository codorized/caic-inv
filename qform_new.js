
var externalDataRetrievedFromServer = [
    { name: 'Dismantling and Installation ', qty: 34, unit: 1, total: 4000 },
    { name: 'Dismantling and Installation ', qty: 34, unit: 1, total: 4000 },
    { name: 'Dismantling and Installation ', qty: 34, unit: 1, total: 4000 }
   
];

function buildTableBody(data, columns) {
    var body = [];

    data.forEach(function(row) {
        var dataRow = [];

        columns.forEach(function(column) {
            dataRow.push(row[column].toString());
        })

        body.push(dataRow);
    });

    return body;
}

function table(data, columns) {
    return {
        table: {
            headerRows: 0,
            body: buildTableBody(data, columns),
            widths: ['50%', '16.65%', '16.65%', '16.65%'],
            fontSize: 10,
        },
        fontSize: 10,
		layout: {
			fillColor: function (rowIndex, node, columnIndex) {
				return (rowIndex % 2 !== 0) ? '#e3e3e3' : null;
			}
		}
    };
}

var dd = {
    pageSize: 'FOLIO',
     pageMargins: 25,
  
	content: [
	    {
           text:'FORM REVISION (SEPT. 2020) AKCOM',
		    alignment: 'right',
		    margin: [0, 0, 0, 8],
		    fontSize: 10
            
        },
	    {
           text:'CALAMBA ALLIED INDUSTRIAL CORPORATION',
		    alignment: 'center',
		    bold: true,
		    fontSize: 13
            
        },
        {
           text:'Lakeshore Subd. Bay, Laguna',
		    alignment: 'center',
		    fontSize: 10
            
        },
        {
           text:'Telefax: +63495317085 to 86',
		    alignment: 'center',
		    fontSize: 10
            
        },
        {
           text:'www.caic.com.ph',
		    alignment: 'center',
		    fontSize: 10
            
        },
		{
		    text:'GENERAL CONTRACTOR',
		    alignment: 'center',
		    color: 'red',
		    fontSize: 12
		    
		},
		{
		    text:'CIVIL *** MECHANICAL *** ELECTRICAL',
		    alignment: 'center',
		    fontSize: 12
		    
		},
		{
		    text:'TAG#: ',
		    alignment: 'center',
		    margin: [300, -10, 0, 0],
		    fontSize: 10 
		    
		},
		{
           canvas: 
           [
               {
                   type: 'line',
                   x1: 0, y1: 10,
                   x2: 560, y2: 10,
                   lineWidth: 2,
                   
               }
           ],
           margin: [0, 0,0,5]
        },
		{
		    columns: [
    		    {
    		        text:'Customer:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '60%',
        		    margin: [0, 5, 0, -20]
    		    },
    		    {
    		        text:'Sales Rep:',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '40%'
    		    }
		    ],
		    margin: [0, 0, 0, -10]
		},
		{
		    columns: [
    		    {
    		        text:'',
        		   
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '60%'
    		    },
    		    {
    		        text:'TIN#:',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '40%'
    		    }
		    ],
		    margin: [0, 10, 0, 0]
		},
		{
		    columns: [
    		    {
    		        text:'Address/Location:',
        		   
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '60%'
    		    },
    		    {
    		        text:'Q-no.2021:',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '40%'
    		    }
		    ],
		    margin: [0, 0, 0, 0]
		},
		{
		    columns: [
    		    {
    		        text:'Contact Person:',
        		   
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '60%'
    		    },
    		    {
    		        text:'Gate Pass #:',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '40%'
    		    }
		    ],
		    margin: [0, 0, 0, 0]
		},
		{
           canvas: 
           [
               {
                   type: 'line',
                   x1: 0, y1: 10,
                   x2: 560, y2: 10,
                   lineWidth: 2,
                   
               }
           ],
           margin: [0, -5,0,5]
        },
        {
           text:'INDUSTRIAL MOTOR SPECIFICATIONS AND RATING CAPACITY',
		    alignment: 'center',
		    bold: true,
		    fontSize: 12
            
        },
		{
           canvas: 
           [
               {
                   type: 'line',
                   x1: 0, y1: 10,
                   x2: 560, y2: 10,
                   lineWidth: 2,
                   
               }
           ],
           margin: [0, -5,0,5]
        },
        ,
		{
		    columns: [
    		    {
    		        text:'Motor Name:',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '60%'
    		    },
    		    {
    		        text:'Speed (rpm):',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '40%'
    		    }
		    ],
		    margin: [0, 0, 0, 0]
		},
		{
		    columns: [
    		    {
    		        text:'Capacity Rating:',
        		   
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '60%'
    		    },
    		    {
    		        text:'Phase:',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '40%'
    		    }
		    ],
		    margin: [0, 0, 0, 0]
		},
		{
		    columns: [
    		    {
    		        text:'Current:',
        		   
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '60%'
    		    },
    		    {
    		        text:'Frequency:',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '40%'
    		    }
		    ],
		    margin: [0, 0, 0, 0]
		},
		{
		    columns: [
    		    {
    		        text:'Voltage:',
        		   
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '60%'
    		    },
    		    {
    		        text:'',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '40%'
    		    }
		    ],
		    margin: [0, 0, 0, 5]
		},
		{
		    table: {
				widths: ['50%', '16.65%', '16.65%', '16.65%'],
				margin: [0, 5, 0, 15],
				body: [
					[ {text:'I. GENERAL REQUIREMENTS', alignment: 'left',fontSize: 10, fillColor: '#181818', color: 'white', bold: true}, {text: 'QTY', fillColor: '#181818', color: 'white', bold: true}, {text: 'UNIT COST', fillColor: '#181818', color: 'white', bold: true}, {text: 'TOTAL COST', fillColor: '#181818', color: 'white', bold: true}],
					[ {text:'Dismantling and Installation', alignment: 'left',fontSize: 10}, {text: '1.00 lot'}, {text: '1.00'}, {text: 'Php 3,000.00'}],
				]
			},
			layout: {
				fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
				}
			},
			alignment: 'center',
			fontSize: 10,
			margin: [0, 0, 0, 5],
		},
		{
		    table: {
				widths: ['50%', '16.65%', '16.65%', '16.65%'],
				
				body: [
					[ {text:'II. SCOPE OF WORKS', alignment: 'left',fontSize: 10, fillColor: '#181818', color: 'white', bold: true, colSpan: 4, 	border: [true, true, true, true]}, {}, {}, {}],
				],
			},
			layout: {
				
				defaultBorder: false,
			},
			alignment: 'center',
			fontSize: 10,
			
		},
		{
		    table: {
				widths: [0.2, '50%', '16.65%', '16.65%', '16.65%'],
				
				body: [
				    [ {text: '', fillColor: '#6b6b6b', border: [false, true, false, false]}, {text:'A. STATOR ASSEMBLY', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 4, border: [false, true, true, false]}, {}, {}, {}],
				],
			},
			layout: {
				
				defaultBorder: false,
			},
			alignment: 'center',
			fontSize: 10,
			
		},
	    table(externalDataRetrievedFromServer, ['name', 'qty', 'unit', 'total']),
	    ,{
		    table: {
				widths: [0.2, '50%', '16.65%', '16.65%', '16.65%'],
				
				body: [
				    [ {text: '', fillColor: '#6b6b6b', border: [false, false, false, false]}, {text:'B. ACCESSORIES', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 4, border: [false, false, true, false]}, {}, {}, {}],
				],
			},
			layout: {
				
				defaultBorder: false,
			},
			alignment: 'center',
			fontSize: 10,
			
		},
	    table(externalDataRetrievedFromServer, ['name', 'qty', 'unit', 'total'])
	    ,{
		    table: {
				widths: [0.2, '50%', '16.65%', '16.65%', '16.65%'],
				
				body: [
				    [ {text: '', fillColor: '#6b6b6b', border: [false, false, false, false]}, {text:'C. MECHANICAL', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 4, border: [false, false, true, false]}, {}, {}, {}],
				],
			},
			layout: {
				
				defaultBorder: false,
			},
			alignment: 'center',
			fontSize: 10,
			
		},
	    table(externalDataRetrievedFromServer, ['name', 'qty', 'unit', 'total'])
	    ,
	    ,{
		    table: {
				widths: [0.2, '50%', '16.65%', '16.65%', '16.65%'],
				
				body: [
				    [ {text: '', fillColor: '#6b6b6b', border: [false, false, false, false]}, {text:'D. DYNAMIC BALANCING OF', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 4, border: [false, false, true, false]}, {}, {}, {}],
				],
			},
			layout: {
				
				defaultBorder: false,
			},
			alignment: 'center',
			fontSize: 10,
			
		},
	    table(externalDataRetrievedFromServer, ['name', 'qty', 'unit', 'total'])
	    ,{
		    table: {
				widths: [0.2, '50%', '16.65%', '16.65%', '16.65%'],
				
				body: [
				    [ {text: '', fillColor: '#6b6b6b', border: [false, false, false, false]}, {text:'E. MISCELLANEOUS', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 4, border: [false, false, true, false]}, {}, {}, {}],
				],
			},
			layout: {
				
				defaultBorder: false,
			},
			alignment: 'center',
			fontSize: 10,
			
		},
	    table(externalDataRetrievedFromServer, ['name', 'qty', 'unit', 'total']),
	    {
		    table: {
				widths: ['66%', '34%'],
				
				body: [
					[ {text:'SUB-TOTAL AMOUNT', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {}],
					[ {text:'ADD: 12% VAT', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {}],
					[ {text:'DISCOUNT:', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {}],
					[ {text:'III. TOTAL AMOUNT', alignment: 'left',fontSize: 10, fillColor: 'black', color: 'white', bold: true }, {}],
				],
			},
			layout: {
				
				defaultBorder: true,
			},
			alignment: 'center',
			fontSize: 10,
			margin: [0, 5, 0, 0]
			
		},
		{
		    table: {
				widths: ['50%', '50%'],
				
				body: [
					[ {text:'IV. WORK DURATION: ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true },{text:'TERM OF PAYMENT: ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }],
					[ {text:'VALIDITY: ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 2 }, {}],
				],
			},
			layout: {
				
				defaultBorder: true,
			},
			alignment: 'center',
			fontSize: 10,
			margin: [0, 5, 0, 0]
			
		},
		{
		    table: {
				widths: ['33.33%', '33.33%', '33.33%'],
				
				body: [
					[ {text:'PREPARED BY: ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [true, true, false, false], margin: [0, 5, 0, 0]},
					  {text:'CHECKED AND APPROVED BY: ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [false, true, false, false], margin: [0, 5, 0, 0]},
					  {text:'CONFORME/RECEIVED BY: ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [false, true, true, false], margin: [0, 5, 0, 0] }],
					[ {text:'___________________________________ ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [true, false, false, false], margin: [0, 10, 0, 0]},
					  {text:'___________________________________', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0]},
					  {text:'___________________________________', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [false, false, true, false], margin: [0, 10, 0, 0]}],
				    [ {text:'AMIEL KIT MARANAN \n Assistant Production Manager ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: false, border: [true, false, false, true], margin: [0, 10, 0, 5]},
					  {text:'WALTER A. OPULENCIA \n Production/Operations Manager', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: false, border: [false, false, false, true], margin: [0, 10, 0, 5]},
					  {text:'\n Customer Representative', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: false, border: [false, false, true, true], margin: [0, 10, 0, 5]}],
				],
				
			},
			layout: {
				
				defaultBorder: false,
			},
			alignment: 'center',
			fontSize: 10,
			margin: [0, 5, 0, 0],
			
			
		},
		
	]
    }