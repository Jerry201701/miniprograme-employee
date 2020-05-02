// pages/certificate/certificate.js
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificates:[
      {name:'健康证',type:"default"},
      {name:'中式烹调师(初级)',type:"default"},
      {name:'中式烹调师(高级)',type:"default"},
      {name:'西式烹调师(初级)',type:"default"},
      {name:'西式烹调师(高级)',type:"default"},
      {name:'中式面点师(初级)',type:"default"},
      {name:'中式面点师(高级)',type:"default"}
     
    ],
    type:'default',
    isChoosed:false,
    isDisable:true,
    
   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '证书选择'
    })
  
  

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  chooseCertificate:function(e){
    var id = e.currentTarget.id;
if(e.currentTarget.dataset.text.type==='default'){
    this.data.certificates[e.currentTarget.id].type="primary"
}else{
  this.data.certificates[e.currentTarget.id].type = "default"
}
    this.setData({
      certificates: this.data.certificates
    })   
  },


  /*
  统计选择的资格证书
  */
  savaCertificate:function(){
    const applicantId = wx.getStorageSync('applicantId')
   var list=[]
    this.data.certificates.forEach(function (value, i, array) {
      if(value.type==='primary'){
      list.push(value.name)
      }
    })
    WXAPI.editApplicantById({
      id: applicantId,
      certificateList: list.toString()
    }).then(res => {
      console.log(res)
      if (res.code === 200) {
        wx.navigateBack()
      }
    })

    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    // var prevPage = pages[pages.length - 2];  //上一个页面
    // prevPage.setData({
    //   certificateList: list
    // })
   
  }
  

})