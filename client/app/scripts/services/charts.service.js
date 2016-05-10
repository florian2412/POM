'use strict';

/**
 * @ngdoc service
 * @name pomApp.utils
 * @description
 * # utils
 * Service in the pomApp for utils methods.
 */
angular.module('pomApp').factory('chartsService', Service);

function Service(utilsService) {

  var service = {};

  service.calculDataChart = calculDataChart;
  service.buildPieChart = buildPieChart;
  //service.buildBarChart = buildBarChart;
  service.buildBarChartTasksDuration = buildBarChartTasksDuration;
  service.buildColumnRangeChartTasksDuration = buildColumnRangeChartTasksDuration;

  return service;


  // Génère le bon format de donnée pour les graphs en fonction des données values et names en entrées
  function calculDataChart(values, names) {
    var dataChart = [];
    for (var j = 0; j < names.length; j++) {
      var dataJson = {
        'y': values[j],
        'name': names[j]
      };
      dataChart.push(dataJson);
    }
    return dataChart;
  }

  // Constuit un grah selon un emplacement, un titre, un format pour le survol de la souris et les données (values, names)
  function buildPieChart(id, title, pointFormat, data) {
    $(document).ready(function () {
      // Build the chart
      $('#' + id).highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: true,
          type: 'pie'
        },
        title: {
          text: title
        },
        tooltip: {
          pointFormat: pointFormat
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [{
          colorByPoint: true,
          data: data
        }]
      })
    })
  }

  // Constuit un bar grah
  function buildBarChartTasksDuration(id, title, pointFormat, legend, data) {
    $(document).ready(function () {
      $('#' + id).highcharts({
        chart: {
          type: 'column'
        },
        title: {
          text: title
        },
        xAxis: {
          categories: legend
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Durée'
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
              this.series.name + ': ' + this.y + '<br/>';
          }
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        series: [{
          name: 'Durée théorique',
          // Durée théorique de chaques tâches de 0 à n
          data: [1, 2, 3, 4],
          stack: 'Théorique'
        }, {
          name: 'Durée réelle',
          // Durée réelle de chaques tâches de 0 à n
          data: [3, 4, 4, 2],
          stack: 'Réelle'
        }]
      });
    });
  }

  function buildColumnRangeChartTasksDuration(id, title, pointFormat, legend, data) {
    $(document).ready(function () {
        $('#' + id).highcharts({
          chart: {
            type: 'columnrange',
            inverted: true
          },
          title: {
            text: 'bla'
          },
          subtitle: {
            text: 'Observed in Vik i Sogn, Norway'
          },
          xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          },
          yAxis: {
            title: {
              text: 'Temperature ( °C )'
            }
          },
          tooltip: {
            valueSuffix: '°C'
          },
          plotOptions: {
            columnrange: {
              dataLabels: {
                enabled: true,
                formatter: function () {
                  return this.y + '°C';
                }
              }
            }
          },
          legend: {
            enabled: false
          },
          series: [{
            name: 'Temperatures',
            data: [
              [-9.7, 9.4],
              [-8.7, 6.5],
              [-3.5, 9.4],
              [-1.4, 19.9],
              [0.0, 22.6],
              [2.9, 29.5],
              [9.2, 30.7],
              [7.3, 26.5],
              [4.4, 18.0],
              [-3.1, 11.4],
              [-5.2, 10.4],
              [-13.5, 9.8]
            ]
          }]
        });
      }
    )}

}

