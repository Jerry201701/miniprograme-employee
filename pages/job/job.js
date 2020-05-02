const app = getApp();
const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
Page({
  data: { 
    index: 0,
    date: '2016-09-01',
    time: '12:01',
    multiArray: [['1000', '2000','3000','4000'], ['5000', '6000','7000','8000']],//二维数组，长度是多少是几列
    multiIndex: [0, 0],
    categoryName:'请选择想找的期望工作',
    categoryId:0,
    regionName:'请选择想去的工作区域',
    regionId:0,
    salary:'请选择你期望的薪资',
    minSalary:0,
    maxSalary:0,
    options: [{
      city_id: '001',
      city_name: '北京'
    }, {
      city_id: '002',
      city_name: '上海'
    }, {
      city_id: '003',
      city_name: '深圳'
    }],
    selected: {}


  },
  onLoad: function (e) {
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    // if (e && e.scene) {
    //   const scene = decodeURIComponent(e.scene)
    //   if (scene) {
    //     wx.setStorageSync('referrer', scene.substring(11))
    //   }
    // }
    wx.setNavigationBarTitle({
      title: '食才'
    })

    const that = this
    wx.login({
      success(res) {
        if (res.code) {
          WXAPI.weiFirstLoad(res.code).then(res => {
            if (res.code === 200) {
              wx.setStorageSync('openid', res.data.openid)
              wx.setStorageSync('sessionKey', res.data.sessionKey)
              // wx.setStorage({
              //   key: 'openid',
              //   data: res.data.openid
              // })
            } else {
              console.log('获取openid失败')
            }
          })
        } else {
          console.log('获取code失败')
        }
      }
    })

  },
  onShow(){
    //console.log(this.data.category)

  },

  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  
  
  // onShareAppMessage: function () {
  //   return {
  //     title: '"' + wx.getStorageSync('mallName') + '" ' + CONFIG.shareProfile,
  //     path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
  //   }
  // },
  
 
 chooseCategory:function(){
   console.log('选择职位类型');
   wx.navigateTo({
     url: "/pages/choose-category/index"
   })
 },
 chooseCity:function(){
   wx.navigateTo({
     url: '/pages/region/region',
   })
  //  wx.navigateTo({
  //    url: "/pages/city/city"
  //  })

 },
 

  

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const minSalary = this.data.multiArray[0][e.detail.value[0]]
    const maxSalary = this.data.multiArray[1][e.detail.value[1]]
    this.setData({
          salary: minSalary + '—' + maxSalary,
          minSalary:minSalary,
          maxSalary:maxSalary
        })
  },
  
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    
  },

  finishSelection: function () {
    
    app.globalData.regionName = this.data.regionName
    app.globalData.categoryName = this.data.categoryName
    app.globalData.minSalary = this.data.minSalary
    app.globalData.maxSalary = this.data.maxSalary
    
    const openid=wx.getStorageSync('openid');
  WXAPI.countUnreadMessage(openid).then(res=>{
    if(res.data>0){
    const count = res.data.toString()
    wx.setTabBarBadge({
      index: 1,
      text: count
    })
    }

  })


    wx.switchTab({
      url: '/pages/job-list/index',
    })




  }




})