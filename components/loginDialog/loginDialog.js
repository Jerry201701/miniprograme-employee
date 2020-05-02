
let commonApi = require("../../utils/commonApi.js")
let network = require('../../utils/network.js')
const WXAPI = require('../../wxapi/main')

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
  },
  /**
  * 私有数据,组件的初始数据
  * 可用于模版渲染
  */
  data: {
    isShow: false,
   
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
   
    /** 公有方法 **/
    showDialog() {
      console.log('77')
      this.setData({
        isShow: true
      })
    },
    hideDialog() {
      this.setData({
        isShow: false
      })
    },

    _getPhoneNumber(e) {
      console.log('1111')
      //点击弹框授权之后执行此
      // this.hideDialog();
      // let _this = this;
      // const sessionKey = wx.getStorageSync('sessionKey');
      // const openid = wx.getStorageSync('openid');
      // var decodePhoneInfo = {
      //   encryptedData: e.detail.encryptedData,
      //   iv: e.detail.iv,
      //   sessionKey: sessionKey,
      //   openid: openid
      // };
      // WXAPI.decodePhoneNumber(decodePhoneInfo).then(function (res) {
      //   console.log(res)
      //   if (res.code == 200) {
      //     if (res.data == 1) {
      //       _this.triggerEvent("comeBack")
      //     }
      //     if (res.data == 2) {
      //       wx.switchTab({
      //         url: '/pages/release/list/list',
      //       })
      //     }
      //   }
      // })

    }


   
    // _getPhoneNumber(e) {
    //   this.hideDialog();
    //   let _this = this;
    //  // const sessionKey = wx.getStorageSync('sessionKey');
    //   const sessionKey = 'wwefregreh'
    //   console.log(sessionKey)
    //   var decodePhoneInfo = {
    //     encryptedData: e.detail.encryptedData,
    //     iv: e.detail.iv,
    //     sessionKey: 'wgrehtr',
    //     openid: 'qqqq'

    //   };
    //   console.log(decodePhoneInfo);
    //   WXAPI.decodePhoneNumber({
    //     encryptedData: e.detail.encryptedData,
    //     iv: e.detail.iv,
    //     sessionKey: 'wgrehtr',
    //     openid: 'qqqq'
    //   }).then(function (res) {
    //     if (res.code == 0) {
    //       console.log('开始发布岗位')
    //       wx.switchTab({
    //         url: '/pages/release/list/list',
    //       })
         
    //     }
    //     if(res.code==1){
    //           wx.redirectTo({
    //             url: '../../pages/create-company/create-company',
    //           })
    //     }
    //   })
    // }




  }
})