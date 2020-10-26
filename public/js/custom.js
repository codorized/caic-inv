$( "tr" ).click(function() {
    const tagID = $(this).find('.tagid a')[0].innerHTML;
    console.log(tagID);
    $.magnificPopup.open({
        items: {
          src: getBaseUrl()+'motorItemStage/'+tagID
        },
        closeOnBgClick: true,
        type: 'iframe',
      });
});

$( "#addmotorItem" ).click(function() {
  $.magnificPopup.open({
      items: {
        src: getBaseUrl()+'newMotor'
      },
      closeOnBgClick: true,
      type: 'iframe',
    });
});

function getBaseUrl() {
  var re = new RegExp(/^.*\//);
  return re.exec(window.location.href);
}