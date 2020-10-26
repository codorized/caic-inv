
//Create a new form

$( "#addsubmotor" ).click(function() {
    var count = $("ul.motorpane li").length;
    $('.delmotor').remove();
    $('.motorpane').append('<li class="list-group-item d-flex justify-content-between lh-condensed submotor-'+count+'"  data-toggle="collapse" data-target="#collapseOne-'+count+'" aria-expanded="false" aria-controls="collapseOne-'+count+' "><div><h6 class="my-0">Sub Motor '+count+'</h6><small class="text-muted">ID: 1234</small></div>'
            + '<span class="text-muted delmotor submotor-'+count+'">'
              + '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
                + '<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>'
                + '<path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>'
              + '</svg>'
          + '</span></li>')
  
    
     $('.motorcount').html(count+1);
     $('.motorcount2').attr('value',count+1);
     $('.accordion').append(motorform(count, $('#maxID').val()));
  
  });
  
  
  $("ul.motorpane").delegate(".delmotor", "click", function(e) {
     var classList = $(this).attr('class').split(/\s+/);
     $('div.'+classList[2]).remove();
     $('li.'+classList[2]).remove();
     var count = $("ul.motorpane li").length;
     count--;
     $('li.submotor-'+count).append(
           '<span class="text-muted delmotor submotor-'+count+'">'
              + '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
                + '<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>'
                + '<path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>'
              + '</svg>'
          + '</span></li>'
     );
     $('.motorcount').html(count+1);
     $('.motorcount2').attr('value',count+1);
  });
  
  $( document ).ready(function() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + '-' + mm + '-' + dd;
      $(".currdate").val(today.toString());
  
      $('.pmcheck:radio[name=optradio]').change(function() {
          var i = (new Date().getTime()/1000);
          i = parseInt(i);
          if (this.value == 'pmnew') {
              $('.pmcontent').append('<div class="pminner pmnew col-md-6"><div"><label>New Code</label><input type="text" name="pmcode" class="form-control " placeholder="" value="PM-Jane-'+i+ '" disabled></div>');
              $('.pmexist').remove();
          }
          else if (this.value == 'pmexist') {
              $('.pmcontent').append('<div class="col-md-6 pmexist"><label > Available PM</label><select class="form-control " name="pmcode"><option>PM-Jane-'+1234+ '</option></select></div></div>');
              $('.pmnew').remove();
          }
          else{
               $('.pmexist').remove();
               $('.pmnew').remove();
          }
      });
  
  });

  $('form').submit(function(e) {
      $(':disabled').each(function(e) {
          $(this).removeAttr('disabled');
      })
      location.reload();
  });
  
  
  function motorform(count, maxID){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = dd + '-' + mm + '-' + yyyy;

      return '<div class="card submotor-'+count+'">'
                  + '<div class="card-header" id="headingOne">'
                    + '<h2 class="mb-0">'
                      + '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne-'+count+'" aria-expanded="true" aria-controls="collapseOne-'+count+'">'
                        + 'Sub Motor-'+count+''
                      + '</button>'
                    + '</h2>'
                  + '</div>'
                 + '<div id="collapseOne-'+count+'" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">'
                 + '<div class="card-body">'
                 + '<div class="row">'
                  + '<div class="col-md-6 mb-3">'
                    + '<label for="firstName">Date</label>'
                    + '<input type="text" class="form-control currdate" name="currdate-'+count+'" placeholder="" value="'+ today.toString() +'" required disabled>'
                  + '</div>'
                  + '<div class="col-md-6 mb-3">'
                    + '<label for="lastName">Motor ID</label>'
                    + '<input type="text" class="form-control" name="motorid-'+count+'" placeholder="" value="'+maxID+'" required disabled>'
                    + '<div class="invalid-feedback">'
                    +  'Valid last name is required.'
                    + '</div>'
                  + '</div>'
                  + '<div class="col-md-6 mb-3">'
                    + '<label for="firstName">Sales Representative</label>'
                    + '<input type="text" class="form-control" name="salesrep-'+count+'" placeholder="" value="Allann" required disabled="">'
                    + '<div class="invalid-feedback">'
                      + 'Valid first name is required.'
                    + '</div>'
                  + '</div>'
                  + '<div class="col-md-6 mb-3">'
                    + '<label for="firstName">Date Pulled Out</label>'
                    + '<input type="date" class="form-control" name="datepulledout-'+count+'" placeholder="" value="" required>'
                    + '<div class="invalid-feedback">'
                      + 'Valid first name is required.'
                    + '</div>'
                  + '</div>'
                  
                + '</div>'
                + '<div class="row">'
                  + '<div class="mb-3 col-md-6">'
                    + '<label for="username">Company</label>'
                    + '<select class="form-control " name="company-'+count+'" required>'
                      + '<option>Coca Cola</option>'
                      + '<option>Concepcion Durables Inc</option>'
                      + '<option>Honda</option>'
                      + '<option>Nestle</option>'
                      + '<option>Asia Brewery</option>'
                      + '<option>Enchanted Kingdom</option>'
                      + '<option>Gardenia</option>'
                    + '</select>'
                  + '</div>'
                  + '<div class="mb-3 col-md-6">'
                    + '<label for="username">Motor Type Brand</label>'
                    + '<select class="form-control" name="motortype-'+count+'" required>'
                      + '<option>Toshiba</option>'
                      + '<option>ABB</option>'
                      + '<option>TECO Warehousing</option>'
                      + '<option>Lincoln Electric</option>'
                      + '<option>Siemens</option>'
                      + '<option>Nidec Motor</option>'
                      + '<option>Rockwell Automation</option>'
                      + '<option>AMETEK</option>'
                      + '<option>Regal Beloit</option>'
                      + '<option>Johnson Electric</option>'
                      + '<option>Franklin Electrics</option>'
                      + '<option>Faulhaber Group</option>'
                      + '<option>General Electric (GE)</option>'
                      + '<option>WEG</option>'
                    + '</select>'
                  + '</div>'
                  + '<div class="mb-3 col-md-6 powerbset">'
                    + '<label class="powerrbset">'
                      + '<div class="radio">'
                        + '<label><input type="radio" name="powerrb-'+count+'" class="pmcheck" value="hp" checked>HP</label>'
                      + '</div>'
                      + '<div class="radio">'
                        + '<label><input type="radio" name="powerrb-'+count+'" class="pmcheck" value="kw">KW</label>'
                      + '</div>'
                    + '</label>'
                    + '<input type="text" class="form-control" name="powertext-'+count+'" placeholder="" value="" required>'
                  + '</div>'
                  + '<div class="col-md-6 mb-3">'
                    + '<label for="lastName">RPM</label>'
                    + '<input type="text" class="form-control" name="rpm-'+count+'" placeholder="" value="" required>'
                    + '<div class="invalid-feedback">'
                      + 'Valid last name is required.'
                    + '</div>'
                  + '</div>'
                + '</div>'
                + '<label for="firstName">Others:</label>'
                + '<div class="row col mb-3">'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="motor-assy-'+count+'" type="checkbox" name="motor-assy-'+count+'">'
                    + '<label class="custom-control-label" for="motor-assy-'+count+'">Motor Assy</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="ac-assy-'+count+'" type="checkbox" name="ac-assy-'+count+'">'
                      + '<label class="custom-control-label" for="ac-assy-'+count+'">A/C ASSY</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="fabrication-'+count+'" type="checkbox" name="fabrication-'+count+'">'
                    + '<label class="custom-control-label" for="fabrication-'+count+'">Fabrication</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="machining-'+count+'" type="checkbox" name="machining-'+count+'">'
                    + '<label class="custom-control-label" for="machining-'+count+'">Machining</label>'
                  + '</div>'
                + '</div>'
                + '<label for="firstName">Parts Checklist/Inspection Remarks: </label>'
                + '<div class="row col mb-3">'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="fan-cover-'+count+'" type="checkbox" name="fan-cover-'+count+'">'
                    + '<label class="custom-control-label" for="fan-cover-'+count+'">Fan Cover</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="stator-'+count+'" type="checkbox" name="stator-'+count+'">'
                    + '<label class="custom-control-label" for="stator-'+count+'">Stator</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="keystock-'+count+'" type="checkbox" name="keystock-'+count+'">'
                    + '<label class="custom-control-label" for="keystock-'+count+'">Keystock (CUÑA)</label>'
                  + '</div>'
                  
                + '</div>'
                + '<div class="row col mb-3">'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="fan-blade-'+count+'" type="checkbox" name="fan-blade-'+count+'">'
                    + '<label class="custom-control-label" for="fan-blade-'+count+'">Fan Blade</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="rotor-'+count+'" type="checkbox" name="rotor-'+count+'">'
                    + '<label class="custom-control-label" for="rotor-'+count+'">Rotor</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="centrifugal-'+count+'" type="checkbox" name="centrifugal-'+count+'">'
                    + '<label class="custom-control-label" for="centrifugal-'+count+'">Centrifugal Switch</label>'
                  + '</div>'
                 
                + '</div>'
                + '<div class="row col mb-3">'
                   + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="terminal-box-'+count+'" type="checkbox" name="terminal-box-'+count+'">'
                    + '<label class="custom-control-label" for="terminal-box-'+count+'">Terminal Box</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="pulley-'+count+'" type="checkbox" name="pulley-'+count+'">'
                    + '<label class="custom-control-label" for="pulley-'+count+'">Pulley</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="governor-switch-'+count+'" type="checkbox" name="governor-switch-'+count+'">'
                    + '<label class="custom-control-label" for="governor-switch-'+count+'">Governor Switch</label>'
                  + '</div>'
  
                + '</div>'
                + '<div class="row col mb-3">'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="terminal-'+count+'" type="checkbox" name="terminal-'+count+'">'
                    + '<label class="custom-control-label" for="terminal-'+count+'">Terminal Cover</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="carbon-'+count+'" type="checkbox" name="carbon-'+count+'">'
                    + '<label class="custom-control-label" for="carbon-'+count+'">Carbon Brush</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="capacitor-'+count+'" type="checkbox" name="capacitor-'+count+'">'
                    + '<label class="custom-control-label" for="capacitor-'+count+'">Capacitor</label>'
                  + '</div>'
                  
                + '</div>'
                + '<div class="row col mb-3">'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="terminal-block-'+count+'" type="checkbox" name="terminal-block-'+count+'">'
                    + '<label class="custom-control-label" for="terminal-block-'+count+'">Terminal Block</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="carbon-holder-'+count+'" type="checkbox" name="carbon-holder-'+count+'">'
                    + '<label class="custom-control-label" for="carbon-holder-'+count+'">Carbon Holder</label>'
                  + '</div>'
                  + '<div class="col custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="impeller-'+count+'" type="checkbox" name="impeller-'+count+'">'
                    + '<label class="custom-control-label" for="impeller-'+count+'">Impeller</label>'
                  + '</div>'
                + '</div>'
                + '<div class="row col mb-3">'
                  + '<div class="col-md-4 custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="bolts-and-nuts-'+count+'" type="checkbox" name="bolts-and-nuts-'+count+'">'
                    + '<label class="custom-control-label" for="bolts-and-nuts-'+count+'">Bolts &amp; Nuts</label>'
                  + '</div>'
                  + '<div class="col-md-4 custom-control custom-checkbox">'
                    + '<input class="custom-control-input" id="coupling-'+count+'" type="checkbox" name="coupling-'+count+'">'
                    + '<label class="custom-control-label" for="coupling-'+count+'">Coupling</label>'
                  + '</div>'
                + '</div>'
                + '<div class="form-group">'
                  + '<label for="exampleFormControlTextarea1">Remarks</label>'
                  + '<textarea class="form-control" id="remarks" rows="3" name="remarks-'+count+'"></textarea>'
                + '</div>'
                  + '</div>'
                + '</div>'
                 
                + '</div>'
              + '</div>'
              + '</div>'
  }	
  
  