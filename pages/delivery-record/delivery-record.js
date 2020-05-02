const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    jobList: []


  },
  onLoad: function (e) {

    // wx.setNavigationBarTitle({
    //   //title: wx.getStorageSync('mallName')
    //   title: '食才'
    // })
  },

  onShow(){
    const applicantId=wx.getStorageSync('applicantId')
    WXAPI.listPostByApplicant(applicantId).then(res => {
      if (res.code === 200) {
        res.data.forEach((item, i) => {
          var createTime = new Date(item.createTime)
          item.createTime = createTime.getMonth() + '月' + createTime.getDay() + '日'
          res.data
          var address = item.address
          var one = address.indexOf('省')
          var two = address.indexOf('市')
          var three = address.indexOf('区')
          var city = address.substring(one + 1, two)
          var district = address.substring(two + 1, three + 1)
          item.city = city
          item.district = district
          this.data.jobList.push(item)
        })
        this.setData({
          jobList: res.data
        })
      }

    })

  },

  getJobDetails(e) {
    var id = e.currentTarget.dataset.id
    // console.log('获取岗位详情');
    wx.navigateTo({
      url: "/pages/job-details/index?id=" + id,
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
    this.getGoodsList(this.data.activeCategoryId);
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(this.data.activeCategoryId, true)
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

  }

})