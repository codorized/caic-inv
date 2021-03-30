const createQuotationPDF2 = (motors, company, qform, form, oncheckup, username, position) => {
    
    var total = 0;

    var stator = [];
    var genreq = []

    genreq.push({
        name: 'Pickup and Delivery',
        qty: form['genreq-pickup-qty'],
        unit: currencyFormat(parseFloat(form['genreq-pickup-unitcost'])), 
        total: currencyFormat(parseFloat(form['genreq-pickup-totalcost']))
    })

    genreq.push({
        name: 'Dismantling and Installation',
        qty: form['genreq-dismantling-qty'],
        unit: currencyFormat(parseFloat(form['genreq-dismantling-unitcost'])), 
        total: currencyFormat(parseFloat(form['genreq-dismantling-totalcost']))
    })

    total += parseFloat(form['genreq-pickup-totalcost']);
    total += parseFloat(form['genreq-dismantling-totalcost']);

    if(oncheckup.stator){
        for(var i=0; i<oncheckup.stator.length; i++)
        {
            var name = '';

            if(oncheckup.stator[i].name == 'stator-inspection') name = 'Inspection and Checking of unit and Data Recording'
            else if(oncheckup.stator[i].name == 'stator-complete-rewinding') name = 'Complete Stator Coil Rewinding Package (Includes the following:) \n - Stator coil Rewinding \n - Surge Comparison Hi-pot Testing \n - Polarization and Resistance Test \n - Varnishing and Baking \n - Cleaning and Painting of Unit'
            else if(oncheckup.stator[i].name == 'stator-complete-recon') name = 'Complete Reconditioning Package \n (Includes all stated above EXCEPT Stator  coil Rewinding)'
            else if(oncheckup.stator[i].name == 'conversion') name = 'Conversion of motor any parameter'

            stator.push({ 
                name: name,
                qty: form['stator-qty-'+(i+1)],
                unit: currencyFormat(parseFloat(form['stator-unitcost-'+(i+1)])), 
                total: currencyFormat(parseFloat(form['stator-totalcost-'+(i+1)]))
            })

            total += parseFloat(form['stator-totalcost-'+(i+1)]);
        }
    }
    

    var accessories = [];
    if(oncheckup.accessories)
    {
        for(var i=0; i<oncheckup.accessories.length; i++)
        {
            var name = '';
            
            if(oncheckup.accessories[i].name == 'rotor-loadside') name = 'Replacement  of bearing (Load Side)'
            else if(oncheckup.accessories[i].name == 'rotor-fanslide') name = 'Replacement  of bearing (Fan Side)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox1') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox2') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox3') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox4') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox5') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox6') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-shafting') name = 'Replacement  of Shafting'
            else if(oncheckup.accessories[i].name == 'acce-options-capacitor') name = oncheckup.accessories[i]['acce-options-capacitor1'] + ' of ' + oncheckup.accessories[i]['acce-options-capacitor2'] + ' Capacitor'
            else if(oncheckup.accessories[i].name == 'acce-options-fanblade') name = oncheckup.accessories[i]['acce-options-fanblade1'] + ' of ' + oncheckup.accessories[i]['acce-options-fanblade2'] + ' Fan Blade'
            else if(oncheckup.accessories[i].name == 'acce-options-oilseal') name = oncheckup.accessories[i]['acce-options-oilseal1'] + ' of ' + oncheckup.accessories[i]['acce-options-oilseal2'] + ' Oil Seal'
            else if(oncheckup.accessories[i].name == 'acce-options-shaftseal') name = oncheckup.accessories[i]['acce-options-shaftseal1'] + ' of ' + oncheckup.accessories[i]['acce-options-shaftseal2'] + ' Shaft Seal'
            else if(oncheckup.accessories[i].name == 'acce-options-oring-or-packing') name = 'Replacement of ' + oncheckup.accessories[i]['acce-options-oring-or-packing1'] 
            else if(oncheckup.accessories[i].name == 'acce-options-capilla-or-gear') name = oncheckup.accessories[i]['acce-options-capilla-or-gear1'] + ' of ' + oncheckup.accessories[i]['acce-options-capilla-or-gear2']
            else if(oncheckup.accessories[i].name == 'acce-other-1') name = oncheckup.accessories[i].formal


            if(form['acce-unitcost-'+(i+1)] && form['acce-totalcost-'+(i+1)] && form['acce-qty-'+(i+1)])
            {
                if(oncheckup.accessories[i].name !=  'acce-other-1') 
                {
                    accessories.push({ 
                        name: name,
                        model: isNull(form['acce-item-'+(i+1)]),
                        qty: form['acce-qty-'+(i+1)],
                        unit: currencyFormat(parseFloat(form['acce-unitcost-'+(i+1)])), 
                        total: currencyFormat(parseFloat(form['acce-totalcost-'+(i+1)]))
                    })
                }
                else 
                {
                    accessories.push({ 
                        name: name,
                        model: isNull(form['item-model-items']),
                        qty: form['acce-qty-'+(i+1)],
                        unit: currencyFormat(parseFloat(form['acce-unitcost-'+(i+1)])), 
                        total: currencyFormat(parseFloat(form['acce-totalcost-'+(i+1)]))
                    })
                }
                total += parseFloat(form['acce-totalcost-'+(i+1)]); 
            }
            
    
            
        }
    }
    

    var mechanical = [];

    if(oncheckup.mechanical){
        for(var i=0; i<oncheckup.mechanical.length; i++)
        {
            var name = '';
    
            if(oncheckup.mechanical[i].name == 'acce-fancover') name = 'Fabrication of Fan Cover'
            else if(oncheckup.mechanical[i].name == 'acce-terminal') name = 'Fabrication of Terminal Cover'
            else if(oncheckup.mechanical[i].name == 'acce-wielding') name = 'Welding of Endplate'
            else if(oncheckup.mechanical[i].name == 'acce-terminalpost') name = 'Fabrication of Terminal Post'
            else if(oncheckup.mechanical[i].name == 'acce-cable') name = 'Fabrication of Adaptor Cable'
            else if(oncheckup.mechanical[i].name == 'acce-alignment') name = 'Fabrication of Shafting including Alignment'
            else if(oncheckup.mechanical[i].name == 'acce-finge-coupling') name = 'Replacement of Flange Coupling including Reboring'
            else if(oncheckup.mechanical[i].name == 'acce-shafting') name = 'Build up and Machining of Shafting'
            else if(oncheckup.mechanical[i].name == 'acce-welding-motor') name = 'Welding of Motor Base'
            else if(oncheckup.mechanical[i].name == 'acce-reboring-housing') name = 'Reboring of Bearing Housing'
            else if(oncheckup.mechanical[i].name == 'acce-sleeving') name = 'Sleeving of Bearing Housing'
            
            if(form['mech-unitcost-'+(i+1)] && form['mech-totalcost-'+(i+1)] && form['mech-qty-'+(i+1)])
            {
                mechanical.push({ 
                    name: name,
                    model: isNull(form['mech-item-'+(i+1)]),
                    qty: form['mech-qty-'+(i+1)],
                    unit: currencyFormat(parseFloat(form['mech-unitcost-'+(i+1)])), 
                    total: currencyFormat(parseFloat(form['mech-totalcost-'+(i+1)]))
                })

                total += parseFloat(form['mech-totalcost-'+(i+1)]);
            }
    
            
        }
    }
    

    var dynamic = [];
    if(oncheckup.mechanical){
        for(var i=0; i<oncheckup.dynamic.length; i++)
        {
            var name = '';
    
            if(oncheckup.dynamic[i].name == 'dynamic-options') name = oncheckup.dynamic[i]['dynamic-options2']
            
            if(form['dynamic-unitcost-'+(i+1)] && form['dynamic-totalcost-'+(i+1)] && form['dynamic-qty-'+(i+1)])
            {
                dynamic.push({ 
                    name: name,
                    qty: form['dynamic-qty-'+(i+1)],
                    unit: currencyFormat(parseFloat(form['dynamic-unitcost-'+(i+1)])), 
                    total: currencyFormat(parseFloat(form['dynamic-totalcost-'+(i+1)]))
                })
                total += parseFloat(form['dynamic-totalcost-'+(i+1)]);
            }
    
            
        }
    }
    

    var misc = [];


    if(oncheckup.misc){
        for(var i=0; i<oncheckup.misc.length; i++)
        {

            if(form['misc-unitcost-'+(i+1)] && form['misc-totalcost-'+(i+1)] && form['misc-qty-'+(i+1)])
            {
                misc.push({ 
                    name: oncheckup.misc[i].name,
                    qty: form['misc-qty-'+(i+1)],
                    unit: currencyFormat(parseFloat(form['misc-unitcost-'+(i+1)])), 
                    total: currencyFormat(parseFloat(form['misc-totalcost-'+(i+1)]))
                })
                total += parseFloat(form['misc-totalcost-'+(i+1)]);
            }
        }
    }

    function isNull(item){
        if(item) return item
        return ''
    }

    function isDiscount(total)
    {
      if(form.discount)
      {
        return [
            [ {text:'SUB-TOTAL AMOUNT:', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat(total), bold: true}],
            [ {text:'DISCOUNT:', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat(getdiscount(total))}],
            [ {text:'ADD: 12% VAT', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat((total-getdiscount(total))*0.12), bold: true}],
            [ {text:'III. TOTAL AMOUNT', alignment: 'left',fontSize: 10, fillColor: 'black', color: 'white', bold: true }, {text: currencyFormat((total-getdiscount(total)) + ((total-(getdiscount(total)))*0.12)), bold: true}],
        ]
      } 
      return [
            [ {text:'SUB-TOTAL AMOUNT:', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat(total), bold: true}],
            [ {text:'ADD: 12% VAT', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat((total-getdiscount(total))*0.12), bold: true}],
            [ {text:'III. TOTAL AMOUNT', alignment: 'left',fontSize: 10, fillColor: 'black', color: 'white', bold: true }, {text: currencyFormat((total-getdiscount(total)) + ((total-(getdiscount(total)))*0.12)), bold: true}],
        ]
    }

    function getdiscount(total)
    {
        
        if(form['discount_fixed'])
            return parseFloat(form['discount_fixed']) 
        
        if(form['discount_percent']){
            var percentage = parseFloat(form['discount_percent'])/100
            var total_discount = percentage*total;
            return total_discount;
        }
        return 0
    }

    function currencyFormat(num) {
        return 'Php ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

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

    var width_layout = function(colNo){
        if(colNo == 4) return ['50%', '16.65%', '16.65%', '16.65%']
        return ['35%', '14%', '17%', '16.65%', '17.3%']
    }

    function table(data, columns) {
        
        if(data.length > 0)
        {
            return {
                table: {
                    headerRows: 0,
                    body: buildTableBody(data, columns),
                    widths: width_layout(columns.length),
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

        return null;
  
    }



    var dd = {
        pageSize: 'FOLIO',
        pageMargins: 25,
    
        content: [
            {
            text:'FORM REVISION (JAN. 2021) AKCOM',
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
                text:'QUOTATION',
                alignment: 'center',
                fontSize: 15,
                bold: true
                
            },
            {
                text:'TAG#: '+motors.tagID,
                alignment: 'center',
                margin: [360, -10, 0, 0],
                fontSize: 14,
                bold: true
                
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
                        text:'Customer: '+ company.compname,
                        alignment: 'left',
                        fontSize: 12,
                        width: '60%',
                        margin: [0, 5, 0, -20]
                    },
                    {
                        text:'Sales Rep: '+ motors.salesRep,
                        
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
                        text:'Address/Location: ' + company.street + ', ' + company.city + ', ' + company.zip,
                    
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Q-no.2021: ' + qform[0].qNo,
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
                        text:'Contact Person: ' + company.contact1 + '/' + company.contact2,
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Gate Pass #: ' + motors.gatepass,
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
                        text:'Motor Name: ' + motors.motorType,
                        
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Speed (rpm): ' + oncheckup.rpm,
                        
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
                        text:'Capacity Rating: ' + oncheckup.power,
                    
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Phase: ' + oncheckup.phase,
                        
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
                        text:'Current: ' + oncheckup.current,
                    
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Frequency: ' + oncheckup.frequency,
                        
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
                        text:'Voltage: ' + oncheckup.voltage,
                    
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
                        //[ {text:'Dismantling and Installation', alignment: 'left',fontSize: 10}, {text: '1.00 lot'}, {text: '1.00'}, {text: currencyFormat(3000)}],
                    ]
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                    }
                },
                alignment: 'center',
                fontSize: 10
            },
            table(genreq, ['name', 'qty', 'unit', 'total']),
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
            table(stator, ['name', 'qty', 'unit', 'total']),
            ,{
                table: {
                    widths: [0.2, '33.2%', '14%', '16.65%', '16.65%'],
                    
                    body: [
                        [ {text: '', fillColor: '#6b6b6b', border: [false, false, false, false]}, {text:'B. ACCESSORIES', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 1, border: [false, false, true, false]}, {text: 'ITEM', border: [false, false, true, false]}, {}, {}],
                    ],
                },
                layout: {
                    
                    defaultBorder: false,
                },
                alignment: 'center',
                fontSize: 10,
                
            },
            table(accessories, ['name', 'model', 'qty', 'unit', 'total'])
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
            table(mechanical, ['name', 'model', 'qty', 'unit', 'total'])
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
            table(dynamic, ['name', 'qty', 'unit', 'total'])
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
            table(misc, ['name', 'qty', 'unit', 'total']),
            {
                table: {
                    widths: ['66%', '34%'],
                    
                    body: isDiscount(total),
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
                        [ {text:'IV. WORK DURATION: ' + oncheckup.workdays + ' day/s', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true },{text:'TERM OF PAYMENT: ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }],
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
                        [ {text:'_______________________________', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [true, false, false, false], margin: [0, 10, 0, 0]},
                        {text:'_______________________________', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0]},
                        {text:'_______________________________', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [false, false, true, false], margin: [0, 10, 0, 0]}],
                        [ {text: username.toUpperCase() + ' \n ' + position, alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: false, border: [true, false, false, true], margin: [0, 10, 0, 5]},
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
            
        ],
        footer:{
            columns:[
                {text: 'This document is computer-generated. No signature is required.', alignment: 'center', fontSize: 10, italics: true, color: 'gray'}
            ]
        },
        defaultStyle: {
            font: 'Helvetica'
          }
    }
    
    return dd;
  
}

const createQuotationPDFSingle2 = (motors, company, qform, form, oncheckup, scope, username) => {
    
    var total = 0;
    var externalDataRetrievedFromServer = [
        { name: 'Dismantling and Installation ', qty: 34, unit: 1, total: 4000 },
        { name: 'Dismantling and Installation ', qty: 34, unit: 1, total: 4000 },
        { name: 'Dismantling and Installation ', qty: 34, unit: 1, total: 4000 }
    ];

    var stator = [];
    var accessories = [];
    var mechanical = [];
    var dynamic = [];
    var misc = [];

    var genreq = []

    genreq.push({
        name: 'Pickup and Delivery',
        qty: form['genreq-pickup-qty'],
        unit: currencyFormat(parseFloat(form['genreq-pickup-unitcost'])), 
        total: currencyFormat(parseFloat(form['genreq-pickup-totalcost']))
    })

    genreq.push({
        name: 'Dismantling and Installation',
        qty: form['genreq-dismantling-qty'],
        unit: currencyFormat(parseFloat(form['genreq-dismantling-unitcost'])), 
        total: currencyFormat(parseFloat(form['genreq-dismantling-totalcost']))
    })

    total += parseFloat(form['genreq-pickup-totalcost']);
    total += parseFloat(form['genreq-dismantling-totalcost']);

    if(scope == 'stator')
    {
        for(var i=0; i<oncheckup.stator.length; i++)
        {
            var name = '';
    
            if(oncheckup.stator[i].name == 'stator-inspection') name = 'Inspection and Checking of unit and Data Recording'
            else if(oncheckup.stator[i].name == 'stator-complete-rewinding') name = 'Complete Stator Coil Rewinding Package (Includes the following:) \n - Stator coil Rewinding \n - Surge Comparison Hi-pot Testing \n - Polarization and Resistance Test \n - Varnishing and Baking \n - Cleaning and Painting of Unit'
            else if(oncheckup.stator[i].name == 'stator-complete-recon') name = 'Complete Reconditioning Package \n (Includes all stated above EXCEPT Stator  coil Rewinding)'
            else if(oncheckup.stator[i].name == 'conversion') name = 'Conversion of motor any parameter'
    
            stator.push({ 
                name: name,
                qty: form['stator-qty-'+(i+1)],
                unit: currencyFormat(parseFloat(form['stator-unitcost-'+(i+1)])), 
                total: currencyFormat(parseFloat(form['stator-totalcost-'+(i+1)]))
            })
    
            total += parseFloat(form['stator-totalcost-'+(i+1)]);
        }
    } else if(scope == 'accessories')
    {
        
        for(var i=0; i<oncheckup.accessories.length; i++)
        {
            var name = '';
    
            if(oncheckup.accessories[i].name == 'rotor-loadside') name = 'Replacement  of bearing (Load Side)'
            else if(oncheckup.accessories[i].name == 'rotor-fanslide') name = 'Replacement  of bearing (Fan Side)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox1') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox2') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox3') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox4') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox5') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'rotor-gearbox6') name = 'Replacement  of bearing (Gear Box)'
            else if(oncheckup.accessories[i].name == 'acce-options-capacitor') name = oncheckup.accessories[i]['acce-options-capacitor1'] + ' of ' + oncheckup.accessories[i]['acce-options-capacitor2'] + ' Capacitor'
            else if(oncheckup.accessories[i].name == 'acce-options-fanblade') name = oncheckup.accessories[i]['acce-options-fanblade1'] + ' of ' + oncheckup.accessories[i]['acce-options-fanblade2'] + ' Fan Blade'
            else if(oncheckup.accessories[i].name == 'acce-options-oilseal') name = oncheckup.accessories[i]['acce-options-oilseal1'] + ' of ' + oncheckup.accessories[i]['acce-options-oilseal2'] + ' Oil Seal'
            else if(oncheckup.accessories[i].name == 'acce-options-shaftseal') name = oncheckup.accessories[i]['acce-options-shaftseal1'] + ' of ' + oncheckup.accessories[i]['acce-options-shaftseal2'] + ' Shaft Seal'
            else if(oncheckup.accessories[i].name == 'acce-options-oring-or-packing') name = 'Replacement of ' + oncheckup.accessories[i]['acce-options-oring-or-packing1'] 
            else if(oncheckup.accessories[i].name == 'acce-options-capilla-or-gear') name = oncheckup.accessories[i]['acce-options-capilla-or-gear1'] + ' of ' + oncheckup.accessories[i]['acce-options-capilla-or-gear2']
            
            if(form['acce-unitcost-'+(i+1)] && form['acce-totalcost-'+(i+1)] && form['acce-qty-'+(i+1)])
            {
                if(oncheckup.accessories[i].name !=  'acce-other-1') 
                {
                    accessories.push({ 
                        name: name,
                        model: isNull(form['acce-item-'+(i+1)]),
                        qty: form['acce-qty-'+(i+1)],
                        unit: currencyFormat(parseFloat(form['acce-unitcost-'+(i+1)])), 
                        total: currencyFormat(parseFloat(form['acce-totalcost-'+(i+1)]))
                    })
                }
                else 
                {
                    accessories.push({ 
                        name: name,
                        model: isNull(form['item-model-items']),
                        qty: form['acce-qty-'+(i+1)],
                        unit: currencyFormat(parseFloat(form['acce-unitcost-'+(i+1)])), 
                        total: currencyFormat(parseFloat(form['acce-totalcost-'+(i+1)]))
                    })
                }
                total += parseFloat(form['acce-totalcost-'+(i+1)]); 
            }

            
        }
    } else if(scope == 'mechanical')
    {
        

        for(var i=0; i<oncheckup.mechanical.length; i++)
        {
            var name = '';
    
            if(oncheckup.mechanical[i].name == 'acce-fancover') name = 'Fabrication of Fan Cover'
            else if(oncheckup.mechanical[i].name == 'acce-terminal') name = 'Fabrication of Terminal Cover'
            else if(oncheckup.mechanical[i].name == 'acce-wielding') name = 'Welding of Endplate'
            else if(oncheckup.mechanical[i].name == 'acce-terminalpost') name = 'Fabrication of Terminal Post'
            else if(oncheckup.mechanical[i].name == 'acce-cable') name = 'Fabrication of Adaptor Cable'
            else if(oncheckup.mechanical[i].name == 'acce-alignment') name = 'Fabrication of Shafting including Alignment'
            else if(oncheckup.mechanical[i].name == 'acce-finge-coupling') name = 'Replacement of Flange Coupling including Reboring'
            else if(oncheckup.mechanical[i].name == 'acce-shafting') name = 'Build up and Machining of Shafting'
            else if(oncheckup.mechanical[i].name == 'acce-welding-motor') name = 'Welding of Motor Base'
            else if(oncheckup.mechanical[i].name == 'acce-reboring-housing') name = 'Reboring of Bearing Housing'
            else if(oncheckup.mechanical[i].name == 'acce-sleeving') name = 'Sleeving of Bearing Housing'
            
            if(form['mech-unitcost-'+(i+1)] && form['mech-totalcost-'+(i+1)] && form['mech-qty-'+(i+1)])
            {
                mechanical.push({ 
                    name: name,
                    model: isNull(form['mech-item-'+(i+1)]),
                    qty: form['mech-qty-'+(i+1)],
                    unit: currencyFormat(parseFloat(form['mech-unitcost-'+(i+1)])), 
                    total: currencyFormat(parseFloat(form['mech-totalcost-'+(i+1)]))
                })
                total += parseFloat(form['mech-totalcost-'+(i+1)]);
            }
            
    
            
        }
    } else if(scope == 'dynamic')
    {
        

        for(var i=0; i<oncheckup.dynamic.length; i++)
        {
            var name = '';
    
            if(oncheckup.dynamic[i].name == 'dynamic-options') name = oncheckup.dynamic[i]['dynamic-options2']
            
            if(form['dynamic-unitcost-'+(i+1)] && form['dynamic-totalcost-'+(i+1)] && form['dynamic-qty-'+(i+1)])
            {
                dynamic.push({ 
                    name: name,
                    qty: form['dynamic-qty-'+(i+1)],
                    unit: currencyFormat(parseFloat(form['dynamic-unitcost-'+(i+1)])), 
                    total: currencyFormat(parseFloat(form['dynamic-totalcost-'+(i+1)]))
                })
                total += parseFloat(form['dynamic-totalcost-'+(i+1)]);
            }
    
            
        }
    } else if(scope == 'misc')
    {
       

        for(var i=0; i<oncheckup.misc.length; i++)
        {
    
            if(form['misc-unitcost-'+(i+1)] && form['misc-totalcost-'+(i+1)] && form['misc-qty-'+(i+1)])
            {
                misc.push({ 
                    name: oncheckup.misc[i].name,
                    qty: form['misc-qty-'+(i+1)],
                    unit: currencyFormat(parseFloat(form['misc-unitcost-'+(i+1)])), 
                    total: currencyFormat(parseFloat(form['misc-totalcost-'+(i+1)]))
                })
            }
    
            total += parseFloat(form['misc-totalcost-'+(i+1)]);
        }
    }

    
    function setQCode(qNo, scope)
    {
        var compat = {
            'stator': 0,
            'accessories': 1,
            'mechanical': 2,
            'dyanmic': 3,
            'misc': 4
        }
        if(typeof qNo == 'string')
            return qNo
        else if(typeof qNo == 'object')
        {
            return qNo[compat[scope]]
        }


    }

    function isHeaderShow(currscope)
    {
        if(currscope == 'stator' && currscope == scope)
        {
            var obj = {
                table: {
                    widths: [0.2, '50%', '16.65%', '16.65%', '16.65%'],
                    
                    body: [
                        [ {text: '', fillColor: '#6b6b6b', border: [false, true, false, false]}, {text:'STATOR ASSEMBLY', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 4, border: [false, true, true, false]}, {}, {}, {}],
                    ],
                },
                layout: {
                    
                    defaultBorder: false,
                },
                alignment: 'center',
                fontSize: 10, 
            }

            return obj
        }
        else if(currscope == 'accessories' && currscope == scope)
        {
            var obj = {
                table: {
                    widths: [0.2, '33.2%', '14%', '16.65%', '16.65%'],
                    
                    body: [
                        [ {text: '', fillColor: '#6b6b6b', border: [false, false, false, false]}, {text:'ACCESSORIES', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 1, border: [false, false, true, false]}, {text: 'ITEM', border: [false, false, true, false]}, {}, {}],
                    ],
                },
                layout: {
                    
                    defaultBorder: false,
                },
                alignment: 'center',
                fontSize: 10,
            }
            return obj
        } 
        else if(currscope == 'mechanical' && currscope == scope)
        {
            var obj = {
                table: {
                    widths: [0.2, '50%', '16.65%', '16.65%', '16.65%'],
                    
                    body: [
                        [ {text: '', fillColor: '#6b6b6b', border: [false, false, false, false]}, {text:'MECHANICAL', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 4, border: [false, false, true, false]}, {}, {}, {}],
                    ],
                },
                layout: {
                    
                    defaultBorder: false,
                },
                alignment: 'center',
                fontSize: 10,
                
            }

            return obj;
        }
        else if(currscope == 'dynamic' && currscope == scope)
        {
            var obj = {
                table: {
                    widths: [0.2, '50%', '16.65%', '16.65%', '16.65%'],
                    
                    body: [
                        [ {text: '', fillColor: '#6b6b6b', border: [false, false, false, false]}, {text:'DYNAMIC BALANCING OF', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 4, border: [false, false, true, false]}, {}, {}, {}],
                    ],
                },
                layout: {
                    
                    defaultBorder: false,
                },
                alignment: 'center',
                fontSize: 10,
                
            }

            return obj;
        }

        else if(currscope == 'misc' && currscope == scope)
        {
            var obj = {
                table: {
                    widths: [0.2, '50%', '16.65%', '16.65%', '16.65%'],
                    
                    body: [
                        [ {text: '', fillColor: '#6b6b6b', border: [false, false, false, false]}, {text:'MISCELLANEOUS', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, colSpan: 4, border: [false, false, true, false]}, {}, {}, {}],
                    ],
                },
                layout: {
                    
                    defaultBorder: false,
                },
                alignment: 'center',
                fontSize: 10,
            
            }

            return obj;
        }
    }

    function isShow(currscope, tableObj)
    {
        if(currscope == scope)
            return tableObj
    }

    function isNull(item){
        if(item) return item
        return ''
    }

    function isDiscount(total)
    {
      if(form.discount)
      {
        return [
            [ {text:'SUB-TOTAL AMOUNT:', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat(total), bold: true}],
            [ {text:'DISCOUNT:', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat(getdiscount(total))}],
            [ {text:'ADD: 12% VAT', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat((total-getdiscount(total))*0.12), bold: true}],
            [ {text:'III. TOTAL AMOUNT', alignment: 'left',fontSize: 10, fillColor: 'black', color: 'white', bold: true }, {text: currencyFormat((total-getdiscount(total)) + ((total-(getdiscount(total)))*0.12)), bold: true}],
        ]
      } 
      return [
            [ {text:'SUB-TOTAL AMOUNT:', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat(total), bold: true}],
            [ {text:'ADD: 12% VAT', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }, {text: currencyFormat((total-getdiscount(total))*0.12), bold: true}],
            [ {text:'III. TOTAL AMOUNT', alignment: 'left',fontSize: 10, fillColor: 'black', color: 'white', bold: true }, {text: currencyFormat((total-getdiscount(total)) + ((total-(getdiscount(total)))*0.12)), bold: true}],
        ]
    }

    function getdiscount(total)
    {
        if(form['discount_fixed'])
            return parseFloat(form['discount_fixed']) 
        
        if(form['discount_percent']){
            var percentage = parseFloat(form['discount_percent'])/100
            var total_discount = percentage*total;
            return total_discount;
        }
        return 0
    }

    function currencyFormat(num) {
        return 'Php ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

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

    var width_layout = function(colNo){
        if(colNo == 4) return ['50%', '16.65%', '16.65%', '16.65%']
        return ['35%', '14%', '17%', '16.65%', '17.3%']
    }

    function table(data, columns) {
        
        if(data.length > 0)
        {
            return {
                table: {
                    headerRows: 0,
                    body: buildTableBody(data, columns),
                    widths: width_layout(columns.length),
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
        
    }



    var dd = {
        pageSize: 'FOLIO',
        pageMargins: 25,
    
        content: [
            {
            text:'FORM REVISION (JAN. 2021) AKCOM',
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
                text:'QUOTATION',
                alignment: 'center',
                fontSize: 15,
                bold: true
                
            },
            {
                text:'TAG#: '+motors.tagID,
                alignment: 'center',
                margin: [360, -10, 0, 0],
                fontSize: 14,
                bold: true
                
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
                        text:'Customer: '+ company.compname,
                        alignment: 'left',
                        fontSize: 12,
                        width: '60%',
                        margin: [0, 5, 0, -20]
                    },
                    {
                        text:'Sales Rep: '+ motors.salesRep,
                        
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
                        text:'Address/Location: ' + company.street + ', ' + company.city + ', ' + company.zip,
                    
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Q-no.2021: ' + setQCode(qform[0].qNo, scope),
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
                        text:'Contact Person: ' + company.contact1 + '/' + company.contact2,
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Gate Pass #: ' + motors.gatepass,
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
                        text:'Motor Name: ' + motors.motorType,
                        
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Speed (rpm): ' + oncheckup.rpm,
                        
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
                        text:'Capacity Rating: ' + oncheckup.power,
                    
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Phase: ' + oncheckup.phase,
                        
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
                        text:'Current: ' + oncheckup.current,
                    
                        alignment: 'left',
                        fontSize: 10,
                        width: '60%'
                    },
                    {
                        text:'Frequency: ' + oncheckup.frequency,
                        
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
                        text:'Voltage: ' + oncheckup.voltage,
                    
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
                        // [ {text:'Dismantling and Installation', alignment: 'left',fontSize: 10}, {text: '1.00 lot'}, {text: '1.00'}, {text: currencyFormat(3000)}],
                    ]
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                    }
                },
                alignment: 'center',
                fontSize: 10,
            },
            table(genreq, ['name', 'qty', 'unit', 'total']),
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
            isHeaderShow('stator'),
            isShow('stator', table(stator, ['name', 'qty', 'unit', 'total'])),
            isHeaderShow('accessories'),
            isShow('accessories', table(accessories, ['name', 'model', 'qty', 'unit', 'total'])),
            isHeaderShow('mechanical'),
            isShow('mechanical', table(mechanical, ['name', 'model', 'qty', 'unit', 'total'])),
            isHeaderShow('dynamic'),
            isShow('dynamic', table(dynamic, ['name', 'qty', 'unit', 'total'])),
            isHeaderShow('misc'),
            isShow('misc', table(misc, ['name', 'qty', 'unit', 'total'])),
            {
                table: {
                    widths: ['66%', '34%'],
                    
                    body: isDiscount(total),
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
                        [ {text:'IV. WORK DURATION: ' + oncheckup.workdays + ' day/s', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true },{text:'TERM OF PAYMENT: ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true }],
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
                        [ {text:'_______________________________', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [true, false, false, false], margin: [0, 10, 0, 0]},
                        {text:'_______________________________', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0]},
                        {text:'_______________________________', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: true, border: [false, false, true, false], margin: [0, 10, 0, 0]}],
                        [ {text: username.toUpperCase() + ' \n Assistant Production Manager ', alignment: 'left',fontSize: 10, fillColor: 'white', color: 'black', bold: false, border: [true, false, false, true], margin: [0, 10, 0, 5]},
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
            
        ],
        footer:{
            columns:[
                {text: 'This document is computer-generated. No signature is required.', alignment: 'center', fontSize: 10, italics: true, color: 'gray'}
            ]
        },
        defaultStyle: {
            font: 'Helvetica'
          }
    }
    
    return dd;
  
}

const createIARFront = (motor, company, body) => {
    var gatepass = ''
    if(motor.gatepass) gatepass = motor.gatepass

    var hp, kw = ''
    if(body['powerrb'].toUpperCase() == 'KW') {
        hp = ''
        kw = body.power
    }
    else if(body['powerrb'].toUpperCase() == 'HP')
    {
        hp = body.power
        kw = ''
    }

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
                        text:'Customer: ' + company.compname,
                        
                        alignment: 'left',
                        fontSize: 12,
                        width: '33%',
                        margin: [0,0,0,5]
                    
                    },
                    {
                        text:'Sales Rep: ' + motor.salesRep,
                        
                        alignment: 'left',
                        fontSize: 12,
                        width: '33%',
                        
                    }
                    ,
                    {
                        text:'Tag No: ' + motor.tagID,
                        bold: true,
                        alignment: 'left',
                        fontSize: 15,
                        width: '33%'
                    }
                ],
                margin: [0, 0, 0, -10]
            },
            {
                columns: [
                    {
                        text:'Address: ' + company.street + ', ' + company.brgy + ', ' + company.city + ', ' + company.state,
                        alignment: 'left',
                        fontSize: 12,
                        width: '100%',
                        margin: [0,0,0,5]
                    },
                
                    
                ],
                margin: [0, 10, 0, 0]
            },
            {
                columns: [
                    {
                        text:'Gate Pass #: ' + gatepass,
                        
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
                margin: [0, 0, 0, 5]
            },
            {
                columns: [
                    {
                        text:'Q-no.2021:',
                        
                        alignment: 'left',
                        fontSize: 12,
                        width: '33%',
                        
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
                        ['Name: '+ motor.motorType, 'HP                   '+ hp, 'KW                   ' + kw]
                    ]
                },
                
            },
            {
                columns: [
                    {
                        text:'RPM:' + body.rpm,
                    
                        alignment: 'left',
                        fontSize: 12,
                        width: '25%'
                    },
                    {
                        text:'Voltage: ' + body.voltage,
                        
                        alignment: 'left',
                        fontSize: 12,
                        width: '25%'
                    }
                    ,
                    {
                        text:'PH: ' + body.phase,
                        
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
                        text:'Type: ',
                    
                        alignment: 'left',
                        fontSize: 12,
                        width: '25%'
                    },
                    {
                        text:'Hz: ' + body.frequency,
                        
                        alignment: 'left',
                        fontSize: 12,
                        width: '25%'
                    }
                    ,
                    {
                        text:'Amps: ' + body.current,
                        
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
                        [ {text:'', alignment: 'left',fontSize: 10}, {text: 'ROTOR', margin: [0, 5, 0, 0], border: [true, true, true, true], fontSize: 12}, {text: 'STATOR', margin: [0, 5, 0, 0], border: [true, true, true, true], fontSize: 12}, {text: 'COIL RESISTANCE:                    OHMS', colSpan: 2, margin: [0, 5, 0, 0], fontSize: 12}, {text: ''}],
                        [ {text:'LENGTH:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: 'COIL RESISTANCE:                    OHMS', colSpan: 2, margin: [0, 0, 0, 0], fontSize: 12}, {text: ''}],
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
                        [ {text:'', alignment: 'left',fontSize: 10}, {text: 'ROTOR', margin: [0, 5, 0, 0], border: [true, true, true, true], fontSize: 12}, {text: 'STATOR', margin: [0, 5, 0, 0], border: [true, true, true, true], fontSize: 12}, {text: 'COIL RESISTANCE:                    OHMS', colSpan: 2, margin: [0, 5, 0, 0], fontSize: 12}, {text: ''}],
                        [ {text:'LENGTH:', alignment: 'left',fontSize: 12, fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray'}, {text: '', fillColor: 'lightgray', border: [false, false, true, false]}, {text: 'COIL RESISTANCE:                    OHMS', colSpan: 2, margin: [0, 0, 0, 0], fontSize: 12}, {text: ''}],
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
            
        ],
        defaultStyle: {
            font: 'Helvetica'
          }
    }

    return dd;
}

const createIARBack = () => {
    var dd = {
            pageSize: 'FOLIO',
            pageMargins: 25,

        content: [
            {
                table: {
                widths: ['100%'],
                heights: ['auto', 300, 'auto', 530],
                margin: [0, 5, 0, 15],
                body: [
                    [ {text:'SCOPE OF WORK'} ],
                    [ {text:''} ],
                [ {text:'DIAGRAM OF MOTOR'} ],
                [ {text:''} ],
                ]
            },
            alignment: 'center'
            },
        ],
        defaultStyle: {
            font: 'Helvetica'
        }
    }

    return dd
}

exports.createQuotationPDF2 = createQuotationPDF2;
exports.createQuotationPDFSingle2 = createQuotationPDFSingle2;
exports.createIARFront = createIARFront
exports.createIARBack = createIARBack