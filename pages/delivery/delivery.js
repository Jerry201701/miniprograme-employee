const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const app = getApp()

Page({
  data: {
    select: false,
    tihuoWay: '全部',
    positions: true,
    jobList: [],
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' }
    ],
    resumeList:[],
    choosed:true,
   
    chooseList:[]
  },
  onShow() {
    console.log('开始刷新页面')
    this.data.batch=false
    var id=110
    WXAPI.getResumeByCompany(id).then(res=>{
     // console.log(res.data)
      res.data.forEach((item,index)=>{
        var time =new Date(item.deliveryTime)
        item.deliveryTime=time.getMonth()+'月'+time.getDay()+'日'+' '+time.getHours()+':'+time.getMinutes()
        item.select=false
        item.checked=false
      })
     // console.log(res.data)
      this.setData({
        batch: false,
        resumeList:res.data

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

    var values = e.detail.value
    var resumeList = this.data.resumeList
   // console.log(this.data.resumeList)
   // console.log('checkbox发生change事件，携带value值为：', e.detail.value);


   // var resumeList = this.data.resumeList, values = e.detail.value;
    for (var i = 0, lenI = resumeList.length; i < lenI; ++i) {
      resumeList[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (resumeList[i].id == values[j]) {
          resumeList[i].checked = true;
          break;
        }
      }
    }

    // this.setData({
    //   checkboxItems: checkboxItems
    // });

    // for (var i = 0, lenI = resumeList.length; i < lenI; ++i) {
    //    for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
    //      if (resumeList[i].id == values[j]) {
    //        resumeList[i].checked = true;
    //       break;
    //     }
    //   }
    // }

    this.setData({
      resumeList: resumeList,
      chooseList:values
    });
  },


  selectResume: function (e) {
    // console.log(e.currentTarget)
    // var choose = e.currentTarget.dataset.selectde
    // if (e.currentTarget.dataset.selectde){
    //   e.currentTarget.dataset.selectde=false
    // }else{
    //   e.currentTarget.dataset.selectde=true
    // }
    //if(e.currentTarget.dataset.selected)
    // var id = e.currentTarget.id;
    // if (e.currentTarget.dataset.text.type === 'default') {
    //   this.data.certificates[e.currentTarget.id].type = "primary"
    // } else {
    //   this.data.certificates[e.currentTarget.id].type = "default"
    // }
    // this.setData({
    //   certificates: this.data.certificates
    // })
   
  },
  // selectResume:function(){
  //   if(this.data.choosed){
  //     this.setData({
  //       choosed:false
  //     })
  //   }else{
  //     choosed:true
  //   }

  // },
  toSingleResume:function(e){

    var id = e.currentTarget.dataset.id
    var open = e.currentTarget.dataset.open
    if(!this.data.batch){
    wx.navigateTo({
      url: './delivery-single/delivery-single?id='+id+'&openId='+open,
    })
    }
  },


  batchManagement:function(){
    this.setData({
      batch:true
    })

  },
  batchSubmit:function(){
    this.setData({
      batch:false
    })

  },


  inviteSubmit:function(){
    var that = this;
    var handles=[]
    that.data.chooseList.forEach((item, index) => {
     // item.interviewResult=true
      handles.push({
        id:item,
        interviewResult:true
      })
     } )
    WXAPI.handleBathcInterview(handles).then(res=>{
      if(res.code===0){
        wx.showToast({
          title: '简历处理成功',
          icon: 'success',
          duration: 3000,
          success:function(){
            that.onShow();   
          }       
        });
      }
    });
  },

  refuseSubmit:function(){
    var that = this;
    var handles = []
    that.data.chooseList.forEach((item, index) => {
      // item.interviewResult=true
      handles.push({
        id: item,
        interviewResult: false
      })
    })
    WXAPI.handleBathcInterview(handles).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '简历处理成功',
          icon: 'success',
          duration: 3000,
          success: function () {
            that.onShow();
          }
        });
      }
    });
  }

})