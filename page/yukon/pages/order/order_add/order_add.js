var app = getApp()
Page({
  data: {
    code: '',
    mtype: '',
    num: '200',
    array: [],
    RanCode: 0,
    index: 0,
    date: '请选择',
    time: '请选择',
    insertTimeHidden:true
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  addoperate: function (e) {
    console.info(this.data.code);
    var code = e.detail.value.code
    var num = e.detail.value.num
    var priority = e.detail.value.priority
    var time = this.data.date + " " + this.data.time;
    if (this.data.date == '请选择') {
      wx.showToast({ title: '请选择交货时间', duration: 1000 })
      return;
    }
    
    if (code == null || code== '') {
      wx.showToast({ title: '订单号不能为空', duration: 1000 });
      return;
    } 
    if (num == null || num == '') {
      wx.showToast({ title: '数量不能为空', duration: 1000 });
      return;
    } 
    if (!IsNum(num)) {
      wx.showToast({ title: '数量必须为数字', duration: 1000 });
      return;
    } 

    if (priority == null || priority == '') {
      wx.showToast({ title: '优先级不能为空', duration: 1000 });
      return;
    }
    if (!IsNum(priority)) {
      wx.showToast({ title: '优先级必须为数字', duration: 1000 });
      return;
    } 

    if (this.data.array[this.data.index] == null || this.data.array[this.data.index] == '') {
      wx.showToast({ title: '物料不能为空', duration: 1000 });
      return;
    } 

    var json = {};
    json.Code = code;
    json.Item = this.data.array[this.data.index];
    json.Amount = num;
    json.Priority = priority;
    //json.LastCompleteTime = GetToday();
    json.LastCompleteTime = time;
    // json.Time=time;
    console.info(json);

    this.setData({
      code: code
    })
    var that= this;
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/AddOrder',
      method: 'POST',
      data: {
        userID: wx.getStorageSync('token'),
        OrderInfo: JSON.stringify(json)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.info(res);

        if (that.data.mtype == '交期答复') {
          wx.showToast({ title: '添加成功', duration: 1000 });
          GetSchedule(e.detail.value.code);
        } else {
          wx.showToast({ title: '插单成功', duration: 1000 });
          setTimeout(function () {
            wx.navigateBack({
            })
          }, 500)
        }
      }
    });
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  scanCode: function() {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        var json = {};
        json.Code = that.data.code.toString();
        json.Item = that.data.array[that.data.index];
        json.Amount = that.data.num;
        console.info(json);

        wx.request({
          url: 'https://api.imclouds.com.cn/api/v1/AddOrder',
          method: 'POST',
          data: {
            userID: wx.getStorageSync('token'),
            OrderInfo: JSON.stringify(json)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.info(res);
            wx.showToast({ title: '添加成功', duration: 1000  });
            wx.navigateBack({
              
            });
          }
        });
      }
    })
  },
  codeChange: function (e) {
    this.setData({
      code: e.detail.value,
    })
  },
  numChange: function (e) {
    this.setData({
      num: e.detail.value,
    })
  },
  onLoad: function (option) {
    this.data.mtype = option.code;
    console.info(this.data.mtype);
    wx.setNavigationBarTitle({
      title: this.data.mtype,
    })
    this.setData({
      code: randomNum(10000, 10000000)
    })

    if (this.data.mtype == "紧急插单") {
      this.setData({
        insertTimeHidden: false
      })
    } else {
      this.setData({
        insertTimeHidden: false
      })
    }
    
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    GetList(that);
  }
})

// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetList = function (that) {
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetDataList',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      tableName: 'Item'
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      var list = [];
      for (var i = 0; i < res.data.data.length; i++) {
        list.push(res.data.data[i].Code);
      }
      that.setData({
        array: list
      });
    }
  });
}


//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
} 

//判断是否为数字
function IsNum(s) {
  if (s != null && s != "") {
    return !isNaN(s);
  }
  return false;
}


var GetSchedule = function (code) {
  var apsParam = {}
  apsParam.CMD = '综合计划'

  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/Schedule',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      apsParam: JSON.stringify(apsParam)
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      GetOrderDetail(code);   
    }
  });
}

// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetOrderDetail = function (code) {
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetOrderInfo',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      orderCode: code
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      wx.showModal({
        title: '结果',
        content: '计划完成时间：' + res.data.data.PlanEndTime,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({

            });
            wx.navigateTo({
              url: '../order_detail/order_detail?code=' + code,
            })
          } else if (res.cancel) {
            wx.navigateBack({

            })
          }
        }
      })
    }
  });
}

var GetToday = function () {
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;

  //获取当前时间  
  var n = timestamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  //分  
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  //秒  
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

  // console.log("当前时间：" + Y + "-" + M + "-" + D + h + ":" + m + ":" + s);
  console.log("当前时间：" + Y + "-" + M + "-" + D);
  return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
}

