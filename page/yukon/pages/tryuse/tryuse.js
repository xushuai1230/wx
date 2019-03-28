var app = getApp()
Page({
  data: {
    code: '',
    codeId: '',
    phone: '',
    last_time: '',
    is_show: true
  },
  goReadMe: function () {
    wx.navigateTo({
      url: '../readme/readme',
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function (e) {
    if (this.data.phone == '') {
      wx.showToast({ title: '请输入手机号', });
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/sendcode',
      method: 'POST',
      data: {
        '': that.data.phone
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        // console.log(res.data.data.token.toString())
        if (res.data.code == 0) {

          //发送验证码接口
          wx.showToast({ title: '发送成功', });
          // 将获取验证码按钮隐藏60s，60s后再次显示
          that.setData({
            codeId: res.data.msg,
            is_show: (!that.data.is_show)   //false
          })
          settime(that);
        } else {
          wx.hideLoading()
          wx.showToast({ title: '发送失败，请稍后再试', });
        }
      }
    })
  },
  loginoperate: function (e) {
    var code = e.detail.value.code
    var phone = e.detail.value.phone
    var code_id = this.data.codeId
    if (code_id == '') {
      wx.showToast({ title: '请发送验证码', });
      return;
    }
    if (code == '' || phone == '' ) {
      wx.showToast({ title: '信息不全，请检查', });
      return;
    }
    if (phone.length < 11) {
      wx.showToast({ title: '手机号格式不对', });
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/trylogin',
      method: 'POST',
      data: {
        '': that.data.codeId + '|' + code,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 0) {
          wx.setStorageSync('token', res.data.data.token.toString())
          wx.setStorageSync('uid', "Yukon_Test")
          wx.hideLoading()
          wx.showToast({ title: '登录成功', });

          setTimeout(function () {
            wx.navigateTo({
              url: '../guide/guide?code=0',
            })
          }, 500)
        } else {
          wx.hideLoading()
          wx.showToast({ title: res.data.msg, });
        }
      }
    })
  }
})

var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }
    , 1000)
}