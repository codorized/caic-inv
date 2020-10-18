$( "td" ).click(function() {
    $.magnificPopup.open({
        items: {
          src: '#test-form'
        },
        closeOnBgClick: true,
        type: 'inline',
      });
});