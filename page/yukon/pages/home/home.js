Page({
  goToOrder: function () {
    wx.navigateTo({
      url: 'order_home/order_home',
    })
  }, 
  goToSource: function () {
    wx.navigateTo({
      url: 'source_home/source_home',
    })
  }, 
  goToAbility: function () {
    wx.navigateTo({
      url: 'ability_home/ability_home',
    })
  }, 
  goToStock: function () {
    wx.navigateTo({
      url: 'stock_home/stock_home',
    })
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