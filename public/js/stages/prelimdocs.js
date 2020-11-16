
function stator(ctr, scope)
{
    var a = '';
    // console.log(scope);
    for(var i=0; i<scope.length; i++)
    {
        var name = ''
        if(scope[i].name == 'stator-inspection-'+ctr) name = 'Inspection and Checking of unit and Data Recording';
        if(scope[i].name == 'stator-complete-rewinding') name = 'Complete Reconditioning Package';
        if(scope[i].name == 'stator-complete-recon') name = 'Complete Reconditioning Package';
        if(scope[i].name == 'conversion-'+ctr) name = 'Conversion of motor any parameter';

        a  +=  '<tr>'
                + '<th>' + name + '</th>'
                + '<td>'
                + '<input class="form-control" type="text" name="stator-qty-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="stator-unitcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="stator-totalcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
            + '</tr>';
    }

    return a;
}

function accessories(ctr, scope)
{
    var a = '';
    var name = '';
    for(var i=0; i<scope.length; i++)
    {

        if(scope[i]['acce-options-capacitor1'] && scope[i]['acce-options-capacitor2']) name = scope[i]['acce-options-capacitor1'] + ' of ' + scope[i]['acce-options-capacitor2'] + ' Capacitor'; 
        if(scope[i]['acce-options-fanblade1'] && scope[i]['acce-options-fanblade2'])  name = scope[i]['acce-options-fanblade1'] + ' of ' + scope[i]['acce-options-fanblade2'] + ' Fan Blade'; 
        if(scope[i]['acce-options-oilseal1'] && scope[i]['acce-options-oilseal2'])  name = scope[i]['acce-options-oilseal1'] + ' of ' + scope[i]['acce-options-oilseal2'] + ' Oil Seal'; 
        if(scope[i]['acce-options-shaftseal1'] && scope[i]['acce-options-shaftseal2']) name = scope[i]['acce-options-shaftseal1'] + ' of ' + scope[i]['acce-options-shaftseal2'] + ' Shaft Seal'; 
        if(scope[i]['acce-options-oring-or-packing1']) name = 'Replacement of ' + scope[i]['acce-options-oring-or-packing1']; 
        if(scope[i].name == 'rotor-loadside-'+ctr) name = 'Replacement  of bearing (Load Side)';
        if(scope[i].name == 'rotor-fanslide-'+ctr) name = 'Replacement  of bearing (Fan Side)';

        if(scope[i].name == 'rotor-gearbox1-'+ctr) name = 'Replacement  of bearing (Gear Box) '+(i+1);
        if(scope[i].name == 'rotor-gearbox2-'+ctr) name = 'Replacement  of bearing (Gear Box) '+(i+1);
        if(scope[i].name == 'rotor-gearbox3-'+ctr) name = 'Replacement  of bearing (Gear Box) '+(i+1);
        if(scope[i].name == 'rotor-gearbox4-'+ctr) name = 'Replacement  of bearing (Gear Box) '+(i+1);
        if(scope[i].name == 'rotor-gearbox5-'+ctr) name = 'Replacement  of bearing (Gear Box) '+(i+1);
        if(scope[i].name == 'rotor-gearbox6-'+ctr) name = 'Replacement  of bearing (Gear Box) '+(i+1);


        a  +=  '<tr>'
                + '<th>' + name + '</th>'
                + '<td>'
                + '<input class="form-control" type="text" name="acce-item-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="acce-qty-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="acce-unitcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="acce-totalcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
            + '</tr>';
    }

    return a;
}

