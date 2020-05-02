const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const app = getApp()

Page({
  data: {
    select: false,
    tihuoWay: '全部',
    positions: true,
    jobName:'输入职位名称',
    wordNumber:0,
    content: [],
    px: ['最新发布', '推荐排序', '租金由低到高', '租金由高到低', '面积由小到大', '面积由大到小'], //排序列表内容
    qyopen: false, //点击地铁区域筛选滑动弹窗显示效果，默认不显示
    qyshow: true, //用户点击闭关区域的弹窗设置，默认不显示
    nzopen: false, //价格筛选弹窗
    pxopen: false, //排序筛选弹窗
    nzshow: true,
    pxshow: true,
    isfull: false,
   //获取地铁区域的下拉框筛选项内容
    citycenter: {}, //选择地铁区域左边筛选框后的显示的中间内容部分
    cityright: {}, //选择地铁区域的中间内容部分后显示的右边内容
    select1: '地铁', //地铁区域选中后的第二个子菜单，默认显示地铁下的子菜单
    select2: '', //地铁区域选择部分的中间
    select3: '', //地铁区域选择部分的右边
    shownavindex: '',
    // 价格筛选框设置
    leftMin: 0,
    leftMax: 10000, //左边滑块最大值
    rightMin: 0, //右边滑块的最小值
    rightMax: 10000, //右边滑块最大值
    leftValue: 1000, //左边滑块默认值
    rightValue: 6000, //右边滑块默认值
    leftPer: '50', //左边滑块可滑动长度：百分比
    rightPer: '50', //右边滑块可滑动长度
    pxIndex: 0, //排序内容下拉框，默认第一个


  },
  onShow() {
     const _this = this
    WXAPI.findJobCategoryTree(0).then(res=>{
      _this.setData({
        cityleft:res.data
      })
    })
  },

  bindTypeTap: function (e) {
    this.setData({
      selectCurrent: e.index
    })
  },

  onLoad: function (e) {
 this.setData({
   jobName:e.jobName
 })
    wx.setNavigationBarTitle({
      title: "岗位名称"
    })
  },

  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
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
    wx.redirectTo({
      url: '../add/add',
    })
  },
  /**
 * 文本域input事件
 */
  operateInput: function (e) {
   // console.log(e)
    this.setData({
      jobName: e.detail.value,
      wordNumber: e.detail.value.length
    })
  },


  listqy: function (e) {
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        nzopen: false,
        pxopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        qyopen: true,
        pxopen: false,
        nzopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }

  },
  // 价格下拉框是否隐藏
  list: function (e) {
    if (this.data.nzopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        content: this.data.nv,
        nzopen: true,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: true,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  // 排序下拉框是否隐藏
  listpx: function (e) {
    if (this.data.pxopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        content: this.data.px,
        nzopen: false,
        pxopen: true,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
   
  },
  // 地铁区域第一栏选择内容
  selectleft: function (e) {
    const parentId=e.currentTarget.dataset.id
    WXAPI.findJobCategoryTree(parentId).then(res => {
      this.setData({
        cityright: {},
        citycenter: res.data,
        select1: parentId,
        select2: ''
      })
    })
   
  },


  selectcenter: function (e) {
    const parentId = e.currentTarget.dataset.id
    WXAPI.findJobCategoryTree(parentId).then(res => {
      this.setData({
        cityright: res.data,
        select2: parentId
      })
    })
   
  },

 
  selectright: function (e) {
    this.setData({
      select3: e.currentTarget.dataset.id,
      categoryName: e.currentTarget.dataset.category,
      categoryId: e.currentTarget.dataset.id
    });

  },
  // 点击灰色背景隐藏所有的筛选内容
  hidebg: function (e) {
    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0,
    })
  },
  // 地铁区域清空筛选项
  quyuEmpty: function () {
    this.setData({
      select1: '',
      select2: '',
      select3: '-1'
    })
  },
  // 地铁区域选择筛选项后，点击提交
  submitFilter: function () {
    var pages=getCurrentPages()
    console.log(pages.length)
   // var pages = getCurrentPages();
   // console.log(pages)
    var currPage = pages[pages.length - 2];   //当前页面
  //  var prevPage = pages[pages.length - 2];  //上一个页面
    currPage.setData({
      expectPosition: this.data.categoryName
    })
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateBack()

  },
  // 左边滑块滑动的值
  leftSchange: function (e) {
    console.log('左边改变的值为：' + e.detail.value);
    let currentValue = parseInt(e.detail.value);
    let currentPer = parseInt(currentValue)
    var that = this;
    that.setData({
      leftValue: e.detail.value //设置左边当前值
    })
  },
  // 右边滑块滑动的值
  rightSchange: function (e) {
    
    let currentValue = parseInt(e.detail.value);
    var that = this;
    that.setData({
      rightValue: e.detail.value,
    })
  },
  // 价格筛选框重置内容
  PriceEmpty: function () {
    this.setData({
      leftValue: 1000, //左边滑块默认值
      rightValue: 6000, //右边滑块默认值
    })
  },
  // 价格筛选框提交内容
  submitPrice: function () {
    // 隐藏价格下拉框选项
    this.setData({
      nzopen: false,
      pxopen: false,
      qyopen: false,
      nzshow: false,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    })
  },
  // 排序内容下拉框筛选
  selectPX: function (e) {
 
    this.setData({
      pxIndex: e.currentTarget.dataset.index,
      nzopen: false,
      pxopen: false,
      qyopen: false,
      nzshow: true,
      pxshow: false,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    });
  
  },


})