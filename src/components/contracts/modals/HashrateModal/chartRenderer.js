import Highcharts, { color } from 'highcharts';

export const renderChart = data => {
  // const items = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 37, 52, 68, 86, 117, 144, 213, 217, 319, 258, 268, 259, 258, 275, 341, 363, 287, 358, 780, 696, 648, 713, 576, 143, 531, 0, 617, 421, 394, 433, 504, 443, 523, 651, 769, 451, 812, 1183, 1652, 743, 737, 1026, 1107, 760, 885, 683, 909, 719, 859, 636, 786, 793, 851, 806, 835, 872, 950, 980, 922, 1022, 892, 1146, 760, 1134, 1318, 1063, 1497, 1015, 1122, 1337, 1170, 1562, 860, 763, 794, 1233, 1222, 1006, 1248, 1180, 1469, 954, 1405, 1126, 1338, 939, 809, 991, 1499, 1565, 1315, 1090, 1249, 1014, 623, 945, 1022, 1331, 2072, 761, 747, 719, 908, 926, 1461, 1379, 1393, 1365, 1291, 1263, 1245, 1213, 1271, 1297, 1193, 1193, 1092, 1116, 1051, 1013, 842, 618, 739, 699, 634, 214, 508, 480, 322, 412, 128, 111, 91, 131, 128, 98, 65, 51, 37, 32, 20, 8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  // .map(x => x === 0 ? null : x)
  // .slice(0, 192);

  const d = new Date();
  d.setDate(d.getDate() - 1);

  const chart = {
    chart: {
      renderTo: 'container',
      type: 'spline'
    },
    title: {
      text: '',
      align: 'left'
    },

    legend: {
      // layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      symbolRadius: 0,
      labelFormatter: function() {
        if (this.name === 'TH/s') {
          return 'TH/s';
        }
        return '';
      }
      // itemMarginTop: 10,
      // itemMarginBottom: 10
    },

    xAxis: {
      type: 'datetime',
      tickInterval: 1000 * 3600, // tick every hour
      labels: {
        formatter: function() {
          return Highcharts.dateFormat('%H %M', this.value);
        }
      }
    },
    yAxis: {
      min: 0
    },
    tooltip: {
      formatter: function() {
        return `${Highcharts.dateFormat(
          '%m/%d/%Y %H %M',
          this.x
        )} </br> Hashrate (5min): ${this.y} TH/s`;
      }
    },
    plotOptions: {
      series: {
        name: 'TH/s',
        pointStart: d, // start date
        pointInterval: 1000 * 60 * 5 // data every 5 minutes SET 5
      },
      spline: {
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3
          }
        },
        marker: {
          enabled: false,
          radius: 2,
          states: {
            hover: {
              enabled: true,
              symbol: 'circle',
              radius: 2,
              lineWidth: 1
            }
          }
        }
      }
    },
    series: [
      {
        data: data
      },
      {
        name: 'markers',
        color: '#FFFFFF',
        data: Array.from(' '.repeat(288)) // 288
          .map((i, index) => [
            new Date().getTime() - index * 300000, // remove 5
            null
          ])
      }
    ]
  };
  return chart;
};
