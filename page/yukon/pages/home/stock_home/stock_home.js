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
      type: 'line',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: '库存量1',
        data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }, {
          name: '库存量2',
        data: [0.30, 0.37, 0.65, 0.78, 0.69, 0.94],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        title: '库存数量',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
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
