Page({
  data: {
    source_num: 0,
    order_num: 0,
    num: 0,
    numHidden: true,
    order_numHidden: true,
    source_numHidden: true
  },
  goToOrder: function () {
    wx.navigateTo({
      url: 'danger_order_detail/danger_order_detail?code=订单延期',
    })
  },
  goToWuliao: function () {
    wx.navigateTo({
      url: 'danger_detail/danger_detail?code=物料延期',
    })
  },
  goToShebei: function () {
    wx.navigateTo({
      url: 'danger_source_detail/danger_source_detail?code=设备异常',
    })
  },
  onLoad: function (option) {
    var that = this;
    GetList(that);
    GetResourceList(that);
    GetOrderList(that);
  }
});

var GetList = function (that) {
  wx.showLoading({
    title: '加载中',
  })

  var json = {};
  json.Name = 'Order';
  json.Filter = "me.Type=='预计入库'";
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
      if (res.data == null || res.data == '') {
        that.setData({
          numHidden: true
        });
      } else if (res.data.data.length != 0)
      {
        that.setData({
          numHidden: false
        });
        that.setData({
          num: res.data.data.length,
        });
      }else{
        that.setData({
          numHidden: true
        });
      }
    }
  });
}

  var GetOrderList = function (that) {
    wx.showLoading({
      title: '加载中',
    })

    var json = {};
    json.Name = 'Order';
    json.Filter = "me.LastCompleteTime < me.PlanEndTime";
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
        if (res.data == null || res.data == '') {
          that.setData({
            order_numHidden: true
          });
        } else if (res.data.data.length != 0) {
          that.setData({
            order_numHidden: false
          });
          that.setData({
            order_num: res.data.data.length,
          });
        } else {
          that.setData({
            order_numHidden: true
          });
        }
      }
    });
}
    
    var GetResourceList = function (that) {
      wx.showLoading({
        title: '加载中',
      })

      var json = {};
      json.Name = 'Resource';
      json.Filter = "!(me.AvbResource=='是')";
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
          if (res.data == null || res.data == '') {
            that.setData({
              source_numHidden: true
            });
          } else if (res.data.data.length != 0) {
            that.setData({
              source_numHidden: false
            });
            that.setData({
              source_num: res.data.data.length,
            });
          } else {
            that.setData({
              source_numHidden: true
            });
          }
        }
      });

  }
