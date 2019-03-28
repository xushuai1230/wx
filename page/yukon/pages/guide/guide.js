Page({
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    swiperCurrent: 0,
    selectCurrent: 0,
    ifHidden: false,
    checkMeHidden: false,
    index: 0,
  },
  onLoad: function (option) {
    console.info(option.code);

    var jsons = [];
    var json = {};
    json.picUrl = '../../../../image/gud1.png';
    var json3 = {};
    json3.picUrl = '../../../../image/gud2.png';
    var json4 = {};
    json4.picUrl = '../../../../image/gud3.png';
    jsons.push(json);
    jsons.push(json3);
    jsons.push(json4);

    this.setData({
      banners: jsons,
      index: option.code-1
    });
  }, 
  remindme: function () {
    var ifrd = this.data.checkMeHidden;
    if (ifrd)
    {
      this.setData({
        checkMeHidden: false
      });
    }else{
      this.setData({
        checkMeHidden: true
      });
    }
  },
  lower: function () {
    this.setData({
      checkMeHidden: false
    });
  },
  //事件处理函数
  swiperchange: function (e) {
    console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
    if (e.detail.current==1)
    {
      this.setData({
        ifHidden: false
      });
    }else{
      this.setData({
        ifHidden: true
      });
    }
  },
  goHome: function () {
    wx.switchTab({
      url: '../main/main',
    })
  }
  
});