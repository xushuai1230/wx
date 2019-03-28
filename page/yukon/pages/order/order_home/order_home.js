var app = getApp()
Page({
  goToOrder1: function (event) {
    wx.navigateTo({
      url: '../order?code=销售订单',
    })
  },
  goToOrder2: function (event) {
    wx.navigateTo({
      url: '../order?code=制造订单',
    })
  },
  goToOrder3: function (e) {
    wx.navigateTo({
      url: '../order_add/order_add?code=紧急插单',
    })
  },
  goToOrder4: function (e) {
    wx.navigateTo({
      url: '../order_add/order_add?code=交期答复',
    })
  },
  goToOrder5: function (event) {
    wx.navigateTo({
      url: '../order?code=试排结果',
    })
  },
  goPC: function (e) {
    var that = this;
    GetSchedule(that);
  },
  data: {
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    array: ['前道工序计划', '后道工序计划', '综合计划', '计算物料需求', '订单展开']
  },
  bindPickerChange: function(e){
    console.log(this.data.array[e.detail.value]);
    var that = this;
    var schedule = this.data.array[e.detail.value];
    GetSchedule(that, schedule);
  }
})


var GetSchedule = function (that, schedule) {
  var that = that;
  var data = {
    "CMD": schedule
    //,"Accessmodle": "resetcopy"
  }
  var data2 = JSON.stringify(data);
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/Schedule',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      apsParam: data2
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      wx.showToast({ title: '排程成功', });
    }
  });
}