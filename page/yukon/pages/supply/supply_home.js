// page/yukon/pages/supply/supply_home.js
Page({
  goToToday: function (event) {
    wx.navigateTo({
      url: 'supply?code=today',
    })
  },
  goToTomorrow: function (event) {
    wx.navigateTo({
      url: 'supply?code=tomorrow',
    })
  },
  goToNext: function (event) {
    wx.navigateTo({
      url: 'supply?code=next',
    })
  },
  onLoad: function (option) {
    var that = this;
    PostYanQi(that);
  }
})


// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var PostYanQi = function (that) {
  var json = {};
  json.Name = 'Order';
  var child_json = {};
  child_json.Code = 'NewOrder1';
  child_json.Type = '预计入库';
  child_json.Item = '物品-B-原材料';
  child_json.Amount = '200';
  child_json.LastCompleteTime = '2017-12-23';
  json.PropertyValueMap = child_json;
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
      that.setData({
        code: res.data.data.Code,
        kehu: res.data.data.Name,
        product: res.data.data.Item,
        num: res.data.data.Amount,
        time: res.data.data.ArrivalTime,
        list: res.data.data.SubCollection
      });
    }
  });
}
