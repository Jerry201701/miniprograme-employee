const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp()
Page({
  data: {
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
    selected: {},
    messageArray:[],
    chatRecordArray:[],
    headUrl:''
  },
  
  onLoad: function () {

    wx.setNavigationBarTitle({
      title: '消息'
    })
  },

  onShow: function () {
    const that=this
  const applicantId=wx.getStorageSync('applicantId');
    // WXAPI.getOneById(applicantId).then(res=>{
    //   this.setData({
    //     headUrl: res.data.headUrl
    //   })
    // })
    WXAPI.listMessageByReceiver(applicantId).then(res=>{
      res.data.forEach((item, i) => {
        WXAPI.listChatCompanyBasic(item.companyId).then(r => {
          item.companyLogo = r.data.companyLogo,
            item.companyName = r.data.fullName
        })
      })
      setTimeout(function () {
        console.log(res.data)
        that.setData({
          messageArray: res.data
        })
      }, 500)
        // this.setData({
        //   messageArray:res.data
        // })
    })
    const openid = wx.getStorageSync('openid');
    WXAPI.countUnreadMessage(openid).then(res => {
      const count = res.data.toString()
      wx.setTabBarBadge({
        index: 1,
        text: count
      })
      if (res.data ===0) {
        wx.removeTabBarBadge({
          index:1
        })
      }
    })
  
  },

  close() {
    // 关闭select
    this.selectComponent('#select').close()
  },
  clearHistory() {
    console.log('清空历史记录')

  },
  showUnread(){
    console.log('查看未读信息')

  },
  startChat:function(e){
   console.log(e)
    wx.navigateTo({
      url: '/pages/chat/chat?jobId=' + e.currentTarget.dataset.jobid + '&messageType=' + e.currentTarget.dataset.type + '&companyId=' +e.currentTarget.dataset.companyid
    })
  }

})