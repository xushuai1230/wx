Page({
  goToDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'resource_detail/resource_detail?code=' + orderId,
    })
  },
  data: {
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0
  },
  onLoad: function () {
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
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    GetList(that);
  },
  searchTap: function () {
  
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
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetResourceList',
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
      var list = res.data.data;
      console.info(res.data);
      console.info(res.data.data);
      // for (var i = 0; i < res.data.length; i++) {
      //   list.push(res.data[i]);
      // }
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