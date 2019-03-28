var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
Page({
    data: {
    },
    touchHandler: function (e) {
        console.log(ringChart.getCurrentDataIndex(e));
    },
    updateData: function () {
        ringChart.updateData({
            title: {
                name: '80%'
            },
            subtitle: {
                color: '#ff0000'
            }
        });
    },     
    onReady: function (e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        ringChart = new wxCharts({
            animation: true,
            canvasId: 'ringCanvas',
            type: 'ring',
            extra: {
                ringWidth: 25,
                pie: {
                    offsetAngle: -45
                }
            },
            title: {
                name: '70%',
                color: '#7cb5ec',
                fontSize: 25
            },
            subtitle: {
                name: '收益率',
                color: '#666666',
                fontSize: 15
            },
            series: [{
                color: '#666666',
                name: '成交量1',
                data: 15,
                stroke: false
            }, {
                color: '#F7A35C',
                name: '成交量2',
                data: 35,
                 stroke: false
            }],
            disablePieStroke: false,
            width: windowWidth,
            height: 200,
            dataLabel: false,
            legend: false,
            padding: 0
        });
        ringChart.addEventListener('renderComplete', () => {
            console.log('renderComplete');
        });
        setTimeout(() => {
            ringChart.stopAnimation();
        }, 500);
    }
});