function mechanical(ctr, scope)
{
    var a = '';
    var name = '';
    for(var i=0; i<scope.length; i++)
    {
        if(scope[i].name == 'acce-fancover-'+ctr) name = 'Fabrication of Fan Cover';
        if(scope[i].name == 'acce-terminal-'+ctr) name = 'Fabrication of Terminal Cover';
        if(scope[i].name == 'acce-wielding-'+ctr) name = 'Welding of Endplate';
        if(scope[i].name == 'acce-terminalpost-'+ctr) name = 'Fabrication of Terminal Post';
        if(scope[i]['acce-options-capilla-or-gear1'] && scope[i]['acce-options-capilla-or-gear1']) name = scope[i]['acce-options-capilla-or-gear1'] + ' of ' + scope[i]['acce-options-capilla-or-gear2']; 
        if(scope[i].name == 'acce-cable-'+ctr) name = 'Fabrication of Adaptor Cable';
        if(scope[i].name == 'acce-alignment-'+ctr) name = 'Fabrication of Shafting including Alignment';
        if(scope[i].name == 'acce-finge-coupling-'+ctr) name = 'Replacement of Flange Coupling including Reboring';
        if(scope[i].name == 'acce-shafting-'+ctr) name = 'Build up and Machining of Shafting';
        if(scope[i].name == 'acce-welding-motor-'+ctr) name = 'Welding of Motor Base';
        if(scope[i].name == 'acce-reboring-housing-'+ctr) name = 'Reboring of Bearing Housing';
        if(scope[i].name == 'acce-sleeving-'+ctr) name = 'Sleeving of Bearing Housing';
       


        a  +=  '<tr>'
                + '<th>' + name + '</th>'
                // + '<td>'
                // + '<input class="form-control" type="text" name="mech-item-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                // + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="mech-qty-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="mech-unitcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="mech-totalcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
            + '</tr>';
    }

    return a;
}

function dynamic(ctr, scope)
{
    var a = '';
    var name = '';
    for(var i=0; i<scope.length; i++)
    {
       
        if(scope[i]['dynamic-options2']) name = scope[i]['dynamic-options2']; 
       
        a  +=  '<tr>'
                + '<th>' + name + '</th>'
                + '<td>'
                + '<input class="form-control" type="text" name="dynamic-qty-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="dynamic-unitcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="dynamic-totalcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
            + '</tr>';
    }

    return a;
}

function misc(ctr, scope)
{
    var a = '';
    var name = '';
    for(var i=0; i<scope.length; i++)
    {  
        a  +=  '<tr>'
                + '<th>' + scope[i].name + '</th>'
                + '<td>'
                + '<input class="form-control" type="text" name="misc-qty-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="misc-unitcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
                + '<td>'
                + '<input class="form-control" type="text" name="misc-totalcost-' +ctr+ '-'+ (i+1) +'" placeholder="" required="">'
                + '</td>'
            + '</tr>';
    }

    return a;
}



