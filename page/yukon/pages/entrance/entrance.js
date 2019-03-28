var app = getApp()
Page({
  data: {
    // 白电TestCompany_-2
    username: 'Yukon_Test',
    password: '000'
  },
  goMore: function () {
    wx.showActionSheet({
      itemList: ['新用户注册', '产品介绍'],
      success: function (e) {
        console.log(e.tapIndex)
        if (e.tapIndex==0)
        {
          wx.navigateTo({
            url: '../regbegin/regbegin',
          })
        } else if (e.tapIndex == 1){
          wx.navigateTo({
            url: '../jieshao/jieshao',
          })
        }
      }
    })
  },
  goLogin: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  goReg: function () {
    wx.navigateTo({
      url: '../tryuse/tryuse',
    })
  },
  debug: function () {
    // var urid = 'cTest2'
    // var pswd = '123456'
    // var renter = 'cTest2'

    var urid = '13166389166'
    var pswd = '123456'
    var renter = '13166389166'

    // var urid = '13524029555'
    // var pswd = 'xch9407483'
    // var renter = '13524029555'
  
    wx.showLoading({
      title: '登录中',
    })

    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/login',
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

          setTimeout(function () {
            wx.switchTab({
              url: '../main/main',
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

