const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const app = getApp()

Page({
  data: {
    select: false,
    tihuoWay: '全部',
    positions: true,
    jobInfos: [
      {
        jobName: '热菜厨师',
        salaryRange: '5k-7k',
        city: '成都',
        district: '高新区',
        educationLevel: '初中',
        workExperience: '1-3年'

      },
      {
        jobName: '凉菜厨师',
        salaryRange: '5k-7k',
        city: '成都',
        district: '高新区',
        educationLevel: '初中',
        workExperience: '1-3年'

      },
      {
        jobName: '西餐厨师',
        salaryRange: '5k-7k',
        city: '成都',
        district: '高新区',
        educationLevel: '初中',
        workExperience: '1-3年'

      },
      {
        jobName: '面点厨师',
        salaryRange: '5k-7k',
        city: '成都',
        district: '高新区',
        educationLevel: '初中',
        workExperience: '1-3年'

      }

    ],
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' }
    ]
  


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
    WXAPI.showAllJobs().then(res => {
    //  console.log(res)
    })
     




  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  test: function () {
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
    wx.navigateTo({
      url: '../add/add',
    })
  },
  getAllRelease: function () {
    console.log('开始获取全部数据集')
    WXAPI.showAllJobs().then(res => {
      console.log(res)

    })
  },
  checkboxChange: function (e) {
    console.log('选择第1条')
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  }





})