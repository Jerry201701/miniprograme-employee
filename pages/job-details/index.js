const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//const app = getApp()
var app = getApp()

Page({
  data: {
    showDialog: false,
    sessionKey: '',
    userId: 0,
    applicantId: 0,
    error: '',
    interviewStatus:''
  },

  onShow() {
    const applicantId=wx.getStorageSync('applicantId')
    console.log(applicantId)
    if(applicantId){
      this.setData({
        applicantId:applicantId
      })
    }
    // console.log(this.data.deliveryStatus)
    // var status=''
    // switch (this.data.deliveryStatus) {
    //   case 1:
    //     status='已投递';
    //   case 2:
    //     status = '不合适';
    //     break;
    //   case 3:
    //     status = '邀请面试';
    //   case 4:
    //     status = '已录用';
    //   default:
    //     status = '等待通知';
    // }
    // this.setData({
    //   interviewStatus:status
    // })
   
    //用openid去查询是否注册过，注册过是否创建简历
    // const that = this
    // const openid = wx.getStorageSync('openid');
    // WXAPI.findBasicByOpenid(openid).then(res => {
    //     this.setData({
    //   userId:res.data.userId,
    //   applicantId:res.data.applicantId
    // })
    // })
    // this.setData({
    //   sessionKey: wx.getStorageSync('sessionKey')
    // })
    // const _this = this
  },

  bindTypeTap: function(e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function(e) {
    this.applicantLogin = this.selectComponent("#applicantLogin")
    const openid=wx.getStorageSync('openid');
    WXAPI.raleaseJobDetail(e.id,openid).then(res => {
      //console.log(res.data.deliveryStatus)
      if (res.code === 200) {
        var address = res.data.address
        var one = address.indexOf('省')
        var two = address.indexOf('市')
        var three = address.indexOf('区')
        var city = address.substring(one + 1, two)
        var district = address.substring(two + 1, three + 1)

        this.setData({
          id: res.data.id,
          city: city,
          district: district,
          address: res.data.address,
          certificates: res.data.certificates,
          jobDescription: res.data.jobDescription,
          jobName: res.data.jobName,
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          salaryRange: res.data.salaryRange,
          workExperience: res.data.workExperience,
          educationLevel: res.data.educationLevel,
          companyName: res.data.companyName,
          description: res.data.description,
          brand: res.data.brand,
          minStaff: res.data.minStaff,
          maxStaff: res.data.maxStaff,
          companyId:res.data.companyId,
          deliveryStatus: res.data.deliveryStatus,
          companyLogo: res.data.companyLogo
        })
      }
    })
    
  //  console.log(this.data.deliveryStatus)
    var status = ''
    switch (this.data.deliveryStatus) {
      case 1:
        status = '已投递';
      case 2:
        status = '不合适';
        break;
      case 3:
        status = '邀请面试';
      case 4:
        status = '已录用';
      default:
        status = '等待通知';
    }
    this.setData({
      interviewStatus: status
    })
   

  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },

  // onShareAppMessage: function() {
  //   return {
  //     title: wx.getStorageSync('mallName'),
  //     path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid'),
  //     success: function(res) {
  //       // 转发成功
  //     },
  //     fail: function(res) {
  //       // 转发失败
  //     }
  //   }
  // },

  goMap(e) {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      // name: '吃了还要来中餐馆',
      address: this.data.address,
    })
  },
  callPhone(e) {
    const tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },

  openConfirm: function() {
    
    //先判断是否注册过，没有注册要求注册，再判断是否有简历，没有简历要创建简历
    const that = this
    if(that.data.deliveryStatus===1){
      that.setData({
        error: '已经投递了'
      })
      return
    }
    const openid = wx.getStorageSync('openid')
    WXAPI.findBasicByOpenid(openid).then(res => {
     if(res.data===1){
       wx.showModal({
          title: '需要登录才能投递简历',
          confirmText: "登录",
          cancelText: "取消",
          success: function(res) {
            if (res.confirm) {
              that.applicantLogin.showDialog();
            } else {
              console.log('用户点击取消')
            }
          }
        });
     }
     if(res.data.status===2){
          wx.showModal({
          title: '需要创建简历才能投递',
          confirmText: "创建",
          cancelText: "取消",
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/resume/create-resume/create-resume'
              })
            } else {
              console.log('用户点击取消')
            }
          }
        });
     }
     if(res.data.status===3){
       WXAPI.deliveryResume({
          jobId: that.data.id,
          companyId:that.data.companyId,
          applicantId: res.data.applicantId,
          interviewResult:1
        }).then(res => {
          if (res.code === 200) {
            wx.showToast({
              title: '投递成功',
              icon: 'success',
              duration: 3000
            });
            that.setData({
              deliveryStatus: 1
            })
          }
        })
     }
      })
    
  },




  chatWithEmployer: function() {
   
    wx.navigateTo({
      url: "/pages/chat/chat?jobId="+this.data.id
    })


  },

  comeBack: function() {
    this.loginDialog.hideDialog();
    this.setData({


    })

    // this.setData({
    //   dark: false,
    //   condition: true,
    //   status: false
    // });
  }







})