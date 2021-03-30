// playground requires you to assign document definition to a variable called dd

var dd = {
    pageSize: {
        width: 612,
        height: 792 
    },
    pageMargins: 25,

	content: [
	   {text:'UNIVERSAL', absolutePosition: {x:93.6, y:118.6}, fontSize: 9, bold: true},
	   {text:'UNIVERSAL', absolutePosition: {x:93.6, y:136.8}, fontSize: 9, bold: true},
	   {text:'November 23, 2020', absolutePosition: {x:468, y:118.6}, fontSize: 9, bold: true},
	   {
			columns: [
				{
					stack: [{ 
						columns: [
							{text: '1 UNIT', width: 57.6, alignment: 'center' },{text: 'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', width: 300, margin: [10, 0, 0, 0]},
						]},
						{ 
						columns: [
							{text: '1 UNIT', width: 57.6, alignment: 'center' },{text: 'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', width: 300, margin: [10, 0, 0, 0]},
						]}
					]
				}
				
			],
			absolutePosition: {x:40, y:237.6},
			fontSize: 9,
			bold: true
	   },
	   {
	       style: 'tableExample',
			table: {
				body: [
					[{text:'INVOICE TO FOLLOW', alignment: 'center'}],
					[
					    { 
					        stack: 
					        [ 
					                {text: 'Q# : '},
					                {text: 'GP# : '},
					                {text: ' '},
					                {text: 'PR/SHC No.: '},
					                {text: 'PO No. : '}
					       ],
					       margin: [0,10, 0, 0],
					       border: [false, false, false, false]
					    }
					]
				
				]
			},
	        absolutePosition: {x:468, y:259.2}, fontSize: 9, bold: true
	   }
	  
	   ]
	
}