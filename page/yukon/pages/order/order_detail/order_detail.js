var app = getApp()
Page({
  data: {
    code: '',
    kehu: '',
    product: '',
    num: '',
    m_type: '',
    time: '',
    status: '',
    mark: '',
    begin_time: '',
    end_time: '',
    if_pass: '',
    list: []
  },
  onLoad: function (option) {
    this.data.code = option.code;
    this.data.type = option.type;
    console.info(this.data.code);
    console.log(option.type);//中文名称
  },
  goDetail: function (e) {
    var Id = e.currentTarget.dataset.id;
    var code = e.currentTarget.dataset.code;
    var num = e.currentTarget.dataset.plannum;
    var begin = e.currentTarget.dataset.begintime;
    var end = e.currentTarget.dataset.endtime;
    wx.navigateTo({
      url: '../../work/workbegin/workbegin?id=' + Id + '&code=' + code + '&num=' + num + '&begin=' + begin + '&end=' + end,
    })
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    GetList(that);
    SubGetList(that);
  }
})

// 获取数据的方法，具体怎么获取列表数据大家自行发挥  
var GetList = function (that) {
  if (that.data.type == '试排结果') {//多加了参数Accessmodle
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/GetOrderInfo',
      method: 'POST',
      data: {
        userID: wx.getStorageSync('token'),
        orderCode: that.data.code,
        "Accessmodle": "accesscopy"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.info(res);
        that.setData({
          code: res.data.data.Code,
          kehu: res.data.data.Client,
          product: res.data.data.Item,
          num: res.data.data.Amount,
          m_type: res.data.data.Type,
          time: res.data.data.LastCompleteTime,
          status: res.data.data.OrderSchStatus,
          mark: res.data.data.Remark,
          begin_time: res.data.data.PlanStartTime,
          end_time: res.data.data.PlanEndTime,
          if_pass: res.data.data.IfOvertime,
          // list: res.data.data.SubCollection
        });
      }
    });
  }else{
    wx.request({
      url: 'https://api.imclouds.com.cn/api/v1/GetOrderInfo',
      method: 'POST',
      data: {
        userID: wx.getStorageSync('token'),
        orderCode: that.data.code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.info(res);
        that.setData({
          code: res.data.data.Code,
          kehu: res.data.data.Client,
          product: res.data.data.Item,
          num: res.data.data.Amount,
          m_type: res.data.data.Type,
          time: res.data.data.LastCompleteTime,
          status: res.data.data.OrderSchStatus,
          mark: res.data.data.Remark,
          begin_time: res.data.data.PlanStartTime,
          end_time: res.data.data.PlanEndTime,
          if_pass: res.data.data.IfOvertime,
          // list: res.data.data.SubCollection
        });
      }
    });
  }
}

var SubGetList = function (that) {
  if (that.data.type == '试排结果') {//多加了参数Accessmodle
  var json = {};
  json.Name = 'Work';
  json.Filter = "me.Order=='" + that.data.code + "'&&me.DivisionType=='普通工作'";
  json. Accessmodle= "accesscopy";
  var json_child = {};
  json_child.ColumnName = "PlantBeginTime";
  json_child.SortType = "ASC";
  json.SortCondition = [json_child];

  json.Properties = ["ID", "code", "PlantAssResource", "Item", "LastCompleteTime", "PlantAmount", "PlantBeginTime", "PreSetBeginTime", "PreSetEndTime", "PlantEndTime"];

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
      that.setData({
        list: res.data.data
      });
    }
  });
}else{
  var json = {};
  json.Name = 'Work';
  json.Filter = "me.Order=='" + that.data.code + "'&&me.DivisionType=='普通工作'";
  var json_child = {};
  //json_child.ColumnName = "PlantBeginTime";
  json_child.Code = "ASC";
  //json.SortCondition = [json_child];
  json.SortCondition = json_child;

  json.Properties = ["ID", "code", "PlantAssResource", "Item", "LastCompleteTime", "PlantAmount", "PlantBeginTime", "PreSetBeginTime", "PreSetEndTime", "PlantEndTime"];

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
      that.setData({
        list: res.data.data
      });
    }
  });
}
}