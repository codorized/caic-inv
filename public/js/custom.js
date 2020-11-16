$( "tr" ).click(function() {
    const tagID = $(this).find('.tagid a')[0].innerHTML;
    console.log(tagID);
    $.magnificPopup.open({
        items: {
          src: getBaseUrl()+'motor/motorItemStage/'+tagID
        },
        closeOnBgClick: true,
        type: 'iframe',
      });
});

$( "#addmotorItem" ).click(function() {
  $.magnificPopup.open({
      items: {
        src: getBaseUrl()+'motor/newMotor'
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

$( "#addCompany" ).click(function() {
  $.magnificPopup.open({
      items: {
        src: getBaseUrl()+'company/newCompany'
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

$( "#addRewinder" ).click(function() {
  $.magnificPopup.open({
      items: {
        src: getBaseUrl()+'company/newRewinder'
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

$("tbody.recentItems").delegate("tr", "click", function(e) {
  const tagID = $(this).find('.tagid a')[0].innerHTML;
  console.log(tagID);
  $.magnificPopup.open({
      items: {
        src: getBaseUrl()+'motor/motorItemStage/'+tagID
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

function getBaseUrl() {
  var re = new RegExp(/^.*\//);
  return re.exec(window.location.href);
}


