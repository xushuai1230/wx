var wxCharts = require('../../../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
var pieChart2 = null;
var token;
Page({
  data: {
    toal_order: '0',
    has_order: '0',
    not_order: '0',
    time_order: '0',
    toal_source: '0',
    open_source: '0',
    close_source: '0',
    broken_source: '0'
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
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '成交量1',
        data: 0,
        color: '#AADCD0'
      }, {
        name: '成交量2',
        data: 0,
        color: '#59B99F'
      }, {
        name: '成交量3',
        data: 0,
        color: '#EDD16C'
      }],
      width: windowWidth,
      height: 150,
      dataLabel: false,
      legend: false,
      disablePieStroke: false,
      padding: 0
    });

    pieChart2 = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas2',
      type: 'pie',
      series: [{
        name: '成交量1',
        data: 0,
      }, {
        name: '成交量2',
        data: 0,
      }, {
        name: '成交量3',
        data: 0,
      }],
      width: windowWidth,
      height: 150,
      dataLabel: false,
      legend: false,
      disablePieStroke: false,
      padding: 0
    });
  },
  onShow: function () {
    var that = this;
    //  在页面展示之后先获取一次数据  
    GetData(that);
  }
});

var userID = 0;
// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetData = function (that) {
  wx.showLoading({
    title: '加载中',
  })
  var _this = that;
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetMainInfo',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token')
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      wx.hideLoading()
      var total_o, total_s;
      total_o = Number(res.data.data.FinishedOrderCount) + Number(res.data.data.NotFinishedOrderCount) + Number(res.data.data.OvertimeOrderCount);
      total_s = Number(res.data.data.RunningDeviceCount) + Number(res.data.data.NotRunningDeviceCount) + Number(res.data.data.BreakDowndeviceCount);
      _this.setData({
        toal_order: total_o,
        has_order: res.data.data.FinishedOrderCount,
        not_order: res.data.data.NotFinishedOrderCount,
        time_order: res.data.data.OvertimeOrderCount,
        toal_source: total_s,
        open_source: res.data.data.RunningDeviceCount,
        close_source: res.data.data.NotRunningDeviceCount,
        broken_source: res.data.data.BreakDowndeviceCount
      })

      var series = [{
        name: '成交量2',
        data: Number(res.data.data.FinishedOrderCount),
        color: '#AADCD0'
      }, {
        name: '成交量3',
        data: Number(res.data.data.NotFinishedOrderCount),
        color: '#59B99F'
      }, {
        name: '成交量4',
        data: Number(res.data.data.OvertimeOrderCount),
        color: '#EDD16C'
      }];
      pieChart.updateData({
        series: series
      });

      var series2 = [{
        name: '成交量2',
        data: Number(res.data.data.RunningDeviceCount),
        color: '#AADCD0'
      }, {
        name: '成交量3',
        data: Number(res.data.data.NotRunningDeviceCount),
        color: '#59B99F'
      }, {
        name: '成交量4',
        data: Number(res.data.data.BreakDowndeviceCount),
        color: '#EDD16C'
      }];
      pieChart2.updateData({
        series: series2
      });

    }
  });
}