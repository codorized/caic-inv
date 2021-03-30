

var dd = {
    pageSize: 'FOLIO',
     pageMargins: 25,
  
	content: [
	    {
            columns: [
    		    {
    		        text:'',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '40%',
        		  
    		    },
    		    {
    		        text:'',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '33%'
    		    }
    		    ,
    		    {
    		        text:'DATE RECEIVED:',
        		    
        		    alignment: 'left',
        		    fontSize: 10,
        		    width: '*'
    		    }
		    ],
		    margin:[0,0,0,10]
            
        },
	    {
           text:'CALAMBA ALLIED INDUSTRIAL CORPORATION',
		    alignment: 'center',
		    bold: true,
		    fontSize: 15
            
        },
        {
           text:'MAIN OFFICE: CAIC BUILDING SAN CRISTOBAL, CALAMBA CITY, LAGUNA',
		    alignment: 'center',
		    fontSize: 10
            
        },
		{
		    text:'INDIVIDUAL ACCOMPLISHMENT REPORT',
		    alignment: 'center',
		    fontSize: 15,
		    margin:[0,10,0,0]
		    
		    
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
        		    width: '33%',
        		  
    		    },
    		    {
    		        text:'Sales Rep:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '33%'
    		    }
    		    ,
    		    {
    		        text:'Tag No:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '33%'
    		    }
		    ],
		    margin: [0, 0, 0, -10]
		},
		{
		    columns: [
    		    {
    		        text:'Address: ',
        		   
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '33%'
    		    },
    		   
    		    
		    ],
		    margin: [0, 10, 0, 0]
		},
		{
		    columns: [
		         {
    		        text:'Gate Pass #:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '33%'
    		    },
    		    {
    		        text:'Date Req\'d #:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '33%'
    		    },
    		    {
    		        text:'P.O. NO.:',
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '33%'
    		    },
    		    
    		    
		    ],
		    margin: [0, 0, 0, 0]
		},
		{
		    columns: [
    		    {
    		        text:'Q-no.2021:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '33%'
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
            text:'MOTOR SPECIFICATION',
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
		    style: 'tableExample',
		    fontSize: 12,
			table: {
			    widths: ['33%', '33%', '33%'],
				body: [
					['Name:', 'HP', 'KW']
				]
			}
		},
		{
		    columns: [
    		    {
    		        text:'RPM:',
        		   
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '25%'
    		    },
    		    {
    		        text:'Voltage:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '25%'
    		    }
    		    ,
    		    {
    		        text:'PH:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '25%'
    		    }
    		    ,
    		    {
    		        text:'Serial #:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '25%'
    		    }
		    ],
		    margin: [0, 10, 0, 5]
		},
		{
		    columns: [
    		    {
    		        text:'Type:',
        		   
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '25%'
    		    },
    		    {
    		        text:'Hz:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '25%'
    		    }
    		    ,
    		    {
    		        text:'Amps:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '25%'
    		    }
    		    ,
    		    {
    		        text:'Model:',
        		    
        		    alignment: 'left',
        		    fontSize: 12,
        		    width: '25%'
    		    }
		    ],
		    margin: [0, 0, 0, 10]
		},
		{ 
		    table: {
				widths: ['33%', '33%', '34%'],
				margin: [0, 5, 0, 15],
				body: [
					[ {text:'BACKJOB', alignment: 'center',fontSize: 12, fillColor: 'lightgray', bold: true}, {text: 'FINDINGS', bold: true, fillColor: 'lightgray', fontSize: 12}, {text: 'ORIGINAL WIRE (SAMPLE)', fontSize: 12, bold: true,fillColor: 'lightgray',}],
					[ {text:'Date Rewind:', alignment: 'left',fontSize: 12}, {text: '', rowSpan: 3}, {text: '',rowSpan: 3}],
					[ {text:'Rewinder:', alignment: 'left',fontSize: 12}, {text: ''}, {text: ''}],
					[ {text:'Inv No.:', alignment: 'left',fontSize: 12}, {text: ''}, {text: ''}]
				]
			},
			alignment: 'center',
			fontSize: 10,
			margin: [0, 0, 0, 5],
		},
		{ 
		    table: {
				widths: ['20%', '20%', '20%', '20%', '20%'],
				margin: [0, 5, 0, 15],
				body: [
					[ {text:'ORIGINAL DATA RECORD', alignment: 'center',fontSize: 12, bold: true, colSpan: 3, fillColor: 'lightgray', border: [true, true, true, true]}, {text: '', bold: true}, {text: ''}, {text: 'ORIGINAL TEST REPORT', colSpan: 2, bold: true,fillColor: 'lightgray', border: [true, true, true, true], fontSize: 12}, {text: ''}],
					[ {text:'', alignment: 'left',fontSize: 10}, {text: 'ROTOR', margin: [0, 5, 0, 0], border: [true, true, true, true], fontSize: 12}, {text: 'STATOR', margin: [0, 5, 0, 0], border: [true, true, true, true], fontSize: 12}, {text: 'COIL RESISTANCE:                         OHMS', colSpan: 2, margin: [0, 5, 0, 0], fontSize: 12}, {text: ''}],
					[ {text:'LENGTH:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: 'COIL RESISTANCE:                         OHMS', colSpan: 2, margin: [0, 0, 0, 0], fontSize: 12}, {text: ''}],
					[ {text:'OUTSIDE DIA:', alignment: 'left',fontSize: 12}, {text: ''}, {text: '', border: [false, false, true, false]}, {text: '', rowSpan: 2}, {text: '', rowSpan: 2}],
					[ {text:'INSIDE DIA:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: ''}, {text: ''}],
					[ {text:'SLOTS:', alignment: 'left',fontSize: 12}, {text: ''}, {text: '', border: [false, false, true, false]}, {text: 'AMP. W/O LOAD', fontSize: 12}, {text: 'AMP W/ LOAD', fontSize: 12}],
					[ {text:'# OF COIL GROUP:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: 'AT             VOLTS', fontSize: 12}, {text: 'AT              VOLTS', fontSize: 12}],
					[ {text:'GROUPS:', alignment: 'left',fontSize: 12}, {text: ''}, {text: '', border: [false, false, true, false]}, {text: 'L1                AMPS', fontSize: 12}, {text: 'L1                AMPS', fontSize: 12}],
					[ {text:'SPANS:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: 'L2                AMPS', fontSize: 12}, {text: 'L2                AMPS', fontSize: 12}],
					[ {text:'TURNS:', alignment: 'left',fontSize: 12}, {text: ''}, {text: '', border: [false, false, true, false]}, {text: 'L3                AMPS', fontSize: 12}, {text: 'L3                AMPS', fontSize: 12}],
					[ {text:'SIZE OF WIRE:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '',fillColor: 'lightgray', border: [false, false, true, false]}, {text: ''}, {text: ''}],
					
				]
			}, 
			alignment: 'center',
			fontSize: 10,
			layout: {
				defaultBorder: false,
			},
			margin: [0, 0, 0, 0],
		}
		,
		{ 
		    table: {
				widths: ['20%', '20%', '20%', '20%', '20%'],
				margin: [0, 5, 0, 15],
				body: [
					[ {text:'REVISION DATA RECORD', alignment: 'center',fontSize: 12, bold: true, colSpan: 3, fillColor: 'lightgray', border: [true, true, true, true]}, {text: '', bold: true}, {text: ''}, {text: 'REVISION TEST REPORT', colSpan: 2, bold: true,fillColor: 'lightgray', border: [true, true, true, true], fontSize: 12}, {text: ''}],
					[ {text:'', alignment: 'left',fontSize: 10}, {text: 'ROTOR', margin: [0, 5, 0, 0], border: [true, true, true, true], fontSize: 12}, {text: 'STATOR', margin: [0, 5, 0, 0], border: [true, true, true, true], fontSize: 12}, {text: 'COIL RESISTANCE:                         OHMS', colSpan: 2, margin: [0, 5, 0, 0], fontSize: 12}, {text: ''}],
					[ {text:'LENGTH:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: 'COIL RESISTANCE:                         OHMS', colSpan: 2, margin: [0, 0, 0, 0], fontSize: 12}, {text: ''}],
					[ {text:'OUTSIDE DIA:', alignment: 'left',fontSize: 12}, {text: ''}, {text: '', border: [false, false, true, false]}, {text: '', rowSpan: 2}, {text: '', rowSpan: 2}],
					[ {text:'INSIDE DIA:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: ''}, {text: ''}],
					[ {text:'SLOTS:', alignment: 'left',fontSize: 12}, {text: ''}, {text: '', border: [false, false, true, false]}, {text: 'AMP. W/O LOAD', fontSize: 12}, {text: 'AMP W/ LOAD', fontSize: 12}],
					[ {text:'# OF COIL GROUP:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: 'AT             VOLTS', fontSize: 12}, {text: 'AT              VOLTS', fontSize: 12}],
					[ {text:'GROUPS:', alignment: 'left',fontSize: 12}, {text: ''}, {text: '', border: [false, false, true, false]}, {text: 'L1                AMPS', fontSize: 12}, {text: 'L1                AMPS', fontSize: 12}],
					[ {text:'SPANS:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: 'L2                AMPS', fontSize: 12}, {text: 'L2                AMPS', fontSize: 12}],
					[ {text:'TURNS:', alignment: 'left',fontSize: 12}, {text: ''}, {text: '', border: [false, false, true, false]}, {text: 'L3                AMPS', fontSize: 12}, {text: 'L3                AMPS', fontSize: 12}],
					[ {text:'SIZE OF WIRE:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '',fillColor: 'lightgray', border: [false, false, true, false]}, {text: ''}, {text: ''}],
					
				]
			}, 
			alignment: 'center',
			fontSize: 10,
			layout: {
				defaultBorder: false,
			},
			margin: [0, 0, 0, 0],
		},
		{ 
		    table: {
				widths: ['20%', '20%', '20%', '20%', '20%'],
				margin: [0, 5, 0, 15],
				body: [
					[ {text:'NOTES', alignment: 'center',fontSize: 12, bold: true, colSpan: 3, fillColor: 'lightgray', border: [true, true, true, true]}, {text: '', bold: true}, {text: ''}, {text: 'REVISION WIRE / SAMPLE', colSpan: 2, bold: true,fillColor: 'lightgray', border: [true, true, true, true], fontSize: 12}, {text: ''}],
				
				]
			},
			alignment: 'center',
			fontSize: 10,
			layout: {
				defaultBorder: false,
			},
			margin: [0, 0, 0, 5],
		}
		
	]
    }