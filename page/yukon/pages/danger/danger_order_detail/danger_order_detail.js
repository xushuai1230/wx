var app = getApp()
Page({
  goToDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    var time = e.currentTarget.dataset.time;
    wx.navigateTo({
      url: '../../order/order_detail/order_detail?code=' + orderId + '&time=' + time,
    })
  },
  data: {
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    noneHidden: false,
    code: ''
  },
  onLoad: function (option) {
    //  这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值  
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    that.data.code = option.code;
    console.info(that.data.code);
    that.setData({
      code: option.code
    });
    wx.setNavigationBarTitle({
      title: option.code,
    })
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
     GetList(that);
  },
  loadmore: function () {

  },
  scroll: function (event) {
    //  该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。  
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  refresh: function (event) {
  }
})


// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetList = function (that) {
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
      that.setData({
        list: res.data.data
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
