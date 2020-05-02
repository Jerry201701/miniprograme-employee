const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    showDialog: false,
    dark:false
  },
  onLoad: function (e) {
    this.loginDialog = this.selectComponent("#loginDialog");
    wx.showShareMenu({
      withShareTicket: true
    })
    const that = this
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {
        wx.setStorageSync('referrer', scene.substring(11))
      }
    }
    wx.setNavigationBarTitle({
      //title: wx.getStorageSync('mallName')
      title: '食才'
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
  testLogin:function(){
    wx.navigateTo({
      url: '/pages/login/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  loadTo(){
    this.setData({
      istrue: true
    })
  },
  openConfirm: function () {
    wx.showModal({
      showCancel:true,
      title: '登录或者注册食才',
      content: '',
      confirmText: "注册账户",
      cancelText: "辅助操作",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击主操作')
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
  },
  openDialog: function () {
    this.setData({
      istrue: true
    })
    
  },
  closeDialog: function () {
    this.setData({
      istrue: false,
      dark:false
    })
  },
  testDialog:function(){
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      showCancel:true,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  
  },
  weiLoad:function(e){
    wx.login({
      success(res) {
        if (res.code) {
         // console.log(res);
          wx.request({
            url: 'http://localhost:8009/job/wei/load',
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res.data.data);
                // wx.getUserInfo({
                //   success: function (res) {
                //     var decodePhoneInfo = {
                //       encryptedData: res.encryptedData,
                //       iv: res.iv
                //     };
                //   },
                //   fail:function(){
                //     console.log('获取用户信息失败')
                //   }
                // })
             },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    this.setData({
      istrue: true,
      dark:true
    });
   this.loginDialog.showDialog();
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: 'http://localhost/index/users/decodePhone',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: that.data.session_key,
          uid: "",
        },
        method: "post",
        success: function (res) {
          console.log(res);
        }
      })
    }
  },
  // getPhoneNumber(e) {
  //   console.log(e.detail.errMsg)
 
  // }

})