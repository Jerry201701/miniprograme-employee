
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
    isShow: false
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /** 公有方法 **/
    showDialog() {
      this.setData({
        isShow: true
      })
    },
    hideDialog() {
      this.setData({
        isShow: false
      })
    },
    /** 私有方法,以下划线开头**/
    _linkTo(e) {
      console.log(e)
      let loty = e.currentTarget.dataset.logintype;
      wx.navigateTo({
        url: '/pages/loginRegister/loginRegister?loginType=' + loty,
      })
    },

    _getPhoneNumber(e) {
      //点击弹框授权之后执行此
      this.hideDialog();
      let _this = this;
       const sessionKey = wx.getStorageSync('sessionKey');
      const openid = wx.getStorageSync('openid');
      var decodePhoneInfo = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: sessionKey,
        openid: openid,
        type:2
      };
      WXAPI.decodePhoneNumber(decodePhoneInfo).then(function (res) {
        if(res.code==200){
          wx.setStorageSync('userId', res.data); 
          wx.navigateTo({
            url: '/pages/resume/create-resume/create-resume'
          })
          // wx.showToast({
          //   title: '注册完成',
          //   icon: 'success',
          //   duration: 3000
          // });
        }
        // if (res.code == 0) {
        //   console.log('之前注册过')
        //   console.log(res.data.loginPhone)
        //   wx.setStorage({
        //     key: 'phone',
        //     data: res.data.loginPhone,
        //   })
        //   wx.showToast({
        //         title: '简历投递成功',
        //         icon: 'success',
        //         success:function(){
        //           wx.navigateTo({
        //             url: '/pages/release/list/list',
        //           })
        //         },
        //         duration: 3000
        //       });

        //  wx.navigateBack()

          // WXAPI.getOneByOpenId(wx.getStorageSync('openId')).then(res => {
          //   if (res.data === null) {
          //     console.log('没有简历')
          //     wx.navigateTo({
          //       url: '/pages/resume/create-resume/create-resume',
          //     })
          //   } else {
          //     console.log('已经有简历了')

          //     wx.showToast({
          //       title: '简历投递成功',
          //       icon: 'success',
          //       duration: 3000
          //     });
          //   }
          // })
       
      //  }
        // if (res.code == 1) {
        //   console.log('第一次注册')
        //   wx.navigateTo({
        //     url: '/pages/resume/create-resume/create-resume',
        //   })
          
        // }

      })

    }





    
  }
})