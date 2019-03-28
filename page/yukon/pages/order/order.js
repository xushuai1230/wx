var app = getApp()
Page({
  addModel: function (event) {
    wx.navigateTo({
      url: 'order_add/order_add',
    })
  },
  goToDetail: function (e, option)
  {
    var that = this;
    console.log(that.data.code)
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'order_detail/order_detail?code=' + orderId + '&type=' + that.data.code,
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
    wx.setNavigationBarTitle({
      title: that.data.code
    })
  },
  searchTap: function () {

  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    GetList(that);
  },
  schedule: function () {
    var that = this;
    GetSchedule(that);
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
  },
  reload: function () {
    var that = this;
    GetList(that);
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
  if (that.data.code == '试排结果') { //判断跳转过来是否是排程结果
    var json = {};
    json.Name = 'Order';
    json.PageSize = '100';
    json.CurrentPage = '1';
    json.Filter = "me.Type== '制造订单'";
    json.Accessmodle = 'accesscopy';
    console.info(json);

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      // url: 'https://api.imclouds.com.cn/api/v1/GetOrderList',
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
  }else{
    var json = {};
    json.Name = 'Order';
    json.PageSize = '100';
    json.CurrentPage = '1';
    json.Filter = "me.Type=='" + that.data.code + "'";
    console.info(json);

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      // url: 'https://api.imclouds.com.cn/api/v1/GetOrderList',
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
}

var GetSchedule = function (that) {
  var that = that;
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/Schedule',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      apsParam: ''
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      GetList(that);
    }
  });
}