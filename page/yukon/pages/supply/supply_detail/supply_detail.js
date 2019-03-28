var app = getApp()
Page({
  data: {
    yid: '',
    yq_id: '',
    yq_item: '',
    yq_num: '',
    code: '',
    kehu: '',
    product: '',
    num: '',
    time: '',
    list: [],
    v_visi: true,
    v_open: false,
    v_close: true,
    v_visi2: true,
    v_open2: false,
    v_close2: true,
    noneHidden1: false,
    noneHidden2: false,
    noneHidden3: false,
    date: '请选择',
    hiddenmodalput: true,
  },
  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput: function (e) {
    var yid = e.currentTarget.dataset.yid;
    var id = e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.item;
    var num = e.currentTarget.dataset.num;
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      yid: yid,
      yq_id: id,
      yq_item: item,
      yq_num: num,
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
    var yid = this.data.yid;
    var id = this.data.yq_id;
    var item = this.data.yq_item;
    var num = this.data.yq_num;
    if (this.data.date == "请选择") {
      wx.showToast({
        title: '请选择日期',
      })
      return;
    }
    var date = this.data.date;
    var that = this;

    var json = {};
    json.Name = 'Order';
    var child_json = {};
    child_json.ID = yid;
    child_json.Code = id;
    child_json.Type = '预计入库';
    child_json.Item = item;
    child_json.Amount = num;
    child_json.LastCompleteTime = date;
    json.PropertyValueMap = child_json;
    console.info(JSON.stringify(json));
    PostYanQi(that, json);
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
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  onLoad: function (option) {
    this.data.code = option.code;
    console.info(this.data.code);
    this.setData({
      kehu: option.code
    })
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    // GetList(that);
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
  json.Name = 'SupplierInfo';
  if (mtype == 'today') {
    json.Filter = "me.Item.ExpandBSTR2=='" + that.data.code + "'&&(me.Type=='采购订单'||me.Type=='预计入库')&&ME.PlanEndTime>=#" + GetToday() + "#&&ME.PlanEndTime<#" + GetTomorrow() + "#";
  } else if (mtype == 'tomorrow') {
    json.Filter = "me.Item.ExpandBSTR2=='" + that.data.code + "'&&(me.Type=='采购订单'||me.Type=='预计入库')&&ME.PlanEndTime>=#" + GetTomorrow() + "#&&ME.PlanEndTime<#" + GetAfterTomorrow() + "#";
  } else {
    json.Filter = "me.Item.ExpandBSTR2=='" + that.data.code + "'&&(me.Type=='采购订单'||me.Type=='预计入库')&&ME.PlanEndTime>=#" + GetAfterTomorrow() + "#&&ME.PlanEndTime<#" + GetAfterNext() + "#";
  }

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
      if (mtype == 'today') {
        if (res.data.code == '-1') {


        } else {
          that.setData({
            noneHidden1: true,
            list: res.data.data.SubCollection
          });
        }
      } else if (mtype == 'tomorrow') {
        if (res.data.code == '-1') {
          that.setData({
            v_close: true,
            v_open: true,
          });
        } else {
          that.setData({
            noneHidden2: true,
            list1: res.data.data.SubCollection
          });
        }
      } else {
        if (res.data.code == '-1') {
          that.setData({
            v_close2: true,
            v_open2: true,
          });
        } else {
          that.setData({
            noneHidden3: true,
            list2: res.data.data.SubCollection
          });
        }
      }
    }
  });
}


// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetList = function (that) {
  wx.request({
    url: 'https://api.imclouds.com.cn/api/v1/getSupplierInfo',
    method: 'POST',
    data: {
      userID: wx.getStorageSync('token'),
      supplierCode: that.data.code
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.info(res);
      that.setData({
        code: res.data.data.Code,
        kehu: res.data.data.Name,
        product: res.data.data.Item,
        num: res.data.data.Amount,
        time: res.data.data.ArrivalTime,
        list: res.data.data.SubCollection
      });
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


// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var PostYanQi = function (that, json) {
  console.info(JSON.stringify(json));

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
      if (res.data.code=="0")
      {
        wx.showToast({
          title: '延期成功',
        })
        
      }
    }
  });
}


