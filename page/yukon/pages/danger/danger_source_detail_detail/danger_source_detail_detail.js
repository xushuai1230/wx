var app = getApp()
Page({
  data: {
    id: '',
    code: '',
    name: '',
    status: '',
    using: '',
    num: '',
    time: '',
    list0: [],
    list1: [],
    list2: [],
    v_visi: true,
    v_open: false,
    v_close: true,
    v_visi2: true,
    v_open2: false,
    v_close2: true,
    noneHidden1: false,
    noneHidden2: false,
    noneHidden3: false,
    hiddenmodalput: true,
    yuanyin:'',
    ycword:'异常',
    btnhide:'',
    remark: ''
  },
  recovery: function(e){
    var id = e.currentTarget.dataset.id
    console.log(id)

    var json = {}
    json.Name = 'Resource'
    var jpvm = {}
    jpvm.ID = this.data.id
    jpvm.AvbResource = '是'
    jpvm.Remark = ''
    json.PropertyValueMap = jpvm

    var that = this
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
      success: function (res){
        if (res.data.code=='0'){
          that.setData({
            btnhide: 'none'
          })
          wx.showToast({
            title: '恢复成功'
          })
        }
      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      yuanyin: e.detail.value
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })

    var jsonRe = {}
    jsonRe.Name = 'Resource'
    var jpvm = {}
    jpvm.ID = this.data.id
    jpvm.AvbResource = '否'
    jpvm.Remark = this.data.yuanyin
    jsonRe.PropertyValueMap = jpvm
    console.log(JSON.stringify(jsonRe));

    var that = this
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/ModifyData',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        dataInfo: JSON.stringify(jsonRe)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code == '0'){
          wx.showToast({
            title: '设置异常成功'
          })
          that.setData({
            ycword:'异常处理中...',
            status: '否'
          })
        } else {
          wx.showToast({
            title: '设置异常失败'
          })
        }
      }
    })
  }, 
  onLoad: function (option) {
    this.data.code = option.code;
  },
  goDetail: function (e) {
    var Id = e.currentTarget.dataset.id;
    var code = e.currentTarget.dataset.code;
    var num = e.currentTarget.dataset.plannum;
    var begin = e.currentTarget.dataset.begintime;
    var end = e.currentTarget.dataset.endtime;
    wx.navigateTo({
      url: '../../work/workbegin/workbegin?id=' + Id + '&code=' + code + '&num=' + num  + '&begin=' + begin +  '&end=' + end,
    })
  },
  disableSource: function (e) {
    if(this.data.status=='否'){ return }
    var id = e.currentTarget.dataset.id
    console.log(id)
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      id: id
    })

    // var that = this;

    // wx.showModal({
    //   title: '提示',
    //   content: '输入异常原因',
    //   success: function (res) {
    //     if (res.confirm) {
    //       vrDisableSource(that);
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  openTap: function () {
    this.setData({
      v_visi: false,
      v_open: true,
      v_close: false,
    });
  },
  closeTap: function () {
    this.setData({
      v_visi: true,
      v_open: false,
      v_close: true,
    });
  },
  openTap2: function () {
    this.setData({
      v_visi2: false,
      v_open2: true,
      v_close2: false,
    });
  },
  closeTap2: function () {
    this.setData({
      v_visi2: true,
      v_open2: false,
      v_close2: true,
    });
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    GetList(that);
    GetNewList(that, 'today');
    GetNewList(that, 'tomorrow');
    GetNewList(that, 'next');
  }
})

