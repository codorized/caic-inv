$( ".motorRows" ).click(function() {
    var baseurl = window.location.protocol + "//" + window.location.host + "/";
    const tagID = $(this).find('.tagid a, .tagid p')[0].innerHTML;
    

    $.magnificPopup.open({
        items: {
          src: baseurl+'motor/motorItemStage/'+tagID
        },
        closeOnBgClick: false,
        overflowY: "hidden",
        type: 'iframe',
        callbacks: {
          open: function() {
              $('body').css('overflow-x','hidden')
          },
          close: function() {
              $('body').css('overflow-x','scroll')
          }
       }
    });

});


$( "#addmotorItem" ).click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  
  $.magnificPopup.open({
      items: {
        src: baseurl+'motor/newMotor'
      },
      closeOnBgClick: false,
      overflowY: "hidden",
      type: 'iframe'
      
    });
});

$( "#addSubMotorItem" ).click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  $.magnificPopup.open({
      items: {
        src: baseurl+'motor/newSubmotor'
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});


$( "#addCompany" ).click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  $.magnificPopup.open({
      items: {
        src: baseurl+'company/single/new'
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

$( "#addRewinder" ).click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  $.magnificPopup.open({
      items: {
        src: baseurl+'rewinder/single/new'
      },
      closeOnBgClick: true,
      type: 'iframe',
    }); 
});

$("tbody.recentItems").delegate("tr", "click", function(e) {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  const tagID = $(this).find('.tagid a')[0].innerHTML;
  $.magnificPopup.open({
      items: {
        src: baseurl+'motor/motorItemStage/'+tagID
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

//Add user
$( "#addUser" ).click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  $.magnificPopup.open({
      items: {
        src: baseurl+'register'
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});


//Rewinder
$(".rewinderRows .id").click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  var id =  $(this).html();
  $.magnificPopup.open({
      items: {
        src: baseurl+'rewinder/single/'+id
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

//Company
$(".companyRows .id").click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  var id =  $(this).html();
  $.magnificPopup.open({
      items: {
        src: baseurl+'company/single/'+id
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

//Company
$(".viewMotorItem").click(function() {

  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  var id = $(this).parent().parent().parent().parent().find('.id').html()
 
  $.magnificPopup.open({
      items: {
        src: baseurl+'company/single/search/motor/'+id
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

//User
$(".userRows .id").click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  var id =  $(this).html();
  $.magnificPopup.open({
      items: {
        src: baseurl+'user/single/'+id
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

$("#changePassword").click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  var id =  $(this).html();
  $.magnificPopup.open({
      items: {
        src: baseurl+'user/changepassword'
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

$( "#viewLogbook" ).click(function() {
  var baseurl = window.location.protocol + "//" + window.location.host + "/";
  
  $.magnificPopup.open({
      items: {
        src: baseurl+'logbook'
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

function test()
{
  $('#logout').click()
}
