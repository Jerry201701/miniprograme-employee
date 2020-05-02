const WXAPI = require('../../../wxapi/main')
const utils = require("../../../utils/util.js")
const app = getApp()
const companyId = app.globalData.companyId
const paramObj = { companyId: companyId, type: 2 }
import WxValidate from '../../../utils/WxValidate'

Page({

  /**
   * 页面的初始数据
   */
  data: {
      fansId: '',
      wordNumber: 0,
      professional: ['大学','高中','中专','初中','小学','其他'],
      id: 0,
      schoolName: '',
      majorName: '',
      qualification: '',      
      beginTime: '',
      endTime: '',
      educationDesc: '',
      isReading: 0,
      educationLevel:'',
      error: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
    this.getOneEducationExperience(options.id)




    // this.setData({
    //   fansId: options.fansId,
    //   ['education.id']: options.itemId,
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
  onShow: function () {

  },
  
 
  /**
  * 切换是否在读状态
  */
  toggleReading: function () {
    if (this.data.education.isReading) {
      this.setData({
        ['education.isReading']: 0,
        ['education.endDateStr']: ""
      })
    } else {
      this.setData({
        ['education.isReading']: 1,
        ['education.endDateStr']: "至今"
      })
    }
  },

  
  /**
   * 操作输入框
   */
  operateInput: function (e) {
    let event = e.currentTarget.dataset.event
    let ty = e.currentTarget.dataset.type
    let keys = ["schoolName", "majorName"]
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
   * 选择学历
   */
  bindProfessChange: function (e) {
    console.log(e)
    this.setData({
      qualification:e.detail.value,
      educationLevel:this.data.professional[e.detail.value]
     
    })
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
      educationDesc: e.detail.value.trim(),
      wordNumber: e.detail.value.trim().length
    })
  },
  /**
  * 检查经历合法性
  */
  // checkExperienceForm: function () {
  //   let education = this.data.education;
  //   if (!education.graduateSchool || education.graduateSchool == "") {
  //     utils.toggleToast(this, "请输入学校名称")
  //     return false;
  //   }
  //   if (!education.major || education.major == "") {
  //     utils.toggleToast(this, "请输入专业名称")
  //     return false;
  //   }
  //   if (education.educationLev === null || education.educationLev === '') {
  //     utils.toggleToast(this, "请选择学历")
  //     return false;
  //   }
  //   if (!education.startDateStr) {
  //     utils.toggleToast(this, "请选择开始时间")
  //     return false;
  //   }
  //   if (education.isReading == 0 && !education.endDateStr) {
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
     const day = new Date(_this.data.beginTime)
   // console.log(isNaN(day))
   // console.log(isNaN(value.getDay()))
    // if (day > 0) {
    //   console.log('www')
    // }else{
    //   console.log('pppp')
    // }
    

    let parm={}
    if(_this.data.id===0){
      parm = {
        applicantId:applicantId,
        schoolName: _this.data.schoolName,
        majorName: _this.data.majorName,
        qualification: _this.data.educationLevel,
        beginTime: new Date(_this.data.beginTime),
        endTime: new Date(_this.data.endTime),
        educationDesc: _this.data.educationDesc,
        openId: wx.getStorageSync('openId')
      }
    }else{
      parm = {
        id:_this.data.id,
        schoolName: _this.data.schoolName,
        majorName: _this.data.majorName,
        qualification: _this.data.qualification,
        beginTime: new Date(_this.data.beginTime),
        endTime: new Date(_this.data.endTime),
        educationDesc: _this.data.educationDesc,
        openId: wx.getStorageSync('openId')
      }
    }
   // console.log(parm)

    if (!this.WxValidate.checkForm(parm)) {
      const error = this.WxValidate.errorList[0]
      this.setData({
        error:error.msg
      })
      return false
    }

    if (this.WxValidate.checkForm(parm)) {
    WXAPI.saveEducationExperience(parm).then(res => {

      if (res.code === 200) {
        wx.navigateTo({
          url: '/pages/resume/resume',
        })
      }
    })
    }
  },
  /**
   * 删除
   */

  del: function () {
    let _this = this;
    WXAPI.moveEducationExperience(_this.data.id).then(res => {
      if (res.code === 200) {
        wx.navigateBack()

      }
    })
  },



  getOneEducationExperience: function (id) {
    if (id) {
   
      WXAPI.getEducationExperienceById(id).then(res => {
        if (res.code === 200) {
         
          var begin = new Date(res.data.beginTime)
          var end = new Date(res.data.endTime)
          this.setData({
            id: res.data.id,
            schoolName: res.data.schoolName,
            majorName: res.data.majorName,
            beginTime: begin.getFullYear() + '-' + begin.getMonth(),
            endTime: end.getFullYear() + '-' + (end.getMonth() + 1),
            educationDesc: res.data.educationDesc,
            qualification: res.data.qualification,
            openId: res.data.openId

          })
        }
      })

    }


  },

  initValidate() {
    // 验证字段的规则
    const rules = {
      schoolName: {
        required: true,
      },
      majorName: {
        required: true,
      },
      qualification: {
        required: true,
      },
      beginTime: {
        begin:true,
      },
      endTime: {
        end:true,
      },
      educationDesc: {
        required: true,
      }

    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      schoolName: {
        required: '请填写学校名称',
      },
      majorName: {
        required: '请填写专业名称',
      },
      qualification: {
        required: '请选择学历',
      },
      // beginTime: {
      //   begin: '请选择开始时间',
      // },
      // endTime: {
      //   end: '请选择结束时间',
      // },
      educationDesc: {
        required: '请填写教育描述',
       
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





  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})