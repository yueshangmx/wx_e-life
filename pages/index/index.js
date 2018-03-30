var app = getApp();
var util = require('../../utils/util.js');
let bmap = require('../../libs/bmap-wx.min.js');
let wxMarkerData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: '',
    county: '',
    today: "",
    weatherData: '',
    air: '',
    dress: '',
    sliderList: [
      { selected: true, imageSource: 'http://up.enterdesk.com/edpic/7d/35/13/7d3513ecabdf1f7eb4f1407f0e82f23c.jpg' },
      { selected: false, imageSource: '../../images/2.jpg' },
      { selected: false, imageSource: 'http://pic1.win4000.com/wallpaper/9/538544be6ae36.jpg' },
    ],
    inTheaters: {},
    containerShow: true
  },

  onLoad: function (options) {
    //更新当前日期
    app.globalData.day = util.formatTime(new Date()).split(' ')[0];
    this.setData({
      today: app.globalData.day
    });
    //定位当前城市
    this.getLocation();
    
    //获取豆瓣电影正在热映信息
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" +"?apikey=0b2bdeda43b5688921839c8ecb20399b"+ "&start=0&count=6";
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");

    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        var log = Date.now();
        res.userInfo.logtime = util.formatTime(new Date(log));
        var userInfos = wx.getStorageSync('userInfos') || [];
        userInfos.unshift(res.userInfo);
        wx.setStorageSync('userInfos', userInfos);
      }
    })

  },

  //调用豆瓣api
  getMovieListData: function (url, settedKey, categoryTitle) {
    wx.showNavigationBarLoading()
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  //获得电影数据后的处理方法
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },

  //定位当前城市
  getLocation: function () {
    var that = this;
    /* 获取定位地理位置 */
    // 新建bmap对象   
    var BMap = new bmap.BMapWX({
      ak: app.globalData.bmapak
    });
    var fail = function (data) {
      console.log(data);
    };
    var success = function (data) {
      //使用wxMarkerData获取数据  
      wxMarkerData = data.originalData.result.addressComponent;
      app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : wxMarkerData.city;
      app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : wxMarkerData.district;
      that.setData({
        location: app.globalData.defaultCity,
        county: app.globalData.defaultCounty
      });
      that.getWeather();
      //that.getAir();
    }
    // 发起regeocoding检索请求   
    BMap.regeocoding({
      fail: fail,
      success: success
    }); 
  },          

  //引入了电影模板，绑定了点击方法，这里写跳转方法即可
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movies/movie-detail/movie-detail?id=" + movieId
    })
  },
  //点击更多电影，跳转页面
  onMoreTap: function (event) {
    wx.switchTab({
      url: '../movies/movies'
    });
  },

  //获取天气
  getWeather: function (e) {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'BmGEqlUhIwl7GmzXg9NM07WVreMVkn8u'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      let weatherData = data.currentWeather[0];
      let dress = data.originalData.results[0].index;
      app.globalData.weatherData = weatherData;
      app.globalData.forecast = data.originalData.results[0].weather_data;
      that.setData({
        weatherData: weatherData,
        dress: dress
      });
      console.log(that.data.dress);
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    });    
  },
  
  //点击更改定位切换到城市页面
  jump: function () {
    //关闭本页去切换城市，返回时就可以重新初始化定位信息哦
    wx.reLaunch({
      url: '../switchcity/switchcity'
    });
  },

  //点击天气跳转到天气页面
  gotoWeather: function () {
    wx.navigateTo({
      url: '../weather/weather'
    });
  },

  //轮播图绑定change事件，修改图标的属性是否被选中
  switchTab: function (e) {
    var sliderList = this.data.sliderList;
    var i, item;
    for (i = 0; item = sliderList[i]; ++i) {
      item.selected = e.detail.current == i;
    }
    this.setData({
      sliderList: sliderList
    });
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: 'e 生活',
      desc: '分享个小程序，希望你喜欢☺️~',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
      }
    }
  }
})