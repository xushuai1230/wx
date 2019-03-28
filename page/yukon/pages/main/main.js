Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swiperCurrent: 0,
    selectCurrent: 0,
  },
  onLoad: function () {
    if (wx.getStorageSync('token')==null)
    {
      wx.navigateTo({
        url: '../entrance/entrance',
      })
    }

    var jsons = [];
    var json = {};

    var json4 = {};
    json4.picUrl = '../../../../image/mm1.png';

    // http://oowr7j1bi.bkt.clouddn.com/Fm0do5Sr7aEVXaYxjxPi9h8BtmC8  //原图
    // http://oowr7j1bi.bkt.clouddn.com/FobBMHZznl2jrisU_c8Vu0wTFuw1  //改1
    // http://oowr7j1bi.bkt.clouddn.com/Fpfa3YDv-nbqmNB1EBxMb1YW67qZ  //改2

    json.picUrl = 'http://oowr7j1bi.bkt.clouddn.com/FobBMHZznl2jrisU_c8Vu0wTFuw1';
    var json2 = {};
    json2.picUrl = 'http://oowr7j1bi.bkt.clouddn.com/FniPI_0KM7PDAXKN_AC2Zj1tevK_';
    var json3 = {};
    json3.picUrl = 'http://oowr7j1bi.bkt.clouddn.com/Fhi5ohjZnxkQWZdboAYNUQGfEKSr';

    jsons.push(json4);
    jsons.push(json);
    jsons.push(json2);
    jsons.push(json3);

    this.setData({
      banners: jsons
    });
  }, 
  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goToHome: function () {
    wx.navigateTo({
      url: '../home/home',
    })
  }, 
  goToOrder: function () {
    wx.navigateTo({
      url: '../order/order_home/order_home',
    })
  }, 
  goToSource: function () {
    wx.navigateTo({
      url: '../resource/resource',
    })
  }, 
  goToVentor: function () {
    wx.navigateTo({
      url: '../supply/supply_home',
    })
  }, 
  goToCustomer: function () {
    wx.navigateTo({
      url: '../user/user',
    })
  },
  goToWuliao: function () {
    wx.navigateTo({
      url: '../material/material_home?code=实际库存',
    })
  },
  goToBaogong: function () {
    wx.navigateTo({
      url: '../baogong/baogong?code=制造订单',
    })
  },
  goToYujing: function () {
    wx.navigateTo({
      url: '../danger/danger',
    })
  },
  goToZhiling: function () {
    wx.showToast({
      title: '账号没有权限',
      icon: 'success',
    })
  }
  
});