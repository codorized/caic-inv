
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
                    anchor: 'end',
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

function getClients(ctx, data){
    // console.log(data);
    var myChart = new Chart(ctx, {
        type: 'polarArea',
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
                label: 'My dataset' // for legend
            }],
        },
        options: {
            responsive: true,
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Client Chart'
            },
            scale: {
                ticks: {
                    beginAtZero: true
                },
                reverse: false
            },
            animation: {
                animateRotate: false,
                animateScale: true
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
       
        myChart.data.labels.push(data[i]._id);
        myChart.data.datasets.forEach((dataset) => {
            dataset.data.push(data[i].count);
        });
    }
    myChart.update();

    return myChart;
}
