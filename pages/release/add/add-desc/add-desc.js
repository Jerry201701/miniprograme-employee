// pages/release/add/add-desc/add-desc.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    wordNumber: 0,
    jobDescription: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    operateTextarea: function (e) {
      this.setData({
        jobDescription: e.detail.value,
        wordNumber: e.detail.value.length
      })
    },
    saveDescription:function(){
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        jobDescription: this.data.jobDescription
      })
      wx.navigateBack()
      // wx.navigateTo({
      //   url: '../add?jobDescription=' + this.data.jobDescription
      // })
    }

  }
})
