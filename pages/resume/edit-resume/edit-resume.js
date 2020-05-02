const utils = require("../../../utils/util.js")
const WXAPI = require('../../../wxapi/main')
const app = getApp()
const companyId = app.globalData.companyId
const COS = require('../../../utils/cos-wx-sdk-v5');
const paramObj = { companyId: companyId, type: 2 }
import WxValidate from '../../../utils/WxValidate'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fansId: '',
    region: ['浙江省', '杭州市'],    //设置初始化地址
    workTypes: [
      { name: '全职', value: 1 },
      { name: '兼职', value: 2 },
      { name: '实习', value: 3 },
    ],
    ageRange: [],
    workRange: [],
    workYears: 0,
    age: 0,
    applicantName: '',
    telephone: '',
    email: '',
    error: '',
    model: {
      maxExperience: 0,
      expectPosition: '',
      workType: 1,     //默认全职      
      minExperience: 0,
      expectPlace: '',
      age: 0
     
    },
    multiArray: [['1000', '2000', '3000', '4000'], ['5000', '6000', '7000', '8000']],
    multiIndex: [0, 0],
    minExpectSalary: 1000,
    maxExpectSalary: 3000

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
    console.log(options.id)

    WXAPI.getOneById(options.id).then(res => {
      if (res.code === 200) {
        this.setData({
          id: res.data.id,
          applicantName: res.data.applicantName,
          telephone: res.data.telephone,
          age: res.data.age,
          email: res.data.email,
          expectPosition: res.data.expectPosition,
          introduce: res.data.introduce,
          telephone: res.data.telephone,
          workYears: res.data.workYears,
          minExpectSalary: res.data.minExpectSalary,
          maxExpectSalary: res.data.maxExpectSalary,
          headUrl:res.data.headUrl
        })
      }
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
      ageRange: this.data.ageRange
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
      id:this.data.id,
      applicantName: this.data.applicantName,
      telephone: this.data.telephone,
      age: this.data.age,
      workYears: this.data.workYears,
      email: this.data.email,
      expectPosition: this.data.expectPosition,
      introduce: this.data.introduce,
      minExpectSalary: this.data.minExpectSalary,
      maxExpectSalary: this.data.maxExpectSalary
    }
   
    if (!this.WxValidate.checkForm(applicant)) {
      const error = this.WxValidate.errorList[0]
      this.setData({
        error: error.msg
      })
      return false
    }

    if (this.WxValidate.checkForm(applicant)) {
    WXAPI.editApplicantById(applicant).then(res => {
      if (res.code === 200) {
        wx.navigateTo({
          url: '../resume',
        })
      }
    })
    }
    
  },

  uploadPortrait: function () {
    var Bucket = 'test-1250000000';
    var Region = 'ap-guangzhou';
    // 初始化实例
    var cos = new COS({
      getAuthorization: function (options, callback) {
        // 异步获取签名
        wx.request({
          url: 'https://recruit.xcalculas.cn/pic/create/cos/secret',
          data: {
            Method: options.Method,
            Key: options.Key
          },
          dataType: 'text',
          success: function (result) {
            var data = result.data;
            var credentials = data && data.credentials;
            if (!data || !credentials) return console.error('credentials invalid');
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              StartTime: data.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
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
        var filePath = res.tempFiles[0].path;
        var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
        cos.postObject({
          Bucket: Bucket,
          Region: Region,
          Key: filename,
          FilePath: filePath,
          onProgress: function (info) {
            console.log(JSON.stringify(info));
          }
        }, function (err, data) {
          console.log(err || data);
        });
      }
    });
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
        min: 1
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
  },
  delPicture: function () {
    this.setData({
      headUrl: '',
    })

  },

  bindMultiPickerChange: function (e) {
    console.log(e)
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

  addExpectPosition: function () {
    console.log('选择职位类型');
    wx.navigateTo({
      url: "/pages/choose-category/index"
    })
  }





})