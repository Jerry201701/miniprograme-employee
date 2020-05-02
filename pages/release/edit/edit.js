const WXAPI = require('../../../wxapi/main')
const CONFIG = require('../../../config.js')
const app = getApp()

Page({
  data: {
    jobInfo:{},
    workExperienceArray: ['不限', '应届生', '1-3年', '3-5年', '5年以上'],
    workExperience:'',
    educationArray: ['不限', '小学', '初中', '高中', '大学'],
    educationLevel:'',
    salaryArray: ['不限', '1k-3k', '3k-5k', '5k-10k', '10k以上'],
    salaryRange: '',
    jobName: '',
    jobDescription: '',
    address: '',
    latitude: '',
    longitude: '',
    certificateList: []


  },
  onShow() {
    // const _this = this
  },



  bindTypeTap: function (e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function (e) {
    WXAPI.raleaseJobDetail(57).then(res => {
      if(res.code===0){

        var address = res.data.address
        var one = address.indexOf('省')
        var two = address.indexOf('市')
        var three = address.indexOf('区')
        var city = address.substring(one + 1, two)
        var district = address.substring(two + 1, three + 1)
        res.data.city = city
        res.data.district = district
      if(res.code===0){

        this.setData({
        jobInfo:res.data
      })
      }
      }

    })


    // wx.setNavigationBarTitle({
    //   // title: wx.getStorageSync('mallName')
    //   title: "点餐小程序"
    // })


  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
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
  /**
   * input事件
   */
  operateInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          ['model.expectPosition']: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          ['model.expectPosition']: ''
        })
        break;
      default:
        break;
    }
  },


  workPickerChange: function (e) {
    console.log(e)
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value;
    var array = this.data.workExperienceArray;
    this.setData({
      workExperience: array[index]
    })
  },
  educationPickerChange: function (e) {
    var index = e.detail.value;
    var array = this.data.educationArray;
    this.setData({
      educationLevel: array[index]
    })
  },
  salaryPickerChange: function (e) {

    var index = e.detail.value;
    var array = this.data.salaryArray;
    this.setData({
      salaryRange: array[index]
    })
  },


  addAddress: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          address: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          address: ''
        })
        break;
      default:
        break;
    }

  },
  getLocation: function () {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  addCertificate: function () {
    wx.navigateTo({
      url: "/pages/certificate/certificate",
    })
  },
  addDesc: function () {
    wx.navigateTo({
      url: '../add/add-desc/add-desc',
    })
  },
  addName: function () {
    wx.navigateTo({
      url: '../add/add-name/add-name',
    })
  },
  editJobInfo:function(){
    wx.navigateTo({
      url: '../update/update',
    })

  },
  publish:function(){
    wx.switchTab({
      url: '/pages/release/list/list',
    })

  }


  
})