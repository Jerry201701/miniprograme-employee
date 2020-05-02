const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
var jobData = require('../../utils/city.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    fansId: '',
    region: ['浙江省', '杭州市'],    //设置初始化地址
    workTypes: [
      { name: '请选择人员规模', value: 1 },
      { name: '10-100', value: 2 },
      { name: '100-200', value: 3 },
      { name: '200-300', value: 4 },
    ],
    wordNumber: 0,
    workTypeIndex: 0,
    staffRange: [[], []],
    staffValue: [1, 1],
    companyInfo: {
      id:0,
      minStaff: 0,
      maxStaff: 1,
      brand: '',
      fullName: '',
      shortName: '',
      address: '',
      latitude: '',
      longitude: '',
      description: ''

    }
  },
  onLoad: function (e) {
    wx.setNavigationBarTitle({
      //title: wx.getStorageSync('mallName')
      title: '编辑公司信息'
    })
  this.setData({
    companyInfo:{
      id:e.id
    }
  })
    WXAPI.getCompanyDetailById(e.id).then(res => {
      if (res.code === 0) {
        console.log(res.data)
        this.setData({
          companyInfo:{
          id: res.data.id,
          fullName: res.data.fullName,
          shortName: res.data.shortName,
          brand: res.data.brand,
          address: res.data.address,
          minStaff: res.data.minStaff,
          maxStaff: res.data.maxStaff,
          description: res.data.description,
          latitude: res.data.latitude,
          longitude: res.data.longitude
          }

        })
      }

    })
    this.initSalaryRange();

  },

  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },

  onShareAppMessage: function () {
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + CONFIG.shareProfile,
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },

  toSearch: function () {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(this.data.activeCategoryId, true)
  },
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1
    });

    wx.stopPullDownRefresh()
  },
  // 以下为搜索框事件
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },



  /**
* 获取信息
*/
  getResumeInfoByRoute: function () {
    let _this = this;
    let param = {
      quickSpFansId: _this.data.fansId,
      route: 'jobpref',
    }
    network.post("/api.do", {
      method: "weiPinSp/getResumeInfoByRoute",
      param: JSON.stringify(param)
    }, function (res) {
      if (res.code == "0") {
        if (res.data.model.expectPlace) {
          _this.data.region = res.data.model.expectPlace.split(" ")
        }
        _this.setData({
          model: res.data.model,
          workTypeIndex: res.data.model.workType ? res.data.model.workType - 1 : 0,
          region: _this.data.region,
          salaryValue: [res.data.model.minSalary, res.data.model.maxSalary]
        })
      } else {
        utils.toggleToast(_this, res.message)
      }
    })
  },
  /**
   * input事件
   */
  operateInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          ['companyInfo.expectPosition']: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          ['companyInfo.expectPosition']: ''
        })
        break;
      default:
        break;
    }
  },
  fullNameInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          ['companyInfo.fullName']: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          ['companyInfo.fullName']: ''
        })
        break;
      default:
        break;
    }
  },
  brandInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          ['companyInfo.brand']: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          ['companyInfo.brand']: ''
        })
        break;
      default:
        break;
    }
  },
  shortNameInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          ['companyInfo.shortName']: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          ['companyInfo.shortName']: ''
        })
        break;
      default:
        break;
    }
  },
  adressInput: function (e) {
    let event = e.currentTarget.dataset.event
    switch (event) {
      case 'input':
        this.setData({
          ['companyInfo.address']: e.detail.value
        })
        break;
      case 'clear':
        this.setData({
          ['companyInfo.address']: ''
        })
        break;
      default:
        break;
    }

  },

  operateTextarea: function (e) {
    this.setData({
      ['companyInfo.description']: e.detail.value.trim(),
      wordNumber: e.detail.value.trim().length
    })
  },


  /**
   *  选择工作类型
   */
  bindWorkTypeChange: function (e) {
    console.log(typeof e.detail.value)
    this.setData({
      workTypeIndex: parseInt(e.detail.value),
      ['companyInfo.workType']: parseInt(e.detail.value) + 1
    })
  },
  /**
   * 选择地址
   */
  bindRegionChange: function (e) {
    //  e.detail.value.pop();   //删除县区项 
    this.setData({
      region: e.detail.value,
      ['companyInfo.expectPlace']: e.detail.value.join(" ")
    })
    //  console.log(this.data.region, this.data.model)
    console.log(this.data.region)
    // console.log(this.data.model)
  },
  /**
   * 选择薪资范围
   */
  bindSalaryChange: function (e) {
    let selectedVal = e.detail.value    //返回数组
    let employeesRange = this.data.employeesRange
    this.setData({
      salaryValue: selectedVal,
      ['companyInfo.minEmployeesSalary']: employeesRange[0][selectedVal[0]],
      ['companyInfo.maxEmployeesSalary']: employeesRange[1][selectedVal[1]],
    })
    console.log(this.data.salaryValue)
  },

  bindStaffChange: function (e) {
    let selectedVal = e.detail.value    //返回数组
    let staffRange = this.data.staffRange
    this.setData({
      staffValue: selectedVal,
      ['companyInfo.minStaff']: staffRange[0][selectedVal[0]],
      ['companyInfo.maxStaff']: staffRange[1][selectedVal[1]],
    })

  },


  /**
   *  初始化薪资数据
   */
  initSalaryRange: function () {
    let minTotal = 20, maxTotal = 100;
    for (let i = 1; i <= minTotal; i++) {
      this.data.staffRange[0].push(i * 10)
    }
    for (let j = 1; j <= maxTotal; j++) {
      this.data.staffRange[1].push(j * 10)
    }
    this.setData({
      staffRange: this.data.staffRange
    })
  },
  /**
   * 确保右边大于左边
   */
  columnchange: function (e) {
    console.log(e.detail)
    let detail = e.detail, sv = this.data.staffValue;
    if (detail.column === 0) {
      this.setData({
        ['staffValue[0]']: detail.value
      })
      if (detail.value > sv[1]) {
        this.setData({
          staffValue: [detail.value, detail.value]
        })
      }
    }
    if (detail.column === 1) {
      this.setData({
        ['staffValue[1]']: detail.value
      })
      if (sv[0] > detail.value) {
        this.setData({
          staffValue: [detail.value, detail.value]
        })
      }
    }
  },
  /**
  * 保存
  */
  save: function () {
    var _this = this
    //  console.log(_this.data)
    var companyInfo = {
      id:_this.data.companyInfo.id,
      fullName: _this.data.companyInfo.fullName,
      brand: _this.data.companyInfo.brand,
      shortName: _this.data.companyInfo.shortName,
      address: _this.data.companyInfo.address,
      longitude: _this.data.companyInfo.longitude,
      latitude: _this.data.companyInfo.latitude,
      description: _this.data.companyInfo.description,
      minStaff: _this.data.companyInfo.minStaff,
      maxStaff: _this.data.companyInfo.maxStaff
    }

    WXAPI.editCompanyInfo(companyInfo).then(res => {

      if (res.code === 0) {
        var code = res.data
        wx.navigateTo({
          url: "/pages/company-detail/company-detail?id=" + this.data.companyInfo.id
        })

        // wx.navigateTo({
        //   url: '/pages/company-detail/company-detail?code='+code,

        // })
        // that.setData({
        //   goodsRecommend: res.data
        // })
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

  getLocation: function () {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        // console.log(res)
        that.setData({
          ['companyInfo.address']: res.address,
          ['companyInfo.latitude']: res.latitude,
          ['companyInfo.longitude']: res.longitude
        })


        // success
        // console.log(res, "location")
        // console.log(res.name)
        // console.log(res.latitude)
        // console.log(res.longitude)
        // that.setData({
        //   roomname: res.name
        // })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  uploadLogo: function () {
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

  }

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }


})