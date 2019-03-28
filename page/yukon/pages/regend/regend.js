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

var app = getApp()
Page({
  data: {
    multiArray: [['电子制造业', '机械五金行业', '纺织服装行业', '橡胶注塑行业', '设备制造行业', '其他行业'], ['电脑行业', '通讯行业', '消费电子行业', 'OEM/ODM']],
    multiIndex: [0, 0],
    index: 0,
    urid: '',
    pswd: '',
    name: '',
    phno: '',
    last_time: '',
    img_url: '',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },
  onLoad: function (option) {
    this.setData({
      urid: option.urid,
      pswd: option.pswd,
      name: option.name,
      phno: option.phno
    });

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
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['电脑行业', '通讯行业', '消费电子行业', 'OEM/ODM'];
            break;
          case 1:
            data.multiArray[1] = ['紧固件行业', '阀门行业', '轴承行业'];
            break;
          case 2:
            data.multiArray[1] = ['纺织行业', '服装行业', '鞋业'];
            break;
          case 3:
            data.multiArray[1] = ['橡胶注塑行业'];
            break;
          case 4:
            data.multiArray[1] = ['设备制造行业'];
            break;
          case 5:
            data.multiArray[1] = ['其他行业'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  regoperate: function (e) {
    var comys = e.detail.value.comys
    var urid = this.data.urid;
    var pswd = this.data.pswd;
    var name = this.data.name;
    var phno = this.data.phno;
    var comy = e.detail.value.comy
    var zhicheng = e.detail.value.zhicheng
    var address = e.detail.value.address
    var tel = e.detail.value.tel
    var indus_num = ((this.data.multiIndex[0] + 1) * 100).toString();
    var img_url = this.data.img_url

    if (indus_num == "600") {
      indus_num = "000";
    }
    if (comys == '' || comy == '' || zhicheng == '' || address == '' || tel == '') {
      wx.showToast({
        title: '信息不全',
        icon: 'warn'
      });
      return;
    }
    if (img_url == '') {
      wx.showToast({ title: '请上传营业执照', });
      return;
    }
    wx.showLoading({
      title: '加载中',
    })

    var that = this;
    var json = {};
    // json.Industry = ((that.data.multiIndex[0] + 1) * 100 + (that.data.multiIndex[1] + 1)).toString();
    json.Industry = indus_num;
    json.PassWord = pswd;
    json.Name = name;
    json.Phone = urid;
    json.Tel = tel;
    json.Address = address;
    json.Region = urid;
    json.Abbreviation = comys;
    json.Customername = comy;
    json.Job = zhicheng;
    json.Organizationimg = img_url;
    json.Code = urid;
    json.UserName = urid;
    json.Renter = that.data.codeId + '+' + that.data.code;
    console.info(json);
    console.info(JSON.stringify(json));

    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/register',
      // url: 'http://192.168.0.228:54415/api/v1/register',
      method: 'POST',
      data: {
        userData: JSON.stringify(json)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.Code == "0") {
          wx.showToast({ title: '注册成功', });
          var that = this;
          wx.request({
            url: 'https://api.imclouds.com.cn/api/v1/sendcheckcode',
            // url: 'http://192.168.0.228:54415/api/v1/sendcode',
            method: 'POST',
            data: {
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data)
              // console.log(res.data.data.token.toString())
              if (res.data.code == 0) {
              } else {
                wx.hideLoading()
                wx.showToast({ title: '发送失败，请稍后再试', });
              }
            }
          })

        } else {
          wx.hideLoading()
          wx.showToast({ title: res.data.Msg, });
        }
      }
    })
  }
})

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