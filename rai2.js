// playground requires you to assign document definition to a variable called dd

var dd = {
    pageSize: {
        width: 612.00,
        height: 396.00,
        
     },
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
		    text:'RIS No. ',
		    margin: [400, -5, 0, 0],
		    alignment: 'center',
		    fontSize: 15
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
    		        text:'CUSTOMER __________________________________________________________________',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '70%'
    		    },
    		    {
    		        text:'J.O.\# ________________________',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '30%'
        		    
    		    },
		    ],
		},
		{
		    columns: [
    		    {
    		        text:'ADDRESS __________________________________________________________________',
        		    margin: [0, -5],
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '70%'
    		    },
    		    {
    		        text:'DATE ________________________',
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
				widths: ['20%', 'auto', 'auto', 'auto', '*', '20%', '*', '*', '*', '*'],
				margin: [0, 5, 0, 15],
				body: [
					[{ text:'ITEMS', margin: [0,6],  fontSize: 10 }, 'QTY RECD', 'QTY RET' ,'QTY USED', { text:'AMT', margin: [0,6] }, ' ', 'QTY RECD', 'QTY RET', 'QTY USED', { text:'AMT', margin: [0,6] }],
					[ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'M.W.\# ____', width: '90%', alignment: 'left', fontSize: 10}]}, ' ', '' ,'', '', { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'SHAFT SEAL OVERLOAD', width: '90%', alignment: 'left',  fontSize: 10}]}, '', '', '', ''],
					[ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'M.W.\# ____', width: '90%', alignment: 'left', fontSize: 10}]}, ' ', '' ,'', '', { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'RELAY', width: '90%', alignment: 'left',  fontSize: 10}]}, '', '', '', ''],
				    [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'BEARING# __', width: '90%', alignment: 'left', fontSize: 10}]}, ' ', '' ,'', '', { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'FAN BLADE', width: '90%', alignment: 'left',  fontSize: 10}]}, '', '', '', ''],
				    [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'BEARING# __', width: '90%', alignment: 'left', fontSize: 10}]}, ' ', '' ,'', '', { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'TERM LUNGS', width: '90%', alignment: 'left',  fontSize: 10}]}, '', '', '', ''],
				    [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'TUBING#__', width: '90%', alignment: 'left', fontSize: 10}]}, ' ', '' ,'', '', { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'AUTO WIRE', width: '90%', alignment: 'left',  fontSize: 10}]}, '', '', '', ''],
				    [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'CAPILLA OIL CAPACITOR', width: '90%', alignment: 'left', fontSize: 10}]}, ' ', '' ,'', '', { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'OIL SEAL', width: '90%', alignment: 'left',  fontSize: 10}]}, '', '', '', ''],
				    [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '____mid____', width: '90%', alignment: 'left', fontSize: 10}]}, ' ', '' ,'', '', { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'S. RELAY', width: '90%', alignment: 'left',  fontSize: 10}]}, '', '', '', ''],
				    [ { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: 'BOLTS & NUTS', width: '90%', alignment: 'left', fontSize: 10}]}, ' ', '' ,'', '', { columns:[{canvas: [{type: 'rect', x: 0, y: 2, w: 15,h: 10, lineColor: 'black'}], width: '30%', alignment: 'center'}, {text: '', width: '90%', alignment: 'left',  fontSize: 10}]}, '', '', '', ''],
				    [ { columns:[{text: '', width: '90%', alignment: 'left', fontSize: 10}]}, ' ', '' ,'', '', { columns:[{text: '', width: '90%', alignment: 'left',  fontSize: 10}]}, '', '', '', '']    
				    
				]
			},
			alignment: 'center'
		},
	],
	footer: {
        stack: [
            {
                columns: [
                    {
                        text:'TECH/REW: ____________________',
            		    alignment: 'left',
            		    fontSize: 10,
            		    width: '33.33%'
                    },
                    {
                        text:'APPROVED BY: ____________________',
            		    alignment: 'left',
            		    fontSize: 10,
            		    width: '33.33%'
                    },
                    ,
                    {
                        text:'ISSUED BY: ____________________',
            		    alignment: 'left',
            		    fontSize: 10,
            		    width: '33.33%'
                    }
                ]
               
                
            }
        ],
        margin: [40,-5, 25, 25]
    },
	
    }