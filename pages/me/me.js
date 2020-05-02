const app = getApp()
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
const AUTH = require('../../utils/auth')

Page({
  data: {
    rechargeOpen: false ,// 是否开启充值[预存]功能,
    createResume:true,
    id: 0,
    applicantName: '',
    telephone: '',
    age: 0,
    email: '',
    expectPosition: '',
    introduce: '',
    telephone: '',
    workYears: 0,
    show:false
  },
  onLoad() {
    const openid = wx.getStorageSync('openid');
      WXAPI.findBasicByOpenid(openid).then(res => {
        if(res.data.applicantId){
          wx.setStorage({
            key: 'applicantId',
            data: res.data.applicantId
          })
        } 
      })

    wx.setNavigationBarTitle({
      //title: wx.getStorageSync('mallName')
      title: '个人中心'
    })
      
   // const applicantId = wx.getStorageSync('applicant');
    // if (applicantId) {
    //   this.setData({
    //       id:applicantId,
    //       show:true
    //   })
    // }else{
    //   const openid = wx.getStorageSync('openid');
    //   WXAPI.findBasicByOpenid(openid).then(res => {
    //     if(res.data.applicantId){
    //       wx.setStorage({
    //         key: 'applicantId',
    //         data: res.data.applicantId
    //       })
    //     } 
    //   })
    // }
   
    // let rechargeOpen = wx.getStorageSync('RECHARGE_OPEN')
    // if (rechargeOpen && rechargeOpen == "1") {
    //   rechargeOpen = true
    // } else {
    //   rechargeOpen = false
    // }
    // this.setData({
    //   rechargeOpen: rechargeOpen
    // })
    // wx.setNavigationBarTitle({
    //   title: '我的'
    // })
  },
  onShow() {
    const that = this
    const openid = wx.getStorageSync('openid');
    WXAPI.findBasicByOpenid(openid).then(res => {
        if(res.data.applicantId){
          WXAPI.showApplicantDetail(res.data.applicantId).then(res => {
      if (res.code === 200) {
        this.setData({
          show:true,
          id: res.data.id,
          applicantName: res.data.applicantName,
          telephone: res.data.telephone,
          age: res.data.age,
          email: res.data.email,
          expectPosition: res.data.expectPosition,
          introduce: res.data.introduce,
          telephone: res.data.telephone,
          workYears: res.data.workYears,
          createResume:false,
          headUrl:res.data.headUrl,
          minExpectSalary: res.data.minExpectSalary,
          maxExpectSalary: res.data.maxExpectSalary

        })
      }
    })
        }
    })


    // var id = wx.getStorageSync('applicantId')
    // const _this = this
    // this.setData({
    //   version: CONFIG.version,
    //   vipLevel: app.globalData.vipLevel
    // })
    // AUTH.checkHasLogined().then(isLogined => {
    //   if (isLogined) {
    //     _this.setData({
    //       userInfo: wx.getStorageSync('userInfo')
    //     })
    //     _this.getUserApiInfo();
    //     _this.getUserAmount();
    //   }
    // })
  },



  onGotUserInfo(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '您已取消登录',
        icon: 'none',
      })
      return;
    }
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      AUTH.login(this);
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
 

  getUserApiInfo: function () {
    var that = this;
    WXAPI.userDetail(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        let _data = {}
        _data.apiUserInfoMap = res.data
        if (res.data.base.mobile) {
          _data.userMobile = res.data.base.mobile
        }
        that.setData(_data);
      }
    })
  },

  editBasic:function(){
  wx.navigateTo({
    url: '/pages/resume/resume',
  })




  }
 









  
})