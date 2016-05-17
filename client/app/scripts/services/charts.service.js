'use strict';

/**
 * @ngdoc service
 * @name pomApp.utils
 * @description
 * # utils
 * Service in the pomApp for charts methods.
 */
angular.module('pomApp').factory('chartsService', Service);

/**
 * Service permettant de charger des graphiques avec leurs données
 *
 * @returns {{}}
 * @constructor
 */
function Service() {

  var service = {};

  service.calculDataChart = calculDataChart;
  service.buildPieChart = buildPieChart;
  service.buildBarChartTasksDuration = buildBarChartTasksDuration;
  service.buildBarChartProjectsByStatus = buildBarChartProjectsByStatus;
  service.buildBarChartTasksByProjects = buildBarChartTasksByProjects;

  return service;

  /**
   * Génère le bon format de donnée pour les graphs en fonction des données values et names en entrées
   *
   * @param values
   * @param names
   * @returns {Array}
   */
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

  /**
   * Constuit un pie grah selon un emplacement, un titre, un format pour le survol de la souris et les données (values, names)
   *
   * @param id
   * @param title
   * @param pointFormat
   * @param data
   */
  function buildPieChart(id, title, pointFormat, data) {
    $(document).ready(function () {
      // Build the chart
      $('#' + id).highcharts({
        chart: {
          backgroundColor: "#E0F7FA",
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
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          colorByPoint: true,
          data: data
        }]
      })
    })
  }

  // Constuit un bar grah
  /**
   *
   * @param id
   * @param title
   * @param pointFormat
   * @param legend
   * @param theoricData
   * @param realData
   */
  function buildBarChartTasksDuration(id, title, pointFormat, legend, theoricData, realData) {
    $(document).ready(function () {
      $('#' + id).highcharts({
        chart: {
          backgroundColor: "#FFF3E0",
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
          },
          pointFormat: pointFormat
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        series: [{
          name: 'Durée théorique',
          // Durée théorique de chaques tâches de 0 à n
          data: theoricData,
          stack: 'Théorique'
        }, {
          name: 'Durée réelle',
          // Durée réelle de chaques tâches de 0 à n
          data: realData,
          stack: 'Réelle'
        }],
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        }
      });
    });
  }

  function buildBarChartProjectsByStatus(id, title, pointFormat, legend, data) {
    $(document).ready(function () {
      $('#' + id).highcharts({
        chart: {
          backgroundColor: "#F1F8E9",
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
            text: 'Nombre de projets'
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
          name: 'Nombre de projets',
          data: data,
          stack: 'Théorique'
        }],
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        }
      });
    });
  }

  function buildBarChartTasksByProjects(id, title, legend, data) {
    $(document).ready(function () {
      $('#' + id).highcharts({
        chart: {
          type: 'bar'
        },
        title: {
          text: title
        },
        xAxis: {
          categories: legend
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Nombre'
          },
          tickInterval: 1
        },
        legend: {
          reversed: true
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: data,
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        }
      });
    });
  }

}

