//获取应用实例
var app = getApp()
Page({
  data: {
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    showday: ['今天', '明天', ''],
    city:'', //城市
    district:'', //区域
    now:'',
    forecast:'',//七日天气预报
    wind_sc: '',
    fl_tmp:'',
    curDate: ''
  },

  onLoad: function () {
    var that = this;
    var date = new Date();
    //设置数组第三个是周几
    that.setData({
      'showday[2]': this.data.weekday[(date.getDay() + 2) % 7],
      'showday[3]': this.data.weekday[(date.getDay() + 3) % 7],
    });
  },

  onShow: function () {
    var that = this;
    var city = app.globalData.defaultCity.slice(0, 2);
    that.setData({
      city: app.globalData.defaultCity, //今天天气情况数组 
      district: app.globalData.defaultCounty //生活指数
    });
    that.getWeather(city);//获得天气
  },

  //从全局变量直接获取天气信息，首页加载时存的
  getWeather: function (city) {
    var that = this;
    let wD = app.globalData.weatherData;
    that.setData({
      now: wD, //今天天气情况数组 
      forecast: app.globalData.forecast,
      wind_sc: wD.wind.slice(-2),
      fl_tmp: wD.date.slice(wD.date.indexOf("：")+1,-1),
      curDate: wD.date.slice(0,9)
    });
    console.log(that.data.forecast);
  },

  bindCity: function (e) {
    wx.reLaunch({
      url: '../switchcity/switchcity'
    });
  }

});