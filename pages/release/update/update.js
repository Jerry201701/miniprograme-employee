const WXAPI = require('../../../wxapi/main')
const CONFIG = require('../../../config.js')
const app = getApp()

Page({
  data: {
    select: false,
    tihuoWay: '全部',
    positions: true,
    array: ['美国', '中国', '巴西', '日本'],
    workExperienceArray: ['不限', '应届生', '1-3年', '3-5年', '5年以上'],
    educationArray: ['不限', '小学', '初中', '高中', '大学'],
    salaryArray: ['不限', '1k-3k', '3k-5k', '5k-10k', '10k以上'],
    workExperience: '不限',
    educationLevel: '不限',
    salaryRange: '不限',
    jobName: '',
    jobDescription: '',
    address: '',
    latitude: '',
    longitude: '',
    certificateList: [],
    wordNumber:0,
    id:0






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
    wx.setNavigationBarTitle({
      // title: wx.getStorageSync('mallName')
      title: "编辑岗位信息"
    });

    WXAPI.raleaseJobDetail(57).then(res => {
      if (res.code === 0) {
        // var address = res.data.address
        // var one = address.indexOf('省')
        // var two = address.indexOf('市')
        // var three = address.indexOf('区')
        // var city = address.substring(one + 1, two)
        // var district = address.substring(two + 1, three + 1)
        // res.data.city = city
        // res.data.district = district
        
      //  console.log(res.data)
        if (res.code === 0) {
          var arr = res.data.certificates.split(',')



          this.setData({
            id:res.data.id,
            jobName: res.data.jobName,
            workExperience: res.data.workExperience,
            educationLevel: res.data.educationLevel,
            salaryRange: res.data.salaryRange,
            jobDescription: res.data.jobDescription,
            address: res.data.address,
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            wordNumber: res.data.jobDescription.length,
            certificates: res.data.certificates,
            certificateList:arr
            
          })
        }
      }

    })



    // this.setData({
    //   jobName: e.jobName,
    //   jobDescription: e.jobDescription
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


  listStatus: function () {
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
      positions: true
    })
  },
  addPosition: function () {
    wx.redirectTo({
      url: '../add/add',
    })
  },
  addName: function () {
    wx.navigateTo({
      url: '../add/add-name/add-name?jobName='+this.data.jobName,
    })
  },
  addDesc: function () {
    wx.navigateTo({
      url: '../add/add-desc/add-desc',
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
  editJobInfo: function () {
    //console.log(this.data.certificateList)
    // var certificates=''
    // this.data.certificateList.forEach(function (value, i, array) {
    //   console.log(value)
    //   certificates.concat(value.to)
    // })
    // console.log(certificates)
    // var certificates=this.data
    console.log(this.data.jobDescription)
    var jobInfo = {
      id:this.data.id,
      jobName: this.data.jobName,
      educationLevel: this.data.educationLevel,
      jobDescription: this.data.jobDescription,
      salaryRange: this.data.salaryRange,
      address: this.data.address,
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      workExperience: this.data.workExperience,
      certificates: this.data.certificateList.toString()

    }

    WXAPI.editJobInfo(jobInfo).then(res => {
      if (res.code === 0) {
        wx.navigateTo({
          url: '/pages/release/edit/edit',
        })
        // wx.switchTab({
        //  url: '/pages/release/list/list'
        // })
        // that.setData({
        //   goodsRecommend: res.data
        // })
      }
    })
  },
  /**
  * 删除某个技能
  */
  delSkill: function (e) {
    let index = e.currentTarget.dataset.index
    this.data.certificateList.splice(index, 1)
    this.setData({
      certificateList: this.data.certificateList
    })
    console.log(this.data.certificateList)
  },
  /**
  * 文本域input事件
  */
  operateTextarea: function (e) {
    this.setData({
      jobDescription: e.detail.value,
      wordNumber: e.detail.value.length
    })
  },

})