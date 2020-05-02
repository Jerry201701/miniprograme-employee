const WXAPI = require('../../../wxapi/main')
const CONFIG = require('../../../config.js')
const app = getApp()

Page({
  data: {
    select: false,
    tihuoWay: '全部',
    positions:true,
    jobInfos:[
      {
        jobName:'热菜厨师',
        salaryRange:'5k-7k',
        city:'成都',
        district:'高新区',
        educationLevel:'初中',
        workExperience:'1-3年'

      },
      {
        jobName:'凉菜厨师',
        salaryRange:'5k-7k',
        city:'成都',
        district:'高新区',
        educationLevel:'初中',
        workExperience:'1-3年'

      },
      {
        jobName:'西餐厨师',
        salaryRange:'5k-7k',
        city:'成都',
        district:'高新区',
        educationLevel:'初中',
        workExperience:'1-3年'

      },
      {
        jobName:'面点厨师',
        salaryRange:'5k-7k',
        city:'成都',
        district:'高新区',
        educationLevel:'初中',
        workExperience:'1-3年'

      }

    ],
    jobList:[]
    
  },
  onShow() {
    WXAPI.showAllJobs().then(res => {
      res.data.forEach((item, i) => {
          var address=item.address
        var one = address.indexOf('省')
        var two=address.indexOf('市')
        var three=address.indexOf('区')
        var city = address.substring(one+1,two)
        var district=address.substring(two+1,three+1)
        item.city=city
        item.district = district
      })
  
      this.setData({
        jobList: res.data
      })
    })
  },

  bindTypeTap: function (e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function (e) {
   

  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  test:function(){
      console.log('aaaaa')
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName'),
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid'),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  goMap(e) {
    wx.openLocation({
      latitude: 30.7177100074,
      longitude: 103.9871621132,
      name: '吃了还要来中餐馆',
      address: '金周路1号珠宝中心401',
    })
  },
  callPhone(e) {
    const tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  
  
  listStatus:function(){
    console.log('test')
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select,
      positions: false
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    console.log(name)
    this.setData({
      tihuoWay: name,
      select: false,
      positions:true
    })
  },
  addPosition:function(){
    wx.navigateTo({
      url: '../add/add',
    })
  },
  getAllRelease:function(){
    console.log('开始获取全部数据集')
    WXAPI.showAllJobs().then(res=>{
      console.log(res)

    })
  }





})