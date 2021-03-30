$(document).ready(function() {
    $("form").one('submit', function(){
        $('#submit').prop('disabled', true)
        $.magnificPopup.open({
            showCloseBtn: false,
            closeOnBgClick: false,
            items: {
              src: '<div class="white-popup" style="background:none"><div class="d-flex justify-content-center"><div class="spinner-border text-warning" role="status"><span class="visually-hidden"></span></div></div></div>', // can be a HTML string, jQuery object, or CSS selector
              type: 'inline',
            }
          });
    });


    $("input[name='closepane']").on('click', function(){
      if($('.motorcol').hasClass('col-md-8'))
      {
          $('.motorcol').removeClass('col-md-8');
          $('.motorcol').addClass('col-md-12');
          $(this).val('Open Pane')
      }else 
      {
          $('.motorcol').addClass('col-md-8');
          $('.motorcol').removeClass('col-md-12');
          $(this).val('Close Pane')
      }
  })
})




