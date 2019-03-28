var app = getApp()
Page({
  data:{
    // 白电TestCompany_-2
    username:'Yukon_Test',
    password:'000'
  },
  goIn: function() {
    wx.navigateTo({
      url: '../tryuse/tryuse',
    })
  },
  goReg: function () {
    wx.navigateTo({
      url: '../regbegin/regbegin',
    })
  },
  loginoperate: function (e) {
    var urid = e.detail.value.urid
    var pswd = e.detail.value.pswd

    if (urid == '' || pswd == '' ) {
      wx.showToast({
        title: '信息不全',
        icon: 'warn'
      }); 
      return;
    }
    var renter = urid

    wx.showLoading({
      title: '登录中',
    })

    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/login', // yukontek.com
      method: 'POST',
      data: {
        renter: renter,
        userID: urid,
        password: pswd
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        // console.log(res.data.data.token.toString())
        if (res.data.code == 0) {
          wx.setStorageSync('token', res.data.data.token.toString())
          wx.setStorageSync('uid', urid)
          wx.hideLoading()
          wx.showToast({ title: '登录成功', });

          var code=0;
          if (res.data.data.industry != '') {
            code=res.data.data.industry.substring(0,1)
          }

          setTimeout(function () {
            wx.navigateTo({
              url: '../guide/guide?code=' + code,
            })
          }, 500)
        } else {
          wx.hideLoading()
          wx.showToast({ title: '用户名密码错误', });
        }
      }
    })
  }
})

