const WXAPI = require('../../../wxapi/main')
Page({
  data: {
    id: 0,
    applicantName: '',
    telephone: '',
    age: 0,
    email: '',
    expectPosition: '',
    introduce: '',
    telephone: '',
    workYears: 0,
    workExperienceList: [],
    educationExperienceList: [],
    certificateList: [],
    delCertificate: false,

    radioItems: [
      { name: 'cell standard', value: '0' },
      { name: 'cell standard', value: '1', checked: true }
    ],
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' }
    ],

    date: "2016-09-01",
    time: "12:01",

    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,

    countries: ["中国", "美国", "英国"],
    countryIndex: 0,

    accounts: ["微信号", "QQ", "Email"],
    accountIndex: 0,

    isAgree: false
  },
  onLoad: function (e) {
    console.log(e)
    this.setData({
      deliveryId:e.id,
      openId:e.openId
    })
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    const that = this
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {
        wx.setStorageSync('referrer', scene.substring(11))
      }
    }
    wx.setNavigationBarTitle({
      //title: wx.getStorageSync('mallName')
      title: '简历完整度90%'
    })

  },
  onShow: function (e) {
  
    wx.setStorage({
      key: 'openId',
      data: 'okPcg5U2GozllKqTnmPMqAcFmv2A',
    })
    var openId = wx.getStorageSync('openId')
    WXAPI.getOneByOpenId(this.data.openId).then(res => {
      if (res.code === 0) {
      //  console.log(res.data)
        var arr = res.data.certificateList.split(',')

        res.data.workExperienceList.forEach(function (item, index) {
          var begin = new Date(item.beginTime)
          var end = new Date(item.endTime)
          item.beginTime = begin.getFullYear() + '-' + begin.getMonth()
          item.endTime = end.getFullYear() + '-' + (end.getMonth() + 1)

        })
        res.data.educationExperienceList.forEach(function (item, index) {

          var begin = new Date(item.beginTime)
          var end = new Date(item.endTime)
          item.beginTime = begin.getFullYear() + '-' + begin.getMonth()
          item.endTime = end.getFullYear() + '-' + (end.getMonth() + 1)


        })

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
          workExperienceList: res.data.workExperienceList,
          educationExperienceList: res.data.educationExperienceList,
          certificateList: arr
        })
      }
    })

    //console.log(this.data.certificateList)


    // var applicant = {
    //   id: this.data.id,
    //   certificateList: this.data.certificateList,
    // }

    WXAPI.editApplicantById({
      id: this.data.id,
      certificateList: this.data.certificateList.toString()



    }).then(res => {
      if (res.code === 0) {
        console.log('保存证书成功')
      }
    })





  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
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
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCountryCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  add_certificate: function () {
    wx.navigateTo({
      url: "/pages/certificate/certificate"
    })
  },
  /**
   * 跳转到工作经历编辑页
   */
  workHistory: function (e) {
    let itemId = e.currentTarget.dataset.itemid;
    wx.navigateTo({
      url: '../experience/job-experience/index',
    })
  },
  /**
  * 跳转到教育经历编辑页
  */
  editEducation: function (e) {
    let itemId = e.currentTarget.dataset.itemid;
    wx.navigateTo({
      url: '../experience/education-experience/index',
    })
  },
  /**
  * 文本域input事件
  */
  operateTextarea: function (e) {
    this.setData({
      descript: e.detail.value,
      wordNumber: e.detail.value.length
    })
  },
  jobExperienceEdit: function () {
    // console.log(e)
    if (this.data.isEdite) {
      this.setData({
        isEdite: false,
        editStatus: '保存'
      })
    } else {
      this.setData({
        isEdite: true,
        editStatus: '修改'
      })
    }
    //console.log(this.data.isEdite);
  },
  delSkill: function (e) {
    let index = e.currentTarget.dataset.index
    this.data.certificateList.splice(index, 1)
    this.setData({
      certificateList: this.data.certificateList
    })

  },

  jobSkillEdit: function () {
    if (this.data.isEditeSkill) {
      this.setData({
        isEditeSkill: false,
        skillEditStatus: '编辑'
      })
    } else {
      this.setData({
        isEditeSkill: true,
        skillEditStatus: '保存'
      })
    }

  },
  selfDescEdit: function () {
    if (this.data.isEditeDesc) {
      this.setData({
        isEditeDesc: false,
        descEditStatus: '保存'
      })
    } else {
      this.setData({
        isEditeDesc: true,
        descEditStatus: '编辑'
      })
    }

  },

  uploadPortrait: function () {
    console.log('上传公司logo');
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        wx.uploadFile({
          url: 'http://localhost:8009/company/upload/logo',
          filePath: tempFilePaths[0],
          name: 'logo',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            //   'Authorization': 'Bearer ..'    //若有token，此处换上你的token，没有的话省略
          },
          // formData: {
          //   'user': 'test'  //其他额外的formdata，可不写
          // },
          success: function (res) {
            var data = res.data;
            console.log('data');
          },
          fail: function (res) {
            console.log('fail');
          },
        })
      }
    })

  },


  editBasicInfo: function () {
    console.log('编辑个人基本信息')
    wx.navigateTo({
      url: './edit-resume/edit-resume?id=' + this.data.id,
    })
  },

  editWorkExperience: function (e) {

    wx.navigateTo({
      url: '/pages/experience/job-experience/index?id=' + e.target.dataset.work
    })

  },

  editEducationExperience: function (e) {

    wx.navigateTo({
      url: '/pages/experience/education-experience/index?id=' + e.target.dataset.work
    })

  },
  editCertificate: function () {
    if (this.data.delCertificate) {
      this.setData({
        delCertificate: false
      })

      WXAPI.editApplicantById({
        id: this.data.id,
        certificateList: this.data.certificateList.toString()
      }).then(res => {
        if (res.code === 0) {
          console.log('保存证书成功')
        }
      })

    } else {
      this.setData({
        delCertificate: true
      })
    }
  },
  interview:function(e){
    var result=e.currentTarget.dataset.result
   // var r=true
    var data={
      id:this.data.deliveryId,
      interviewResult:result
    
    }
    WXAPI.interviewResult(data).then(res=>{
      if(res.code===0){
        wx.showToast({
          title: '反馈成功',
          icon: 'success',
          duration: 3000,
          success:function(){
              wx.navigateBack()
          }
        });
        
      }
    })







  }



});