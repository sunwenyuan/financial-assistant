export function getPieOptions(title, data) {
  const pieOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    legend: {
      align: 'right'
    },
    title: {
      text: title
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y:.2f} SEK</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Brands',
      colorByPoint: true,
      data
    }]
  };
  return pieOptions;
}

export function getColumnOptions(title, categories, data) {
  const columnOptions = {
    chart: {
      type: 'column'
    },
    title: {
      text: title
    },
    xAxis: {
      categories,
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Cost (SEK)'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.2f} SEK</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: data
  };
  return columnOptions;
}
