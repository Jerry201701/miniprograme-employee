const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp()
var ws
Page({
  data: {
    newslist: [],
    replyList:[],
    userInfo: {},
    scrollTop: 0,
    increase: false,//图片添加区域隐藏
    aniStyle: true,//动画效果
    message: "",
    previewImgList: [],
    notice: 'ssss',
    sender:'热菜厨师',
    receiver:'餐饮公司',
    self:false,
    jobId:1

  },
  onLoad: function (e) {
    console.log(e)
    const that = this;
    const applicantId = wx.getStorageSync('applicantId');
    var chatId=''
    if(e.jobId){
    chatId='A'.concat(applicantId).concat('J').concat(e.jobId)
    console.log(chatId)
    }else{
      chatId = 'A'.concat(applicantId).concat('J').concat(that.data.jobId)
      console.log(chatId)
    }

    
  
    that.setData({
      messageType:e.messageType,
      jobId:e.jobId,
      applicantId: applicantId
    })

    // WXAPI.getChatSenderAndReceiver(e.jobId,applicantId).then(res=>{
    //   console.log(res.data)
    // })

  //  WXAPI.showChatJobInfo(e.jobId).then(res => {
    WXAPI.getChatSenderAndReceiver(e.jobId,applicantId).then(res => {
      var arr = res.data.certificates.split(',')
      var address = res.data.address
      var one = address.indexOf('省')
      var two = address.indexOf('市')
      var three = address.indexOf('区')
      var city = address.substring(one + 1, two)
      var district = address.substring(two + 1, three + 1)
      that.setData({
      //  messageId:res.data.id,
        jobName: res.data.jobName,
        companyId: res.data.companyId,
        educationLevel: res.data.educationLevel,
        jobDescription: res.data.jobDescription,
        salaryRange: res.data.salaryRange,
        workExperience: res.data.workExperience,
        city: city,
        district: district,
        certificateList: arr,
        companyName:res.data.companyName,
        companyLogo:res.data.companyLogo,
        applicantName:res.data.applicantName,
        headUrl:res.data.headUrl,
        minWorkYears: res.data.minWorkYears,
        maxWorkYears: res.data.maxWorkYears
      })
     
      ws = wx.connectSocket({
        //url: 'ws://localhost:8004/ws?id=A' + applicantId,
        url: 'wss://wei.scsflr.com/ws?id=A' + applicantId,
       // url: 'wss://recruit.xcalculas.cn/ws?id=A' + applicantId,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
        },
        //  protocols: ['protocol1']
      })
      wx.onSocketOpen((res) => {
        console.log('WebSocket 成功连接', res)
        wx.onSocketMessage(function (res) {
          console.log("收到服务器内容：" + res.data)
          const message = JSON.parse(res.data)
          var list = []
          list = that.data.newslist
          list.push(message)
          that.setData({
            newslist: list
          })

          if (message.messageType===4) {
            WXAPI.recordChatMessage({
              messageId: that.data.messageId,
              messageContent: that.data.message,
              companyId: that.data.companyId,
              applicantId: that.data.applicantId,
              jobId: that.data.jobId,
              messageType: 4,
              unread: message.unread
            }).then(res => {
              that.setData({
                messageId: res.data
              })
            })
          }

        })
      })
     
      wx.onSocketError((err) => {
        console.log('websocket连接失败', err);
      })
   

    })
  
   
    WXAPI.listChatMessage({
      applicantId:applicantId,
      companyId:e.companyId,
      messageType:e.messageType,
      jobId:e.jobId
    }).then(res => {
      console.log(res.data)
      that.setData({
        newslist: res.data
      })
    })

    wx.setNavigationBarTitle({
      title: '聊天'
    })
  
   
  },

  onHide: function () {
    // 生命周期函数--监听页面隐藏
    console.log('页面隐藏')
   
    console.log("onHide");
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
     console.log("onUnload");
    // WXAPI.changeMessageStatus(this.data.messageId).then(res => {

    //   if (res.code === 200) {

    //   }
    // })
    wx.closeSocket()
  },

  onShow: function () {
    const applicantId=wx.getStorageSync('applicantId');
    this.setData({
      applicantId:applicantId

    })



  },



  onShareAppMessage: function () {
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + CONFIG.shareProfile,
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },

  //事件处理函数
  send: function () {
    var flag = this

    if (this.data.message.trim() == "") {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      })
    } else {
      setTimeout(function () {
        flag.setData({
          increase: false
        })
      }, 500)
   
      var msg = '{ "companyId": "' + flag.data.companyId + '", "applicantId": "' + flag.data.applicantId + '", "messageContent": "' + flag.data.message + '", "messageType": "' + 4 + '" }'
      // var msg = '{ "senderId": "' + flag.data.applicantId + '", "receiverId": "' + flag.data.companyId + '", "messageContent": "' + flag.data.message + '" }'
      wx.sendSocketMessage({
        data: msg,
        success(res) {
        },
        fail(res) {
          var messageArray=[]
          messageArray = flag.data.newslist
          messageArray.push(JSON.parse(msg))
          flag.setData({
            newslist: messageArray
          })
          console.log('发送失败！！！')
        }
      })
      this.bottom()
    }
  },
  //监听input值的改变
  bindChange(res) {
    this.setData({
      message: res.detail.value
    })
  },
  cleanInput() {
    //button会自动清空，所以不能再次清空而是应该给他设置目前的input值
    this.setData({
      message: this.data.message
    })
  },
  increase() {
    this.setData({
      increase: true,
      aniStyle: true
    })
  },
  //点击空白隐藏message下选框
  outbtn() {
    this.setData({
      increase: false,
      aniStyle: true
    })
  },
  chooseImage() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        wx.uploadFile({
          url: 'http://192.168.137.91/index/index/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          headers: {
            'Content-Type': 'form-data'
          },
          success: function (res) {
            if (res.data) {
              that.setData({
                increase: false
              })
              /*
              websocket.send('{"images":"' + res.data + '","date":"' + utils.formatTime(new Date()) + '","type":"image","nickName":"' + that.data.userInfo.nickName + '","avatarUrl":"' + that.data.userInfo.avatarUrl + '"}')
              */
              that.bottom()
            }
          }
        })

      }
    })
  },
  //图片预览
  previewImg(e) {
    var that = this
    //必须给对应的wxml的image标签设置data-set=“图片路径”，否则接收不到
    var res = e.target.dataset.src
    var list = this.data.previewImgList //页面的图片集合数组

    //判断res在数组中是否存在，不存在则push到数组中, -1表示res不存在
    if (list.indexOf(res) == -1) {
      this.data.previewImgList.push(res)
    }
    wx.previewImage({
      current: res, // 当前显示图片的http链接
      urls: that.data.previewImgList // 需要预览的图片http链接列表
    })

  },
  //聊天消息始终显示最底端
  bottom: function () {
    var query = wx.createSelectorQuery()
    query.select('#flag').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      wx.pageScrollTo({
        scrollTop: res[0].bottom  // #the-id节点的下边界坐标  
      })
      res[1].scrollTop // 显示区域的竖直滚动位置  
    })
  },
  test: function () {
    console.log('1111')

    this.data.newslist.push('aaa')
    // this.setData({
    //   notice:'www'
    // })

  },

  chatHistoryRecord:function(){
    WXAPI.showChatRecordHistory({
      companyId: this.data.companyId,
      applicantId: this.data.applicantId,
      jobId: this.data.jobId
    }).then(res => {
      this.setData({
        newslist: res.data
      })
    })


  }





})