var GetNewList = function (that, mtype) {
  wx.showLoading({
    title: '加载中',
  })

  var json = {};
  json.Name = 'Work';

  // json.Filter = "me.ListWork.PlantAssResource == '检查2' & amp;&amp; ME.ListWork.PlanEndTime >=#2017 - 11 - 29#&amp;&amp; ME.ListWork.PlanEndTime & lt; #2017 - 11 - 30#";

  if (mtype == 'today') {
    json.Filter = "me.PlantAssResource=='" + that.data.code + "'&&ME.PlantBeginTime>=#" + GetToday() + "#&&ME.PlantBeginTime<#" + GetTomorrow() + "#&&me.DivisionType=='普通工作'";
    var json_child = {};
    json_child.ColumnName = "PlantBeginTime";
    json_child.SortType = "ASC";
    json.SortCondition = [json_child];

    json.Properties = ["ID", "code", "PlantAssResource", "Item", "LastCompleteTime", "PlantAmount", "PlantBeginTime", "PreSetBeginTime", "PreSetEndTime", "PlantEndTime"];
  } else if (mtype == 'tomorrow') {
    json.Filter = "me.PlantAssResource=='" + that.data.code + "'&&ME.PlantBeginTime>=#" + GetTomorrow() + "#&&ME.PlantBeginTime<#" + GetAfterTomorrow() + "#&&me.DivisionType=='普通工作'";
    var json_child = {};
    json_child.PlantBeginTime = "ASC";
    json.SortCondition = json_child;

    json.Properties = ["ID", "code", "PlantAssResource", "Item", "LastCompleteTime", "PlantAmount", "PlantBeginTime", "PreSetBeginTime", "PreSetEndTime", "PlantEndTime"];
  } else {
    json.Filter = "me.PlantAssResource=='" + that.data.code + "'&&ME.PlantBeginTime>=#" + GetAfterTomorrow() + "#&&ME.PlantBeginTime<#" + GetAfterNext() + "#&&me.DivisionType=='普通工作'";
    var json_child = {};
    json_child.PlantBeginTime = "ASC";
    json.SortCondition = json_child;

    json.Properties = ["ID", "code", "PlantAssResource", "Item", "LastCompleteTime", "PlantAmount", "PlantBeginTime", "PreSetBeginTime", "PreSetEndTime", "PlantEndTime"];
  }

  console.info(JSON.stringify(json));
  console.info(wx.getStorageSync('token'));
  
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetDataList',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      tableName: JSON.stringify(json)
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      wx.hideLoading();
      if (mtype == 'today') {
        if (res.data.data == "") {
        } else {
          that.setData({
            noneHidden1: true,
            list0: res.data.data
          });
        }
      } else if (mtype == 'tomorrow') {
        if (res.data.data == '') {
          that.setData({
            v_close: true,
            v_open: true,
          });
        } else {
          that.setData({
            noneHidden2: true,
            list1: res.data.data
          });
        }
      } else {
        if (res.data.data == '') {
          that.setData({
            v_close2: true,
            v_open2: true,
          });
        } else {
          that.setData({
            noneHidden3: true,
            list2: res.data.data
          });
        }
      }
    }
  });
}

// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetList = function (that) {
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetResourceInfo',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      ResourceCode: that.data.code
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      that.setData({
        id: res.data.data.ID,
        code: res.data.data.Code,
        name: res.data.data.Code,
        status: res.data.data.AvbResource,
        using: res.data.data.IsWorking,
        num: toPercent(res.data.data.ResMaxLoad),
        time: res.data.data.WorkedTime,
        remark: res.data.data.Remark
      });
      if (res.data.data.AvbResource=='是'){
        that.setData({
          btnhide: 'none'
        })
      }
    }
  });
}

var vrDisableSource = function (that) {
  wx.showLoading({
    title: '加载中',
  })

  var json = {};
  json.Name = 'Resource';
  var child_json = {};
  child_json.Id = that.data.code;
  child_json.AvbResource = '否';
  json.PropertyValueMap = child_json;
  console.info(JSON.stringify(json));


  console.info(JSON.stringify(json));
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/GetDataList',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      tableName: JSON.stringify(json)
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      wx.hideLoading();
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
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();

  // console.log("当前时间：" + Y + "-" + M + "-" + D + h + ":" + m + ":" + s);
  console.log("当前时间：" + Y + "-" + M + "-" + D);
  return Y + "-" + M + "-" + D;
}

var GetTomorrow = function () {
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;

  var tomorrow_timetamp = timestamp + 24 * 60 * 60;

  //获取当前时间  
  var n = tomorrow_timetamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();

  console.log("当前时间：" + Y + "-" + M + "-" + D);
  return Y + "-" + M + "-" + D;
}

var GetAfterTomorrow = function () {
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;

  var tomorrow_timetamp = timestamp + 48 * 60 * 60;
  //获取当前时间  
  var n = tomorrow_timetamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();

  console.log("当前时间：" + Y + "-" + M + "-" + D);
  return Y + "-" + M + "-" + D;
}

var GetAfterNext = function () {
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;

  var tomorrow_timetamp = timestamp + 120 * 60 * 60;
  //获取当前时间  
  var n = tomorrow_timetamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();

  console.log("当前时间：" + Y + "-" + M + "-" + D);
  return Y + "-" + M + "-" + D;
}

function toPercent(point) {
  var str = Number(point * 100).toFixed(2);
  str += "%";
  return str;
}