var wxCharts = require('../../../../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
var token;
Page({
  data: {
  },
  touchHandler: function (e) {
    console.log(pieChart.getCurrentDataIndex(e));
  },
  onLoad: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    pieChart = new wxCharts({
      canvasId: 'colCanvas',
      type: 'area',
      categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2017'],
      series: [{
        name: '生产量1',
        data: [70, 40, 65, 100, 34, 18],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '生产量2',
        data: [15, 20, 45, 37, 4, 80],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        format: function (val) {
          return val + '万';
        }
      },
      width: 320,
      height: 200
    });
  },
  onShow: function () {
    var that = this;
    //  在页面展示之后先获取一次数据  
    // GetData(that);
  }
});
