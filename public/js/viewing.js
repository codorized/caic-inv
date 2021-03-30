// const { raw } = require("body-parser");

$('input[name=searchmode]').on('change', function(){
    if($(this).val() == 'keyword')
        $('input[name="searchfield"]').prop('placeholder', 'Enter Keyword')
    else if($(this).val() == 'tagid')
        $('input[name="searchfield"]').prop('placeholder', 'Enter TAG ID')
})

$('.pagination').on('click', '.page-link',  function(){
    var baseurl = window.location.protocol + "//" + window.location.host + "/";
    var paginateNum = parseInt($(this).html())

    var ajaxurl = baseurl+'motor/textsearch/page/'+paginateNum
    console.log($('#searchForm').serialize())
    $.ajax({   
        async: true, 
        method: 'POST', 
        data:  $('#searchForm').serialize(),            
        url: ajaxurl,        
        success: function (rawdata) {
            
            $('.recentItems').empty()
            var myTable = document.getElementById('newItem');
            var skipNo = parseInt($('input[name=limit]').val())
            var data

            if(rawdata[0].docs.length > 0)
                data = rawdata[0].docs   
            else 
                data = []

            if(rawdata[0].count.length > 0)
                $('#totalcount').html(rawdata[0].count[0].count + ' items total')
            else 
                $('#totalcount').html('0 items total')

            
            if(data.length > 0)
            {
                if(rawdata[0].count[0].count > skipNo)
                {
                    $('.paginationnav').show();

                    //Update pagination
                    var no = rawdata[0].count[0].count/skipNo
                    var no2 = Math.ceil(no)

                    $('.page-item').remove()
                    for(var i=0; i<no2; i++)
                        $('.pagination').append('<li class="page-item"><button class="page-link">'+(i+1)+'</button></li>')
                }   
                else 
                    $('.paginationnav').hide();

                for(var i=data.length-1; i >= 0; i--)
                {
                    var row = myTable.insertRow(0);
                    row.className += 'motorRows'
                    var c0 = row.insertCell(0);
                    var c1 = row.insertCell(1);
                    var c2 = row.insertCell(2);
                    var c3 = row.insertCell(3);
                    var c4 = row.insertCell(4);
                    var c5 = row.insertCell(5);
                    var c6 = row.insertCell(6);
                    var c7 = row.insertCell(7);
                    var c8 = row.insertCell(8);
                    
                    c0.innerHTML = '<a href="'+baseurl+'motor/motorItem/notstarted/'+ data[i].tagID +'" class="'+data[i].tagID+'">'+data[i].tagID+'</a>';
                    c0.className += 'tagid'
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    today = yyyy + '-' + mm + '-' + dd;
                    const diffTime = Math.abs(new Date(today) - new Date(data[i].datePulledOut));
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    c1.innerHTML = diffDays
                        
                    if (data[i].status == 'notstarted')
                        c2.innerHTML = 'Not Started'
                    else if (data[i].status == 'oncheckup')
                        c2.innerHTML = 'On Checkup'
                    else if (data[i].status == 'prelimdocs')
                        c2.innerHTML = 'Prelimdocs'
                    else if (data[i].status == 'onrewind')
                        c2.innerHTML = 'On Rewind'
                    else if (data[i].status == 'onfabrication')
                        c2.innerHTML = 'On Fabrication'
                    else if (data[i].status == 'inbaking')
                        c2.innerHTML = 'In Baking'
                    else if (data[i].status == 'assemblyandtesting')
                        c2.innerHTML = 'Assembly and Testing'
                    else if (data[i].status == 'painting')
                        c2.innerHTML = 'Painting'
                    else if (data[i].status == 'fordelivery')
                        c2.innerHTML = 'For Delivery'
                    else if (data[i].status == 'forbillingstatement')
                        c2.innerHTML = 'For Billing Statement'
                    else if (data[i].status == 'foror')
                        c2.innerHTML = 'For OR'
                    else if (data[i].status == 'completed')
                        c2.innerHTML = 'Completed'

                    if(data[i].company_.length > 0)
                        c3.innerHTML = data[i].company_[0].compname
                    c4.innerHTML = data[i].motorType
                    //c5.innerHTML = data[i].power
                    if(data[i].power_rpm.length > 0)
                        c5.innerHTML = data[i].power_rpm[0].power
                    else 
                        c5.innerHTML = ''
                    if(data[i].pmID != null)
                        c6.innerHTML = data[0].pmID
                    else 
                        c6.innerHTML = 'None'
                    c7.innerHTML = data[i].remarks

                    if(data[i].submotor.parent != null)
                        c8.innerHTML = "Submotor of " + data[i].submotor.parent
                    else 
                        c8.innerHTML = "No Submotor"
                }
            }
            else if(data.length <= skipNo || data.length <= 0)
                $('.paginationnav').hide();
        },
        error: function (xhr, text, error) {              
            alert('Error: ' + error);
        }
    
    })
})