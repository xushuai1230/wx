var app = getApp()
Page({
  data: {
    index: 0,
    company: '',
    code: '',
    codeId: '',
    phone: '',
    pswd: '',
    repswd: '',
    last_time: '',
    is_show: true,
  },
  goReadMe: function () {
    wx.navigateTo({
      url: '../readme/readme',
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value,
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
      // url: 'http://192.168.0.228:54415/api/v1/sendcode',
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
  regoperate: function (e) {
    var urid = e.detail.value.urid
    var pswd = e.detail.value.pswd
    var repswd = e.detail.value.repswd 
    var name = e.detail.value.name 
    var phno = e.detail.value.phno 
    var code = e.detail.value.code 

    if (urid == '' || pswd == '' || repswd == '' || name == '' || phno == '' || code == '') {
      wx.showToast({ title: '信息不全', 
        icon:'warn'
        });
      return;
    }
    if (phno.length < 11) {
      wx.showToast({ title: '手机号格式不对', });
      return;
    }
    if (this.data.codeId == '') {
      wx.showToast({ title: '请发送验证码', });
      return;
    }
    if (pswd != repswd) {
      wx.showToast({ title: '2次密码不一样', });
      return;
    }
    if (pswd.length < 6) {
      wx.showToast({ title: '密码最少6位', });
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/getCheckCode',
      method: 'GET',
      data: {
        msgId: that.data.codeId,
        code: code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.code == 0) {
          wx.showToast({ title: '验证成功', });

          console.log("navigateToreg3:" + pswd)

          wx.navigateTo({
            url: 'regend/regend?urid=' + urid + '&pswd=' + pswd + '&name=' + name + '&phno=' + phno,
          })
        } else {
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