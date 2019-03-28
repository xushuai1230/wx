var app = getApp()
Page({
  data: {
    code: '',
    name: '',
    noneHidden:false
  },
  onLoad: function (option) {
    this.data.code = option.code;
    this.setData({
      code: option.code
    });
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    GetList(that);
    GetNewList(that,"2");
  }
})

// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetList = function (that) {
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetCustomInfo',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      CustomCode: that.data.code
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      that.setData({
        code: res.data.data.Code,
        name: res.data.data.Code
      });
    }
  });
}

var GetNewList = function (that, mtype) {
  wx.showLoading({
    title: '加载中',
  })
  console.info(that.data.code);
  var json = {};
  json.Name = 'Order';
  json.Filter = "me.TopOrder.Client=='" + that.data.code+ "'";
  // json.Properties = ["ID", "code", "PlantAssResource", "Item", "LastCompleteTime", "PlantAmount","PlantBeginTime", "PlanEndTime"];

  console.info(JSON.stringify(json));
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetDataList',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      tableName: JSON.stringify(json)
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      wx.hideLoading();
      that.setData({
        list0: res.data.data
      });

      if (res.data.data.length != 0) {
        that.setData({
          noneHidden: true
        });
      } else {
        that.setData({
          noneHidden: false
        });
      }

    }
  });
}
