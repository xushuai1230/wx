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
    console.info(this.data.code);
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
        list: res.data.data.SubCollection
      });
    }
  });
}