function prelimdocs(ctr, submotor){
    // console.log(submotor);
        
            
    return '<div class="card" submotor-'+ctr+'">'
        + '<div class="card-header" id="headingOne-'+ctr+'">'
        + '<h2 class="mb-0">'
            + '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne-'+ctr+'" aria-expanded="false" aria-controls="collapseOne-'+ctr+'">Sub Motor ' + ctr+ '</button>'
        + '</h2>'
        + '</div>'
        + '<div class="collapse" id="collapseOne-'+ctr+'" aria-labelledby="headingOne-'+ctr+'" data-parent="#accordionExample" style="">'
        + '<div class="card-body">'
            + '<div class="row">'
            + '<div class="col-md-6 mb-3">'
                + '<label for="voltage">Name of Rewinder</label>'
                + '<input class="form-control" type="text" name="voltage-'+ctr+'" placeholder="" required="">'
            + '</div>'
            + '<div class="col-md-6 mb-3">'
                + '<label for="download">Before Image</label>'
                + '<input class="form-control btn-warning" type="button" name="beforeimage-'+ctr+'" required="" value="Upload">'
            + '</div>'
            + '</div>'
            + '<div class="row">'
            + '<div class="col-md-6 mb-3" id="qformcont">'
                + '<label for="download">Quotation Form</label>'
                + '<input class="form-control btn-warning" id="qform" type="button" name="downloadqform-'+ctr+'" required="" value="Generate">'
            + '</div>'
            + '</div>'
            + '<div class="card">'
            + '<div class="card-header" id="headingOne">'
            + '<h5 class="mb-0">'
                + '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#statorassembly-'+ctr+'" aria-expanded="false" aria-controls="statorassembly-'+ctr+'">Stator Assembly</button>'
            + '</h5>'
        + '</div>'
        + '<div class="collapse" id="statorassembly-'+ctr+'" aria-labelledby="headingOne" data-parent="#statorassembly-'+ctr+'">'
            + '<div class="card-body">'
            + '<table class="table">'
                + '<thead>'
                + '<tr>'
                    + '<th scope="col">Name</th>'
                    + '<th scope="col">Qty</th>'
                    + '<th scope="col">Unit Cost</th>'
                    + '<th scope="col">Total Cost</th>'
                + '</tr>'
                + '</thead>'
                + '<tbody>' 
                + stator(ctr, submotor.stator)
                + '</tbody>'
                + '</table>'
            + '</div>'
            + '</div>'
        + '</div>'
        + '<div class="card">'
            + '<div class="card-header" id="headingOne">'
            + '<h5 class="mb-0">'
                + '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#rotorassembly-'+ctr+'" aria-expanded="false" aria-controls="rotorassembly-'+ctr+'">Accessories</button>'
            + '</h5>'
            + '</div>'
            + '<div class="collapse" id="rotorassembly-'+ctr+'" aria-labelledby="headingOne" data-parent="#rotorassembly-'+ctr+'">'
                + '<div class="card-body">'
                + '<table class="table">'
                    + '<thead>'
                    + '<tr>'
                        + '<th scope="col">Name</th>'
                        + '<th scope="col">Item</th>'
                        + '<th scope="col">Qty</th>'
                        + '<th scope="col">Unit Cost</th>'
                        + '<th scope="col">Total Cost</th>'
                    + '</tr>'
                    + '</thead>'
                    + '<tbody>'
                    + accessories(ctr, submotor.accessories)
                    + '</tbody>'
                    + '</table>'
                + '</div>'
                + '</div>'
            + '</div>'
            + '<div class="card">'
                + '<div class="card-header" id="headingOne">'
                + '<h5 class="mb-0">'
                    + '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#accessories-'+ctr+'" aria-expanded="false" aria-controls="accessories-'+ctr+'">Mechanical</button>'
                + '</h5>'
            + '</div>'
            + '<div class="collapse" id="accessories-'+ctr+'" aria-labelledby="headingOne" data-parent="#accessories-'+ctr+'">'
                + '<div class="card-body">'
                + '<table class="table">'
                    + '<thead>'
                    + '<tr>'
                        + '<th scope="col">Name</th>'
                        + '<th scope="col">Item</th>'
                        + '<th scope="col">Qty</th>'
                        + '<th scope="col">Unit Cost</th>'
                        + '<th scope="col">Total Cost</th>'
                    + '</tr>'
                    + '</thead>'
                    + '<tbody>'
                    + mechanical(ctr, submotor.mechanical)
                    + '</tbody>'
                + '</table>'
                + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="card">'
            + '<div class="card-header" id="headingOne">'
                + '<h5 class="mb-0">'
                + '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#dynamicbalance-'+ctr+'" aria-expanded="false" aria-controls="dynamicbalance-'+ctr+'">Dynamic Balanacing of</button>'
                + '</h5>'
            + '</div>'
            + '<div class="collapse" id="dynamicbalance-'+ctr+'" aria-labelledby="headingOne" data-parent="#dynamicbalance-'+ctr+'">'
                + '<div class="card-body">'
                + '<table class="table">'
                    + '<thead>'
                    + '<tr>'
                        + '<th scope="col">Name</th>'
                        + '<th scope="col">Qty</th>'
                        + '<th scope="col">Unit Cost</th>'
                        + '<th scope="col">Total Cost</th>'
                    + '</tr>'
                    + '</thead>'
                    + '<tbody>'
                    + dynamic(ctr, submotor.dynamic)
                    + '</tbody>'
                + '</table>'
                + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="card">'
                + '<div class="card-header" id="headingOne">'
                    + '<h5 class="mb-0">'
                    + '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#misc-'+ctr+'" aria-expanded="false" aria-controls="misc-'+ctr+'">Miscelleneous</button>'
                    + '</h5>'
                + '</div>'
                + '<div class="collapse" id="misc-'+ctr+'" aria-labelledby="headingOne" data-parent="#misc-'+ctr+'" style="">'
                    + '<div class="card-body">'
                    + '<table class="table">'
                        + '<thead>'
                        + '<tr>'
                            + '<th scope="col">Name</th>'
                            + '<th scope="col">Qty</th>'
                            + '<th scope="col">Unit Cost</th>'
                            + '<th scope="col">Total Cost</th>'
                        + '</tr>'
                        + '</thead>'
                        + '<tbody>'
                        + misc(ctr, submotor.misc)
                        + '</tbody>'
                    + '</table>'
                    + '</div>'
                + '</div>'
            + '</div>'
        + '</div>'
        + '</div>'
    + '</div>';
  }	
  