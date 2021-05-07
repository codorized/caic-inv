
$("#searchForm").submit(function(e){
    e.preventDefault()
    $('.recentItems').empty()
    $('#newItem').empty()
    
    var value = $('input[name="searchfield"]').val()
    if(value == '')
        displayRecent($(this).serialize())
    else
        search($(this).serialize())
})

function displayRecent(formobj)
{
    
    var baseurl = window.location.protocol + "//" + window.location.host + "/";
    $.ajax({   
        async: true, 
        method: 'POST', 
        data: formobj,
        url: baseurl+'motor/motors',                          
        success: function (rawdata) { 
            
            $('.recentItems').empty()
            var myTable = document.getElementById('newItem');
            var data
            
            var skipNo = parseInt($('input[name=limit]').val())
            

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

                for(var i=data.length-1; i>=0; i--)
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
                    const diffTime = Math.abs(new Date(today) - new Date(data[0].datePulledOut));
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
}

function search(formobj)
{
    
    var baseurl = window.location.protocol + "//" + window.location.host + "/";
    
    $.ajax({   
        async: true, 
        method: 'POST', 
        data: formobj,
        url: baseurl+'motor/textsearch',                          
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
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  

var customColorFunction = function(schemeColors) {

    //var myColors = ['#FFEFD5', '#00ff00', '#0000ff']; // define/generate own colors
    var myColors = []

    for(var i=0; i< 300; i++)
    {
        myColors.push(getRandomColor())
    }

    // extend the color scheme with own colors
    Array.prototype.push.apply(schemeColors, myColors);

    return schemeColors; // optional: this is not needed if the array is modified in place
};

function loadSalesRep(ctx, data)
{
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                // label: '# of motors per sales rep',
                //data: [12, 7, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            maintainAspectRatio: false,
            title: {
                display: true,
                text: '# of Motors per sales rep'
            },
            legend: {
                display: false

            },
            plugins: {
                datalabels: {
                    anchor: 'center',
                    color: 'black',
                    labels: {
                        title: {
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        },
                        value: {
                            color: 'green'
                        },
                        index: {
                            align: 'end',
                            anchor: 'end',
                            color: 'black',
                            font: {size: 12},
                            formatter: function(val, context) {
                            
                                return "Php " + (parseFloat(data[context.dataIndex].grandTotal)).toFixed(2);
                            },
                            offset: 8,
                            opacity: function(ctx) {
                                return ctx.active ? 1 : 0.5;
                            }
                        }
                    }
                },
                colorschemes: {

                    scheme: 'brewer.Paired12'
            
                  }
            }
        },
    
       
    });

    for(var i=0; i<data.length; i++)
    {
        myChart.data.labels.push(data[i]._id);
        myChart.data.datasets.forEach((dataset) => {
            dataset.data.push(data[i].count);
        });
    }



    myChart.update();

    return myChart;
}


function getUrgentCount(ctx, data){

    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(200, 206, 86, 0.2)',
                    'rgba(100, 192, 192, 0.2)',
                    'rgba(153, 255, 255, 0.2)'
                ],
                label: 'Dataset 1'
            }],
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Urgent vs Regular Loads'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            plugins: {
                datalabels: {
                    anchor: 'center',
                    color: 'black',
                    labels: {
                        title: {
                            font: {
                                weight: 'bold'
                            }
                        },
                        value: {
                            color: 'green'
                        }
                    }
                }
            }
        }
    });

    for(var i=0; i<data.length; i++)
    {
        if(data[i]._id == 'on'){
            myChart.data.labels.push('urgent');
        }else{
            myChart.data.labels.push('not');
        }
        myChart.data.datasets.forEach((dataset) => {
            dataset.data.push(data[i].count);
        });
    }

    myChart.update();


    return myChart;
    
}

function getMotorCountByDate(ctx, data)
{          
		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: [{
					label: 'No of Motors By Date',
					backgroundColor:  'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                    ],
					fill: true,
				}]
			},
			options: {
        
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'Chart.js Line Chart'
					},
					tooltip: {
						mode: 'index',
						intersect: false,
					},
                    datalabels: {
                        display: false
                    }
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes:  [{
                        type: 'time',
                        time: {
                            unit: 'year',
                            min: moment().format('YYYY'),
                            max: moment('2021').add(1, 'year')
                        }
                    }]
				}
			}
		});
        
        for(var i=0; i<data.length; i++)
        {
            myChart.data.datasets[0].data.push({
                x: new Date(data[i]._id),
                y: data[i].count
            })
        }
        myChart.update();
        
        return myChart;
}

