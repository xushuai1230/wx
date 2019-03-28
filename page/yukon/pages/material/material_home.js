var app = getApp()
Page({
  goToToday: function (event) {
    wx.navigateTo({
      url: 'material?code=today',
    })
  },
  goToTomorrow: function (event) {
    wx.navigateTo({
      url: 'material?code=tomorrow',
    })
  },
  goToNext: function (event) {
    wx.navigateTo({
      url: 'material?code=next',
    })
  },
  goToStock: function (event) {
    wx.navigateTo({
      url: 'material?code=stock',
    })
  },
  data: {
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
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
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    // var that = this;
    // GetList(that);
  },
  loadmore: function () {
    //  该方法绑定了页面滑动到底部的事件  
    // var that = this;
    // that.setData({
    //   hidden: false
    // });
    // GetList(that);
  },
  scroll: function (event) {
    //  该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。  
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  refresh: function (event) {
    //  该方法绑定了页面滑动到顶部的事件，然后做上拉刷新  
    // page = 0;
    // this.setData({
    //   list: [],
    //   scrollTop: 0
    // });
    // GetList(this)
  }
})

var page = 0;
var page_size = 20;
var sort = "last";
var is_easy = 0;
var lange_id = 0;
var pos_id = 0;
var unlearn = 0;

// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetList = function (that) {
  wx.showLoading({
    title: '加载中',
  })

  // var json = {};
  // json.Name = 'Order';
  // json.Filter = "ME.Type=='实际库存'";
  // console.info(json);

  var json = {};
  json.Name = 'Order';
  json.Filter = "ME.Type=='采购订单'&&ME.PlanEndTime>=#2017-11-30#&&ME.PlanEndTime<#2017-12-10#";
  console.info(json);

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
      wx.hideLoading()
    }
  });
}