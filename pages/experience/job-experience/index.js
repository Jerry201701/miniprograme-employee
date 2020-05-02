const WXAPI = require('../../../wxapi/main')
const utils = require("../../../utils/util.js")
const app = getApp()
import WxValidate from '../../../utils/WxValidate'
//const companyId = app.globalData.companyId
//const paramObj = { companyId: companyId, type: 2 }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fansId: '',
    id: 0,
    wordNumber: 0,
    isWorking: 0,
    companyName:'',
    jobName:'',
    beginTime:'',
    endTime:'',
    responsibility:'',
    openId:'',
    error: ''
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.initValidate()
    console.log(e)
    this.getOneWorkExperience(e.id)
   

    // this.setData({
    //   fansId: options.fansId,
    //   id: options.itemId,
    // })
    // if (options.itemId != 0) {
    //   this.getResumeInfoByRoute()
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
   
  },
 
  /**
  * 切换是否在职状态
  */
  toggleWorking: function () {
    if (this.data.isWorking) {
      this.setData({
        isWorking: 0,
        workEndDateStr: ""
      })
    } else {
      this.setData({
        isWorking: 1,
        workEndDateStr: "至今"
      })
    }
  },
  /**
   * 操作输入框
   */
  operateInput: function (e) {
    let event = e.currentTarget.dataset.event
    let ty = e.currentTarget.dataset.type
    let keys = ["companyName", "jobName"]
    switch (event) {
      case 'input':
        this.setData({
          [keys[ty - 1]]: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          [keys[ty - 1]]: ''
        })
        break;
      default:
        break;
    }
  },
  /**
   * 选择开始时间
   */
  bindStartDateChange: function (e) {
    this.setData({
      beginTime: e.detail.value
    })
   
  },
  /**
  * 选择结束时间
  */
  bindEndDateChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  /**
  * 文本域input事件
  */
  operateTextarea: function (e) {
    this.setData({
      responsibility: e.detail.value,
      wordNumber: e.detail.value.length
    })
  },
  /**
  * 检查工作经历合法性
  */
  // checkExperienceForm: function () {
  //   let _data = this.data;
  //   if (!_data.workCompany || _data.workCompany == "") {
  //     utils.toggleToast(this, "请输入公司名称")
  //     return false;
  //   }
  //   if (!_data.position || _data.position == "") {
  //     utils.toggleToast(this, "请输入职位名称")
  //     return false;
  //   }
  //   if (!_data.workStartDateStr) {
  //     utils.toggleToast(this, "请选择开始时间")
  //     return false;
  //   }
  //   if (_data.isWorking == 0 && !_data.workEndDateStr) {
  //     utils.toggleToast(this, "请选择结束时间")
  //     return false;
  //   }
  //   return true;
  // },




  /**
  * 完成保存
  */
  save: function () {
    const _this = this
    const applicantId = wx.getStorageSync('applicantId')
    var workExperience={}
    if(_this.data.id===0){
     workExperience={
      applicantId:applicantId,
      companyName: _this.data.companyName,
      jobName: _this.data.jobName,
      beginTime: new Date(_this.data.beginTime),
      endTime:new Date(_this.data.endTime),
      responsibility: _this.data.responsibility,
      openId: wx.getStorageSync('openId')
    }
    }else{
      workExperience = {
        id:_this.data.id,
        companyName: _this.data.companyName,
        jobName: _this.data.jobName,
        beginTime: new Date(_this.data.beginTime),
        endTime: new Date(_this.data.endTime),
        responsibility: _this.data.responsibility,
        openId: wx.getStorageSync('openId')
      }
    }
    
    if (!this.WxValidate.checkForm(workExperience)) {
      const error = this.WxValidate.errorList[0]
      this.setData({
        error: error.msg
      })
      return false
    }


    if (this.WxValidate.checkForm(workExperience)) {
    WXAPI.saveWorkExperience(workExperience).then(res => {

      if (res.code === 200) {
        var code = res.data
     
        wx.navigateBack()

       
      }
    })
    }
  },
  /**
   * 删除
   */
  del: function () {
    let _this = this;
    WXAPI.moveWorkExperience(_this.data.id).then(res => {
      if(res.code===200){
        wx.navigateBack()

      }
    })
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
  getOneWorkExperience:function(id){
    if(id){
    WXAPI.getWorkExperienceById(id).then(res => {
      if (res.code === 200) {
        var begin = new Date(res.data.beginTime)
        var end = new Date(res.data.endTime)
        this.setData({
          id: res.data.id,
          companyName: res.data.companyName,
          jobName: res.data.jobName,
          beginTime: begin.getFullYear() + '-' + begin.getMonth(),
          endTime: end.getFullYear() + '-' + (end.getMonth() + 1),
          responsibility: res.data.responsibility,
          openId: res.data.openId
        })
      }
    })

    }


  },

 
  initValidate() {
    // 验证字段的规则
    const rules = {
      companyName: {
        required: true,
      },
      jobName: {
        required: true,
      },
      beginTime: {
        begin: true,
      },
      endTime: {
        end: true,
      },
      responsibility: {
        required: true,
      }

    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      companyName: {
        required: '请填写公司名称',
      },
      jobName: {
        required: '请填写职位名称',
      },
      responsibility: {
        required: '请填写工作描述',
      }

    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

    //自定义验证规则
    // this.WxValidate.addMethod('time', (value, param) => {
    //   return this.WxValidate.optional(value) || (value.toDateString().length>0)
    // }, '请选择开始时间')

    this.WxValidate.addMethod('begin', (value, param) => {
      // console.log()
      return !isNaN(value.getMonth())
    }, '请选择开始时间')

    this.WxValidate.addMethod('end', (value, param) => {
      return !isNaN(value.getMonth())
    }, '请选择结束时间')


  }

})