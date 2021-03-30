// playground requires you to assign document definition to a variable called dd

var dd = {
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
		,
		{
	        text:'BRAND/NAME : __________________________________________',
		    alignment: 'left',
		    fontSize: 7.5,
		    width: '70%',
		    margin: [0, 0, 0, 8]
		   
		},
		{
		    columns: [
    		    {
    		        text:' H.P. ________',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 6,
        		    width: '12.5%'
        		   
    		    },
    		    {
    		        text:' K.W. ________',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 6,
        		    width: '12.5%'
    		    },
    		    ,
    		    {
    		        text:' AMP ________',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 6,
        		    width: '12.5%'
    		    },
    		    {
    		        text:' RPM ________',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 6,
        		    width: '12.5%'
    		    },
    		    {
    		        text:' VOLTS _______',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 6,
        		    width: '12.5%'
    		    },
    		    {
    		        text:' PHASE _______',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 6,
        		    width: '12.5%'
    		    },
    		    {
    		        text:' HZ ________',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 6,
        		    width: '12.5%'
    		    },
    		    {
    		        text:' SR# ________',
        		    margin: [0, 8],
        		    alignment: 'left',
        		    fontSize: 7.5,
        		    width: '12.5%'
    		    },
		    ],
		   
		},
		{
		    table: {
				widths: ['3%', '9%', '8%', '15%', '8%', '11%', '11%', '11%', '9%', '10%', '5%'],
				margin: [0, 5, 0, 15],
				
				body: [
					[ {text:'A. BEFORE RECONDITION', colSpan: 5, alignment: 'left'}, {}, {}, {}, {}, {text:'DATE:', colSpan: 6, alignment: 'left'}, {}, {}, {}, {}, {}],
					[ {text:'A1.', rowSpan: 2, alignment: 'left'}, {text:'WINDING RESISTANCE TEST (OHMS)', rowSpan: 2, colSpan:2,alignment: 'left'}, {}, {text: 'INSULATION RESISTANCE TEST (MEGA-OHMS)', colSpan: 4, alignment: 'center'}, {}, {}, {}, {},  {text: 'TESTING W/O LOAD (AMPS.)', rowSpan: 2}, {text: '', rowSpan: 2, colSpan: 2}, {}],
					[ {}, {}, {}, {text: 'TIME'}, {text: 'T-G @500V', colSpan: 2},  {},  {text: 'T-G @1000V'},{text: 'T-G @2000V'}, {}, {}],
					[ {text: '', rowSpan: 3}, {text: 'T1-T2/Pri'}, {}, {text: '30 SECONDS'}, {text: '', colSpan: 2}, {}, {text: ''}, {text: ''}, {text: 'L1'}, {text: 'L1', colSpan: 2},  {}],
					[ {}, {text: 'T1-T3/Sec'}, {}, {text: '1 MINUTE'}, {text: '', colSpan: 2},{},  {text: '', }, {text: ''}, {text: 'L2'}, {text: 'L2', colSpan: 2},  {}],
					[ {}, {text: 'T2-T3'}, {}, {text: '10 MINUTES'}, {text: '', colSpan: 2},{},  {text: ''}, {text: ''}, {text: 'L3'}, {text: 'L3', colSpan: 2}, {}],
				    [ {text: '', rowSpan: 3}, {text: '',  border:[false,false,false,false]}, {text: '', border:[false,false,false,false]}, {text: 'PI'}, {text: '', colSpan: 2}, {},{text: ''},  {text: ''}, {text: 'L4'}, {text: 'L4', colSpan: 2},  {}],
					[ {}, {text: 'REMARKS',  border:[true,false,false,false]},{text: '', border:[false,false,false,false]}, {text: 'WINDING TEMP.'}, {text: 'C°', alignment: 'center', colSpan: 2}, {}, {text: ''}, {text: 'C°', alignment: 'center'}, {text: 'L5'}, {text: 'L5', colSpan: 2},  {}],
					[ {}, {text: '',  border:[false,false,false,true]}, {text: '', border:[false,false,false,true]}, {text: 'REMARKS', colSpan: 3}, {}, {}, {text: 'ABM. TEMP.'}, {text: ''}, {text: 'L6'}, {text: 'L6',  colSpan: 2},  {}],
					
					[ {text:'A2.', rowSpan: 6, alignment: 'left'}, {text:'HIGH POTENTIAL TEST (MICRO-AMPS)', colSpan:3,alignment: 'center'}, {}, {}, {}, {}, {text: 'TESTING W/O LOAD (AMPS.)', colSpan: 5, alignment: 'center'}, {}, {text: '',rowSpan: 2},  {}, {}],
					[ {}, {}, {text: 'T-G@500V'}, {text: 'T-G@1000V',}, {text: 'T-G@1500V'}, {text: 'T-G@2000V'}, {text: ''}, {text: 'Pri. (Volts)'}, {text: 'Sec. (Volts)'},  {text: 'Pri. (Amps)' }, {text: 'Sec (Amps.)' }],
					[ {text: '', rowSpan: 3}, {text: 'T1'}, {}, {text: ''}, {text: ''}, {text: ''}, {text: 'L1'}, {text: '', fontSize: 8}, {}, {}, {}],
					[ {}, {text: 'T2'}, {}, {text: ''}, {text: '', }, {text: ''}, {text: 'L2'}, {text: ''},  {}, {}, {}],
					[ {}, {text: 'T3'}, {}, {text: ''}, {text: ''}, {text: ''}, {text: 'L3'}, {text: ''},  {}, {}, {}],
					[ {}, {text: 'REMARKS'},{text: '',}, {text: '', colSpan: 2}, {}, {}, {}, {}, {}, {}, {}],
					[ {text: 'A3.'}, {text: 'SURGE TEST/COMPARISON TEST:', colSpan: 5},{}, {}, {}, {}, {text:'VOLTAGE INPUT:', colSpan: 5}, {}, {}, {}, {}],
					
				    
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
                                        [ {text: ' '}, {text: ' '}, {text: ' ', }, {text:'COIL TO COIL SHORT',  alignment: 'left', border: [false, false, false, false]}],
                                        [ {text: ' '}, {text: ' '}, {text: ' ',}, {text:'REVERSED COIL CONNECTION',  alignment: 'left', border: [false, false, false, false]}],
                                        [ {text: ' '}, {text: ' '}, {text: ' ', }, {text:'OPEN COIL CONNECTION',  alignment: 'left', border: [false, false, false, false]}],
									    [ {text: ' '}, {text: ' '}, {text: ' ', }, {text:'ARCING BETWEEN THE WINDINGS OR PHASES', alignment: 'left', border: [false, false, false, false]}],
									],
								},
								fontSize: 6,
								alignment: 'center',
								margin: [16, 0, 10, 10],
								//border: [false, false, false, false]
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
                                        [ {text: ' '}, {text: ' '}, {text: ' '}, {text:'PARTIAL GROUND', alignment: 'left', border: [false, false, false, false]}],
                                        [ {text: ' '}, {text: ' '}, {text: ' '}, {text:'PARTIAL GROUND',  alignment: 'left', border: [false, false, false, false]}],
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
// 			layout: 'noBorders',
		},
				{
		    table: {
				widths: ['3%', '9%', '8%', '15%', '8%', '11%', '11%', '11%', '9%', '10%', '5%'],
				margin: [0, 5, 0, 15],
				
				body: [
					[ {text:'A. BEFORE RECONDITION', colSpan: 5, alignment: 'left'}, {}, {}, {}, {}, {text:'DATE:', colSpan: 6, alignment: 'left'}, {}, {}, {}, {}, {}],
					[ {text:'A1.', rowSpan: 2, alignment: 'left'}, {text:'WINDING RESISTANCE TEST (OHMS)', rowSpan: 2, colSpan:2,alignment: 'left'}, {}, {text: 'INSULATION RESISTANCE TEST (MEGA-OHMS)', colSpan: 4, alignment: 'center'}, {}, {}, {}, {},  {text: 'TESTING W/O LOAD (AMPS.)', rowSpan: 2}, {text: '', rowSpan: 2, colSpan: 2}, {}],
					[ {}, {}, {}, {text: 'TIME'}, {text: 'T-G @500V', colSpan: 2},  {},  {text: 'T-G @1000V'},{text: 'T-G @2000V'}, {}, {}],
					[ {text: '', rowSpan: 3}, {text: 'T1-T2/Pri'}, {}, {text: '30 SECONDS'}, {text: '', colSpan: 2}, {}, {text: ''}, {text: ''}, {text: 'L1'}, {text: 'L1', colSpan: 2},  {}],
					[ {}, {text: 'T1-T3/Sec'}, {}, {text: '1 MINUTE'}, {text: '', colSpan: 2},{},  {text: '', }, {text: ''}, {text: 'L2'}, {text: 'L2', colSpan: 2},  {}],
					[ {}, {text: 'T2-T3'}, {}, {text: '10 MINUTES'}, {text: '', colSpan: 2},{},  {text: ''}, {text: ''}, {text: 'L3'}, {text: 'L3', colSpan: 2}, {}],
				    [ {text: '', rowSpan: 3}, {text: '',  border:[false,false,false,false]}, {text: '', border:[false,false,false,false]}, {text: 'PI'}, {text: '', colSpan: 2}, {},{text: ''},  {text: ''}, {text: 'L4'}, {text: 'L4', colSpan: 2},  {}],
					[ {}, {text: 'REMARKS',  border:[true,false,false,false]},{text: '', border:[false,false,false,false]}, {text: 'WINDING TEMP.'}, {text: 'C°', alignment: 'center', colSpan: 2}, {}, {text: ''}, {text: 'C°', alignment: 'center'}, {text: 'L5'}, {text: 'L5', colSpan: 2},  {}],
					[ {}, {text: '',  border:[false,false,false,true]}, {text: '', border:[false,false,false,true]}, {text: 'REMARKS', colSpan: 3}, {}, {}, {text: 'ABM. TEMP.'}, {text: ''}, {text: 'L6'}, {text: 'L6',  colSpan: 2},  {}],
					
					[ {text:'A2.', rowSpan: 6, alignment: 'left'}, {text:'HIGH POTENTIAL TEST (MICRO-AMPS)', colSpan:3,alignment: 'center'}, {}, {}, {}, {}, {text: 'TESTING W/O LOAD (AMPS.)', colSpan: 5, alignment: 'center'}, {}, {text: '',rowSpan: 2},  {}, {}],
					[ {}, {}, {text: 'T-G@500V'}, {text: 'T-G@1000V',}, {text: 'T-G@1500V'}, {text: 'T-G@2000V'}, {text: ''}, {text: 'Pri. (Volts)'}, {text: 'Sec. (Volts)'},  {text: 'Pri. (Amps)' }, {text: 'Sec (Amps.)' }],
					[ {text: '', rowSpan: 3}, {text: 'T1'}, {}, {text: ''}, {text: ''}, {text: ''}, {text: 'L1'}, {text: '', fontSize: 8}, {}, {}, {}],
					[ {}, {text: 'T2'}, {}, {text: ''}, {text: '', }, {text: ''}, {text: 'L2'}, {text: ''},  {}, {}, {}],
					[ {}, {text: 'T3'}, {}, {text: ''}, {text: ''}, {text: ''}, {text: 'L3'}, {text: ''},  {}, {}, {}],
					[ {}, {text: 'REMARKS'},{text: '',}, {text: '', colSpan: 2}, {}, {}, {}, {}, {}, {}, {}],
					[ {text: 'A3.'}, {text: 'SURGE TEST/COMPARISON TEST:', colSpan: 5},{}, {}, {}, {}, {text:'VOLTAGE INPUT:', colSpan: 5}, {}, {}, {}, {}],
					
				    
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
                                        [ {text: ' '}, {text: ' '}, {text: ' ', }, {text:'COIL TO COIL SHORT',  alignment: 'left', border: [false, false, false, false]}],
                                        [ {text: ' '}, {text: ' '}, {text: ' ',}, {text:'REVERSED COIL CONNECTION',  alignment: 'left', border: [false, false, false, false]}],
                                        [ {text: ' '}, {text: ' '}, {text: ' ', }, {text:'OPEN COIL CONNECTION',  alignment: 'left', border: [false, false, false, false]}],
									    [ {text: ' '}, {text: ' '}, {text: ' ', }, {text:'ARCING BETWEEN THE WINDINGS OR PHASES', alignment: 'left', border: [false, false, false, false]}],
									],
								},
								fontSize: 6,
								alignment: 'center',
								margin: [16, 0, 10, 10],
								//border: [false, false, false, false]
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
                                        [ {text: ' '}, {text: ' '}, {text: ' '}, {text:'PARTIAL GROUND', alignment: 'left', border: [false, false, false, false]}],
                                        [ {text: ' '}, {text: ' '}, {text: ' '}, {text:'PARTIAL GROUND',  alignment: 'left', border: [false, false, false, false]}],
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
// 			layout: 'noBorders',
		},
		{
			style: 'tableExample',
			table: {
				widths: ['30%', '70%'],
			    border: [false , false, false, false],
			    heights: [50, 50],
				
				body: [
					['RECOMMENDATION:', {fontSize: 8, margin: [5,5,5,5], text: '____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________'}],
					
				]
			
			},
			fontSize: 6,
		
		},
		{
		    table: {
				widths: ['33.33%', '33.33%', '33.33%'],
				
				body: [
					[ {text:'TESTED BY: ', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [true, true, false, false], margin: [0, 10, 0, 0]},
					  {text:'RECEIVED BY: ', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [false, true, false, false], margin: [0, 5, 0, 0]},
					  {text:'CERTIFIED BY: ', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [false, true, true, false], margin: [0, 5, 0, 0] }],
				    [ {text:'', alignment: 'left', fillColor: 'white', color: 'black', bold: false, border: [true, false, false, false]},
					  {text:'', alignment: 'left', fillColor: 'white', color: 'black', bold: false, border: [false, false, false, false]},
					  {text:'Walter A. Opulencia', alignment: 'left', fillColor: 'white', color: 'black', bold: false, border: [false, false, true, false], margin:[0,0,0,-15]}],
					  [ {text:'___________________________________ ', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [true, false, false, true], margin: [0, 0, 0, 0]},
					  {text:'___________________________________', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [false, false, false, true], margin: [0, 0, 0, 0]},
					  {text:'___________________________________', alignment: 'left', fillColor: 'white', color: 'black', bold: true, border: [false, false, true, true], margin: [0, 0, 0, 10]}],
				],
				
			},
			layout: {
				
				defaultBorder: false,
			},
			alignment: 'center',
			fontSize: 6,
			margin: [0, 5, 0, 0],
			
			
		},
	]
	
    }