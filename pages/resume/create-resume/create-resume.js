const network = require("../../../utils/network.js")
const utils = require("../../../utils/util.js")
const WXAPI = require('../../../wxapi/main')
const app = getApp()
const companyId = app.globalData.companyId
const paramObj = { companyId: companyId, type: 2 }
const COS = require('../../../utils/cos-wx-sdk-v5');
import WxValidate from '../../../utils/WxValidate'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:0,
    applicantId:0,
    fansId: '',
    region: ['浙江省', '杭州市'],    //设置初始化地址
    workTypes: [
      { name: '全职', value: 1 },
      { name: '兼职', value: 2 },
      { name: '实习', value: 3 },
    ],
    ageRange:[],
    workRange:[],
    workYears:0,
    age:20,
    applicantName:'',
    telephone:'',
    email:'',
    model: {
      maxExperience: 0,
      expectPosition: '',
      workType: 1,     //默认全职      
      minExperience: 0,
      expectPlace: '',
      age:0
    },
    picturePath :'',
    upload:false,
    multiArray: [['1000', '2000', '3000', '4000'], ['5000', '6000', '7000', '8000']],
    multiIndex: [0, 0],
    minExpectSalary:1000,
    maxExpectSalary:3000,
    expectPosition:'',
    error: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.initValidate()
    const that = this
    const openid = wx.getStorageSync('openid');
    WXAPI.getUserIdByOpenid(openid).then(res => {
       that.setData({
          userId:res.data.userId
        })
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
    this.initAgeRange()
    this.initWorkRange()

  },
 
  /**
   * input事件
   */
  nameInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          applicantName: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          applicantName: ''
        })
        break;
      default:
        break;
    }
  },

  emailInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          email: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          email: ''
        })
        break;
      default:
        break;
    }
  },


  telephoneInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          telephone: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          telephone: ''
        })
        break;
      default:
        break;
    }
  },



  operateInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          expectPosition: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          expectPosition: ''
        })
        break;
      default:
        break;
    }
  },


  
  
  /**
   * 初始化年龄数据
   */
  initAgeRange: function () {
    let ageTotal = 100;
    for (let i = 18; i <= ageTotal; i++) {
      this.data.ageRange.push(i)
    }
    this.setData({
      ageRange:this.data.ageRange
    })
    
  },

  initWorkRange: function () {
    let workTotal = 30;
    for (let i = 1; i <= workTotal; i++) {
      this.data.workRange.push(i)
    }
    this.setData({
      workRange: this.data.workRange
    })
    
  },




  /**
   * 确保右边大于左边
   */
  columnchange: function (e) {
    console.log(e.detail)
    let detail = e.detail, sv = this.data.workExperienceValue;
    if (detail.column === 0) {
      this.setData({
        ['workExperienceValue[0]']: detail.value
      })
      if (detail.value > sv[1]) {
        this.setData({
          workExperienceValue: [detail.value, detail.value]
        })
      }
    }
    if (detail.column === 1) {
      this.setData({
        ['workExperienceValue[1]']: detail.value
      })
      if (sv[0] > detail.value) {
        this.setData({
          workExperienceValue: [detail.value, detail.value]
        })
      }
    }
  },


  operateTextarea: function (e) {
    this.setData({
      introduce: e.detail.value.trim(),
      wordNumber: e.detail.value.trim().length
    })
  },


  bindAgeChange: function (e) {
    // console.log(e)
    // let selectedVal = e.detail.value    
    // let ageRange = this.data.ageRange
  
    this.setData({
      age: this.data.ageRange[e.detail.value]
     
    })

  },


  bindWorkChange: function (e) {
    
    this.setData({
      workYears: this.data.workRange[e.detail.value]
     
    })

  },


  /**
  * 保存
  */
  save: function () {
    var applicant = {
     applicantName:this.data.applicantName,
     userId:this.data.userId,
     telephone:this.data.telephone,
     age:this.data.age,
     workYears:this.data.workYears,
     email:this.data.email,
     expectPosition: this.data.expectPosition,
     introduce:this.data.introduce,
     headUrl:this.data.picturePath,
     maxExpectSalary: this.data.maxExpectSalary,
     minExpectSalary: this.data.minExpectSalary
    }

    if (!this.WxValidate.checkForm(applicant)) {
      const error = this.WxValidate.errorList[0]
      this.setData({
        error: error.msg
      })
      return false
    }

    if (this.WxValidate.checkForm(applicant)) {
    WXAPI.saveApplicantInfo(applicant).then(res => {
      if (res.code === 200) {
        wx.setStorage({
          key: 'applicantId',
          data: res.data,
        })
        wx.navigateBack({
          delta: 1
        })
      //  wx.navigateTo({
      //    url: '../resume'
      //  })
      }
    })
    }
    // let _this = this
    // if (this.data.workTypeIndex == 0) {  //防止没选择，使用默认的全职
    //   _this.data.model.workType = 1
    // }
  },

  uploadPortrait: function () {
    const that = this
    console.log('上传公司logo');
    var Bucket = 'picture2019-1256835711';
    var Region = 'ap-beijing';
   
    // 初始化实例
    var cos = new COS({
      // ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
      getAuthorization: function (options, callback) {
        // 异步获取临时密钥
        wx.request({
          url: 'https://recruit.xcalculas.cn/pic/create/cos/secret',
          data: {
            bucket: options.Bucket,
            region: options.Region,
          },
          dataType: 'json',
          success: function (result) {
            var data = result.data;
            var credentials = data && data.credentials;
            if (!data || !credentials) return console.error('credentials invalid');
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
              ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
            });
          }
        });
      }
    });
    // 选择文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认用原图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var fileName = 'job/'.concat(utils.randomString()).concat('.')
        var filePath = res.tempFiles[0].path;
        fileName = fileName.concat(filePath.substr(filePath.lastIndexOf('.') + 1));
        console.log(filePath)
        console.log(fileName)
        cos.postObject({
          Bucket: Bucket,
          Region: Region,
          Key: fileName,
          FilePath: filePath,
          onProgress: function (info) {
           // console.log(JSON.stringify(info));
          }
        }, function (err, data) {
          if(data){
            that.setData({
              picturePath: data.Location,
              upload:true
            })
          }
          if(err){
            console.log('上传失败')
          }
          
        });

      }
    });

  },
  delPicture:function(){
    this.setData({
      picturePath: '',
      upload: false
    })

  },
  radomTest:function(){
    const random=utils.randomString()
    console.log(random)
    // const number = Math.random().toString(36).substr(2, 15)
    // const timestamp = parseInt(new Date().getTime() / 1000)
    // console.log(number.concat(timestamp))
   

  },


  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const minSalary = this.data.multiArray[0][e.detail.value[0]]
    const maxSalary = this.data.multiArray[1][e.detail.value[1]]
    this.setData({
      minExpectSalary: minSalary,
      maxExpectSalary: maxSalary
    })
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

  },

  addExpectPosition:function(){
    console.log('选择职位类型');
    wx.navigateTo({
      url: "/pages/choose-category/index"
    })
  },


  initValidate() {
    // 验证字段的规则
    const rules = {
      applicantName: {
        required: true,
      },
      age: {
        required: true,
        min: 18,
      },
      telephone: {
        required: true,
        tel: true,
      },
      email: {
        required: true,
        email: true,
      },
      expectPosition: {
        required: true,
      },
      minExpectSalary: {
        required: true,
      },
      maxExpectSalary: {
        required: true,
      },
      workYears: {
        required: true,
        min:1
      },
      introduce: {
        required: true,
      }

    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      applicantName: {
        required: '请输入姓名',
      },
      age: {
        required: '请选择年龄',
        min: '年龄不小于18',
      },
      telephone: {
        required: '请输入电话',
        tel: '请输入正确的手机号',
      },
      email: {
        required: '请输入邮箱',
        email: '请输入正确的邮箱',
      },
      expectPosition: {
        required: '请输入期望岗位',
      },
      minExpectSalary: {
        required: '请选择最小工资',
      },
      maxExpectSalary: {
        required: '请选择最大工资',
      },
      workYears: {
        required: '请选择工龄',
        min: '请选择工龄'
      },
      introduce: {
        required: '请输入自我描述',
      }

    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

    // 自定义验证规则
    // this.WxValidate.addMethod('assistance', (value, param) => {
    //   return this.WxValidate.optional(value) || (value.length >= 1 && value.length <= 2)
    // }, '请勾选1-2个敲码助手')
  }


 
})