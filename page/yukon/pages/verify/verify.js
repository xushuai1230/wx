const qiniuUploader = require("../../../../utils/qiniuUploader-min");
//index.js

// 初始化七牛相关参数
function initQiniu(that) {
  var options = {
    region: 'SCN', // 华北区
    // uptokenURL: 'https://[yourserver.com]/api/uptoken',
    uptoken: that.data.token,
    domain: 'http://oowr7j1bi.bkt.clouddn.com',
    shouldUseQiniuFileName: false
  };
  qiniuUploader.init(options);
}

//获取应用实例
var app = getApp()
Page({
  data: {
    token: '',
    img_url: '',
    company: '',
    code: ''
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/GetQiniuToken',
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          token: res.data.msg
        });
      }
    })
  },
  uploadPic: function () {
    var that = this;
    didPressChooesImage(that);
  },
  companyInput: function (e) {
    this.setData({
      company: e.detail.value
    })
  },
  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
});

function didPressChooesImage(that) {
  initQiniu(that);
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
        that.setData({
          img_url: res.imageURL,
        });
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      }
      );
    }
  })
}