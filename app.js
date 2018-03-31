App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
  },

  globalData: {
    defaultCity: '',
    defaultCounty: '',
    weatherData: '',
    air: '',
    forecast:'',
    day: '',
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    bingBase: "https://cn.bing.com",
    doubanBase: "https://api.douban.com",
    miWeatherBase: "https://weatherapi.market.xiaomi.com",
    toutiaoBase:"https://v.juhe.cn/toutiao/index",
    BmapBase: "https://api.map.baidu.com",
    toutiaoKey: "d7aff92835927cf98419d59bf80b02dd",
    bmapak: 'BmGEqlUhIwl7GmzXg9NM07WVreMVkn8u',
    curBook: ""
  }

})
