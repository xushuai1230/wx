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
      type: 'column',
      categories: [ '已排', '未排', '逾期', '全部'],
      series: [{
        name: '数量1',
        data: [25, 20, 45, 100]
      }, {
        name: '数量2',
        data: [70, 40, 65, 175]
      }],
      yAxis: {
        format: function (val) {
          return val + '个';
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