// function getMotorSalesRepByDate(ctx, data)
// {          
//     var myChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             datasets: []
//         },
//         options: {
    
//             responsive: true,
//             plugins: {
//                 title: {
//                     display: true,
//                     text: 'Chart.js Line Chart'
//                 },
//                 tooltip: {
//                     mode: 'index',
//                     intersect: false,
//                 },
//                 datalabels: {
//                     display: false
//                 }
//             },
//             hover: {
//                 mode: 'nearest',
//                 intersect: true
//             },
//             scales: {
//                 xAxes:  [{
//                     type: 'time',
//                     time: {
//                         unit: 'year',
//                         min: moment().format('YYYY'),
//                         max: moment('2021').add(1, 'year')
//                     }
//                 }]
//             }
//         }
//     });
    
    
//     for(var i=0; i<data.currSalesReps.length; i++)
//     {
//         var randomColor = Math.floor((Math.random() * 225) + 1)
//         myChart.data.datasets.push({  
//             label: data.currSalesReps[i]._id,
//             backgroundColor:  'rgba('+randomColor+', 99, 132, 0.2)',
//             borderColor: 'rgba('+randomColor+', 99, 132, 0.2)',
//             data: [
               
//             ],
//             fill: false
//         })
//     }


//     for(var i=0; i<data.salesrepByDate.length; i++)
//     {
        
//         for(k=0; k<myChart.data.datasets.length; k++)
//         {
//             for(var j=0; j<data.salesrepByDate[i].STATUS_GROUP.length; j++)
//             {
//                 if(myChart.data.datasets[k].label == data.salesrepByDate[i].STATUS_GROUP[j].STATUS)
//                 {
//                     myChart.data.datasets[k].data.push({
//                         x: new Date(data.salesrepByDate[i]._id),
//                         y: data.salesrepByDate[i].STATUS_GROUP[j].count
//                     })
//                 }
//             }
//         }
       
//     }

//     myChart.update();
    
//     return myChart;
// }

function getMotorSalesRepByDate(ctx, data)
{   

    var myChart = new Chart(ctx, {
        type: 'bar',
        
        data: {
            datasets: [
                // {
                //     label: 'Dataset 1',
                //     data: [{x:moment('2021-3-1'), y:10}, {x:moment('2021-4-1'), y:15}],
                //     //backgroundColor: 'rgba('+Math.floor((Math.random() * 255) + 1)+', '+Math.floor((Math.random() * 255) + 1)+', '+Math.floor((Math.random() * 255) + 1)+', 0.8)',
                // },
                // {
                //     label: 'Dataset 2',
                //     data: [{x:moment('2021-3-1'), y:20},{x:moment('2021-4-1'), y:20}, {x:moment('2021-6-1'), y:20}, {x:moment('2021-8-1'), y:20}],
                //     //backgroundColor: 'rgba('+Math.floor((Math.random() * 255) + 1)+', '+Math.floor((Math.random() * 255) + 1)+', '+Math.floor((Math.random() * 255) + 1)+', 0.8)',
                // },
                // {
                //     label: 'Dataset 3',
                //     data: [{x:moment('2021-3-1'), y:20}, {x:moment('2021-4-1'), y:20}, {x:moment('2021-8-1'), y:20}],
                //    // backgroundColor: 'rgba('+Math.floor((Math.random() * 255) + 1)+', '+Math.floor((Math.random() * 255) + 1)+', '+Math.floor((Math.random() * 255) + 1)+', 0.8)',
                // }
            ]

        },
        options: {
            plugins: {
                datalabels: 
                {
                    display: false
                },
                colorschemes: 
                {
                    custom: customColorFunction
                }
            },
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    stacked: true,
                    time: {
                        unit: 'month',
                        min: moment().format('YYYY'),
                        max: moment().add(5, 'month')
                    }
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        display: true
                    }
                }]
            }
        },
        
        responsive: true
    });
    
    var salesreps = []

    data.salesrepByDate.forEach(dataObj => {
        salesreps.push(dataObj._id.sr)
    })

    var uniqueNames = new Set(salesreps)
    uniqueNames = [...uniqueNames]
    

    for(var j=0; j<uniqueNames.length; j++)
    {
        myChart.data.datasets.push({
            label: uniqueNames[j],
            data: [],
            
        })

        for(var i=0; i<data.salesrepByDate.length; i++)
        {
            if(data.salesrepByDate[i]._id.sr == uniqueNames[j])
            {
                myChart.data.datasets[j].data.push({
                    x: data.salesrepByDate[i]._id.year+"-"+data.salesrepByDate[i]._id.month+"-1",
                    y: (data.salesrepByDate[i].grandTotal).toFixed(2)
                })
            }
            
        }
    }

    myChart.update();
    
    return myChart;
}

