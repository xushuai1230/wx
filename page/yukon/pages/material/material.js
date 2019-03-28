var app = getApp()
Page({
  goToDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'material_detail/material_detail?code=' + orderId,
    })
  },
  data: {
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    noneHidden: true,
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
    if (that.data.code == 'today') {
      wx.setNavigationBarTitle({
        title: '当天物料',
      })
    } else if (that.data.code == 'tomorrow') {
      wx.setNavigationBarTitle({
        title: '明天物料',
      })
    } else if (that.data.code == 'next') {
      wx.setNavigationBarTitle({
        title: '2-5天物料',
      })
    } else if (that.data.code == 'stock') {
      wx.setNavigationBarTitle({
        title: '库存物料',
      })
    }
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    GetList(that);
    // GetToday(that);
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

// var url = "http://www.imooc.com/course/ajaxlist";
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

  var json = {};
  if (that.data.code == 'today') {
    wx.getD 
    json.Name = 'Order';
    json.Filter = "ME.Type=='采购订单'&&ME.PlanEndTime>=#" + GetToday() + "#&&ME.PlanEndTime<#" + GetTomorrow() +"#";
  } else if (that.data.code == 'tomorrow') {
    json.Name = 'Order';
    json.Filter = "ME.Type=='采购订单'&&ME.PlanEndTime>=#" + GetTomorrow() + "#&&ME.PlanEndTime<#" + GetAfterTomorrow() + "#";
  } else if (that.data.code == 'next') {
    json.Name = 'Order';
    json.Filter = "ME.Type=='采购订单'&&ME.PlanEndTime>=#" + GetAfterTomorrow() + "#&&ME.PlanEndTime<#" + GetAfterNext() + "#";
  } else if (that.data.code == 'stock') {
    json.Name = 'Order';
    json.Filter = "ME.Type=='实际库存'";
  }

  console.info(json);
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
      wx.hideLoading()
      var list = [];
      // var list = res.data.data;
      console.info(res.data);
      console.info(res.data.data);
      that.setData({
        noneHidden: false
      });
      for (var i = 0; i < res.data.data.length; i++) {
        list.push(res.data.data[i]);
        that.setData({
          noneHidden: true
        });
      }
      that.setData({
        list: list
      });
      page++;
      that.setData({
        hidden: true
      });
    }
  });
}

var GetToday=function(){
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;

  //获取当前时间  
  var n = timestamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();

  // console.log("当前时间：" + Y + "-" + M + "-" + D + h + ":" + m + ":" + s);
  console.log("当前时间：" + Y + "-" + M + "-" + D );
  return Y + "-" + M + "-" + D;
}

var GetTomorrow = function () {
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;

  var tomorrow_timetamp = timestamp + 24 * 60 * 60;  

  //获取当前时间  
  var n = tomorrow_timetamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();

  console.log("当前时间：" + Y + "-" + M + "-" + D);
  return Y + "-" + M + "-" + D;
}

var GetAfterTomorrow = function () {
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;

  var tomorrow_timetamp = timestamp + 48 * 60 * 60;
  //获取当前时间  
  var n = tomorrow_timetamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();

  console.log("当前时间：" + Y + "-" + M + "-" + D);
  return Y + "-" + M + "-" + D;
}

var GetAfterNext = function () {
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;

  var tomorrow_timetamp = timestamp + 120 * 60 * 60;
  //获取当前时间  
  var n = tomorrow_timetamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();

  console.log("当前时间：" + Y + "-" + M + "-" + D);
  return Y + "-" + M + "-" + D;
}