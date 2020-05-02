const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    code:'',
    fullName:'',
    shortName:'',
    brand:'',
    address:'',
    minStaff:0,
    maxStaff:0,
    description:'',
    latitude:0,
    longitude:0,
    id:0









  },
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      //title: wx.getStorageSync('mallName')
      title: '审核中公司信息'
    })
   
    WXAPI.getCompanyDetailById(e.id).then(res=>{
      if(res.code===0){
        console.log(res.data)
        this.setData({
          id:res.data.id,
          fullName: res.data.fullName,
          shortName: res.data.shortName,
          brand: res.data.brand,
          address: res.data.address,
          minStaff: res.data.minStaff,
          maxStaff: res.data.maxStaff,
          description: res.data.description,
          latitude: res.data.latitude,
          longitude: res.data.longitude

        })




      }

    })
  },

  getJobDetails() {
    console.log('获取岗位详情');
    wx.navigateTo({
      url: "/pages/job-details/index"
    })
  },




  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },


  onShareAppMessage: function () {
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + CONFIG.shareProfile,
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },

  toSearch: function () {
    this.setData({
      curPage: 1
    });
    
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage + 1
    });
   
  },
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1
    });

    wx.stopPullDownRefresh()
  },
  // 以下为搜索框事件
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  chooseCategory: function () {
    console.log('选择职位类型');
    wx.navigateTo({
      url: "/pages/job-category/job-category"
    })
  },
  chooseCity: function () {
    wx.navigateTo({
      url: "/pages/city/city"
    })

  },
  chooseSalary: function () {

  },
  goMap(e) {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: this.data.fullName,
      address: this.data.address
    })
  },
  editCompanyInfo:function(){
   // var id=106
    wx.navigateTo({
      url: '/pages/edit-company/edit-company?id='+this.data.id,
   //   url: '/pages/edit-company/edit-company?id='+id,
    })





  }

})