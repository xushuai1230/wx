var app = getApp()
Page({
  data: {
    code: '',
    mtype: '',
    num: '200',
    array: [],
    date: '请选择',
    time: '请选择',
    date2: '请选择',
    time2: '请选择',
    begin_time: '',
    end_time: '',
    RanCode: 0,
    index: 0,
    begin_time_hidden:true,
    end_time_hidden:true,
    actualBeginTime: '',
    actualEndTime: ''
  },
  goBegin:function(){
    var json = {};
    json.Name = "Work";

    var jsonchild = {};
    jsonchild.ID = this.data.id;
    jsonchild.ActualBeginTime = GetToday();
    json.PropertyValueMap = jsonchild;
    console.info(json);

    var that = this;
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/ModifyData',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        dataInfo: JSON.stringify(json)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.info(res);
        if (res.data.code == "0") {
          wx.showToast({ title: '启动成功', duration: 1000 });
          that.setData({
            actualBeginTime: jsonchild.ActualBeginTime,
            begin_time_hidden: true
          })
        } else {
          wx.showToast({ title: '网络不好', duration: 1000 });
        }
      }
    });

    this.setData({
      begin_time_hidden: false,
      begin_time: GetToday()
    });
  },
  goEnd: function () {
    var json = {};
    json.Name = "Work";

    var jsonchild = {};
    jsonchild.ID = this.data.id;
    jsonchild.ActualEndTime = GetToday();

    json.PropertyValueMap = jsonchild;
    console.info(json);
    
    var that = this;
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/ModifyData',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        dataInfo: JSON.stringify(json)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.info(res);
        if (res.data.code == "0") {
          wx.showToast({ title: '结束成功', duration: 1000 });
          that.setData({
            actualEndTime: jsonchild.ActualEndTime,
            end_time_hidden: true
          })
        } else {
          wx.showToast({ title: '网络不好', duration: 1000 });
        }
      }
    });

    this.setData({
      end_time_hidden: false,
      end_time: GetToday()
    });

  },
  addoperate: function (e) {
    console.info(this.data.code);
    if (this.data.date == '请选择' || this.data.time == '请选择' || this.data.date2 == '请选择' || this.data.time2 == '请选择') {
      wx.showToast({ title: '信息不全', duration: 1000 });
      return;
    }

    var c_num = e.detail.value.c_num
    var f_num = e.detail.value.f_num
    if (f_num == null || f_num == '') {
      wx.showToast({ title: '废品数量不能为空', duration: 1000 });
      return;
    }
    if (c_num == null || c_num == '') {
      wx.showToast({ title: '成品数量不能为空', duration: 1000 });
      return;
    }
    if (!IsNum(c_num) || !IsNum(f_num)) {
      wx.showToast({ title: '数量必须为数字', duration: 1000 });
      return;
    }

    var json = {};
    json.Name = "Work";

    var jsonchild = {};
    jsonchild.ID = this.data.id;
    jsonchild.ActualAmount = c_num;

    json.PropertyValueMap = jsonchild;
    console.info(json);

    var that = this;
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/ModifyData',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        dataInfo: JSON.stringify(json)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.info(res);
        if (res.data.code == "0") {
          wx.showToast({ title: '报工成功', duration: 1000 });
        } else {
          wx.showToast({ title: '网络不好', duration: 1000 });
        }
      }
    });
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
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date2: e.detail.value
    })
  },
  bindTimeChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time2: e.detail.value
    })
  },
  scanCode: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },
  onLoad: function (option) {
    this.data.id = option.id;
    this.data.code = option.code;
    this.data.item = option.item;
    this.data.status = option.status;
    this.data.order = option.order;
    this.data.plannum = option.num;

    this.setData({
      id: option.id,
      code: option.code,
      item: option.item,
      status: option.status,
      order: option.order,
      plannum: option.num,
    })
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    GetList(that);
  }
})

// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetList = function (that) {
  var json = {}
  json.Name = 'Work'
  json.Filter = "me.ID=='" + that.data.id + "'"
  json.Properties = ["ID", "code", "ActualBeginTime", "ActualEndTime", "PlantAssResource", "Item", "LastCompleteTime", "PlantAmount", "PlantBeginTime", "PreSetBeginTime", "PreSetEndTime", "PlantEndTime"]

  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetDataList',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      tableName: JSON.stringify(json)
    }, header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res){
      that.setData({
        actualBeginTime: res.data.data[0].PropertyValueMap.ActualBeginTime,
        actualEndTime: res.data.data[0].PropertyValueMap.ActualEndTime
      })
      if (that.data.actualBeginTime == ''){
        that.setData({
          begin_time_hidden: false
        })
      }
      if (that.data.actualEndTime == '') {
        that.setData({
          end_time_hidden: false
        })
      }
    }
  })

  /*wx.request({
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
  });*/
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
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/Schedule',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      apsParam: ''
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
  return Y + "-" + M + "-" + D +" "+ h + ":" + m + ":" + s;
}