function getMotorStagesByDate(ctx, data)
{          
		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: [
                {   
					label: 'Not Started',
					backgroundColor:  'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 5}, {x: '2021-2-1', y: 25},{x: '2021-3-1', y: 35}
                    ],
					fill: false,
				},
                {
					label: 'Checked up',
					backgroundColor:  'rgba(235, 119, 52, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'Documented',
					backgroundColor:  'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'Rewinded',
					backgroundColor:  'rgba(235, 180, 52, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'Fabricated',
					backgroundColor:  'rgba(195, 235, 52, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'Baked',
					backgroundColor:  'rgba(76, 235, 52, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'Assembled and Tested',
					backgroundColor:  'rgba(52, 235, 180, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'Painted',
					backgroundColor:  'rgba(52, 162, 235, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'Delivered',
					backgroundColor:  'rgba(119, 52, 235, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'Billed',
					backgroundColor:  'rgba(220, 52, 235, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'OR Ready',
					backgroundColor:  'rgba(235, 52, 162, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				},
                {
					label: 'Completed',
					backgroundColor:  'rgba(48, 1, 13, 0.2)',
					borderColor: 'rgba(255, 99, 132, 0.2)',
					data: [
                        // {x: '2021-1-1', y: 10}, {x: '2021-2-1', y: 20},{x: '2021-3-1', y: 30}
                    ],
					fill: false,
				}
                    ]
			},
			options: {
        
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'Chart.js Line Chart'
					},
					tooltip: {
						mode: 'index',
						intersect: false,
					},
                    datalabels: {
                        display: false
                    }
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes:  [{
                        type: 'time',
                        time: {
                            unit: 'year',
                            min: moment().format('YYYY'),
                            max: moment('2021').add(1, 'year')
                        }
                    }]
				}
			}
		});

        for(var i=0; i<data.length; i++)
        {
            for(var j=0; j<data[i].length; j++)
            {
                myChart.data.datasets[i].data.push({
                    x: new Date(data[i][j]._id),
                    y: data[i][j].count
                })
            }
        }
        myChart.update();
        
        return myChart;
}


function getHPandKW(ctx, data)
{       
        var hpval = 0; 
        var kwval = 0;

        if(data[0] != null && data[1] != null)
        {
            if(data[0]._id == 'HP') 
            {
                hpval = data[0].count
                kwval = data[1].count 
            }else
            {
                hpval = data[1].count
                kwval = data[0].count 
            }
        }
        else{
            if(data[0] != null && data[0]._id == 'HP')
            {
                hpval = data[0].count
                kwval = 0 
            }
            else if(data[0] != null && data[0]._id == 'KW')
            {
                hpval = 0
                kwval = data[0].count
            } 
        }
        
    
        
		var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                label: 'HP and KW Distribution',
                datasets: [{
                    label: 'HP',
                    // backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1,
                    data: [
                        hpval
                    ]
                }, {
                    label: 'KW',
                    // backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                    backgroundColor: 'rgba(63, 63, 191, 0.73)',
                    borderWidth: 1,
                    data: [
                        kwval
                    ]
                }]
    
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Chart.js Bar Chart'
                    }
                }
            }
		});
        
        return myChart;
}

function getClients(ctx, data){
    
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    anchor: 'center',
                    color: 'black',
                    labels: {
                        title: {
                            font: {
                                weight: 'bold'
                            }
                        },
                        value: {
                            color: 'green'
                        }
                    }
                },
                colorschemes: {
                    
                    custom: customColorFunction
                }
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Client Chart'
            }
        }
    });

    myChart.data.datasets.push({data:[]})
    for(var i=0; i<data.length; i++)
    {
        myChart.data.labels.push(data[i]._id[0]);
        myChart.data.datasets[0].data.push(data[i].count)
    }   

    myChart.update();

    return myChart;
}


