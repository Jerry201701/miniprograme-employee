// 小程序开发api接口工具包，https://github.com/gooking/wxapi
const CONFIG = require('./config.js')
//const API_BASE_URL = 'http://localhost:9001'


const request = (url, needSubDomain, method, data) => {
  let _url = API_BASE_URL + (needSubDomain ? '/' + CONFIG.subDomain : '') + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

const http = (url, needSubDomain, method, data) => {
  let _url = API_BASE_URL  + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  queryMobileLocation: (data) => {
    return request('/common/mobile-segment/location', false, 'get', data)
  },
  queryConfigBatch: (keys) => {
    return request('/config/values', true, 'get', { keys })
  },
  
  login: (code) => {
    return request('/user/wxapp/login', true, 'post', {
      code,
      type: 2
    })
  },

 
  uploadFile: (token, tempFilePath) => {
    const uploadUrl = API_BASE_URL + '/' + CONFIG.subDomain + '/dfs/upload/file'
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: uploadUrl,
        filePath: tempFilePath,
        name: 'upfile',
        formData: {
          'token': token
        },
        success(res) {
          resolve(JSON.parse(res.data))
        },
        fail(error) {
          reject(error)
        },
        complete(aaa) {
          // 加载完成
        }
      })
    })
  },
  refundApply: (token, orderId, type, logisticsStatus, reason, amount, remark, pic) => {
    return request('/order/refundApply/apply', true, 'post', {
      token,
      orderId,
      type,
      logisticsStatus,
      reason,
      amount,
      remark,
      pic
    })
  },
  saveCompanyInfo: (data) => {
    return http('/company/save', false, 'post', data)
  },
  editCompanyInfo:(data)=>{
    return http('/company/update', false, 'post', data)
  },
  saveUserInfo: (data) => {
    return http('/job/register', false, 'post', data)
  },
  editJobInfo: (data) => {
    return http('/job/info/update', false, 'post', data)
  },
  decodePhoneNumber:(data)=>{
    return http('/wei/decode/phone',false,'post',data)
  },
  saveJobInfo:(data)=>{
    return http('/job/info/save', false, 'post', data)
  },
  showAllJobs:()=>{
    return request('/job/info/applicant/jobs', false, 'get')
  },
  getCompanyDetail:(code)=>{
    return request('/company/get/detail',false,'get',{
      code
    })
  },

  getCompanyDetailById:(id)=>{
    return request('/company/detail/by/id',false,'get',{
      id
    })
  },


  weiFirstLoad:(code)=>{
    return request('/wei/employee',false,'get',{
      code
    })
  },

  raleaseJobDetail:(id,openid)=>{
    return request('/job/info/detail/applicant',false,'get',{
      id,
      openid
    })
  },
  saveApplicantInfo: (data) => {
    return http('/applicant/save', false, 'post', data)
  },

  getOneByOpenId: (openId) => {
    return http('/applicant/detail/open', false, 'get', {
      openId
    })
  },
  showApplicantDetail: (id) =>{
    return http('/applicant/show/detail', false, 'get', {
      id
    })
  },


  getOneById: (id) => {
    return http('/applicant/get/detail/id', false, 'get', {
      id
    })
  },

  findBasicByOpenid: (openid) => {
    return http('/applicant/find/basic', false, 'get', {
      openid
    })
  },


  getWorkExperienceById: (id) => {
    return http('/work/get/one', false, 'get', {
      id
    })
  },

  getEducationExperienceById: (id) => {
    return http('/education/get/one', false, 'get', {
      id
    })
  },


  editApplicantById: (data) => {
    return http('/applicant/update', false, 'post', data)
  },

  saveWorkExperience: (data) => {
    return http('/work/add', false, 'post', data)
  },

  saveEducationExperience: (data) => {
    return http('/education/add', false, 'post', data)
  },

  editWorkExperience: (data) => {
    return http('/work/update', false, 'post', data)
  },

  editEducationExperience: (data) => {
    return http('/education/update', false, 'post', data)
  },

  moveWorkExperience: (id) => {
    return http('/work/move', false, 'get', {
      id
    })
  },

  moveEducationExperience: (id) => {
    return http('/education/move', false, 'get', {
        id
    })
  },
  listAllCompany:()=>{
    return request('/company/list',false,'get')
  },
  deliveryResume:(data)=>{
    return http('/applicant/delivery/resume',false,'post',data)
  },
  getResumeByCompany:(companyId)=>{
    return request('/applicant/show/resume',false,'get',{
      companyId
    })
  },
  interviewResult: (data) => {
    return http('/job/info/interview', false, 'post', data)
  },
  handleBathcInterview: (data) => {
    return http('/job/info/batch/handle', false, 'post', data)
  },
  getUnionId: (data)=>{
    return http('/job/union/id',false,'post',data)
  },
  showChatJobInfo: (jobId) => {
    return http('/applicant/find/job/detail', false, 'get', { jobId })
  },
  listMessageByReceiver: (receiverId) => {
    return http('/applicant/list/message', false, 'get', {receiverId})
  },
  countUnreadMessage: (openid) => {
    return http('/applicant/count/unread', false, 'get', {openid})
  },
  changeMessageStatus: (messageId) => {
    return http('/applicant/message/status', false, 'get', {messageId})
  },
  recordChatMessage: (data) => {
    return http('/applicant/chat/record', false, 'post', data)
  },

  findChatRecord: (receiverId) => {
    return http('/applicant/find/chat/record', false, 'get', {receiverId})
  },
  listChatMessage: (data) => {
    return http('/applicant/chat/message/list', false, 'post', data)
  },
  showChatRecordHistory: (data)=>{
    return http('/applicant/chat/history', false, 'post', data)
  },
  
  getApplicantIdByOpenid: (openid)=>{
    return http('/applicant/get/applicant/openid', false, 'get', {openid})
  },
  
  getUserIdByOpenid: (openid)=>{
    return http('/applicant/user/find/openid', false, 'get', {openid})
  },
  findJobCategoryTree: (parentId) => {
    return http('/company/tree/job/category', false, 'get', { parentId })
  },
  listPostByApplicant:(applicantId)=>{
    return http('/job/info/list/by/applicant', false, 'get', { applicantId })
  },
  getChatSenderAndReceiver:(jobId,applicantId)=>{

    return http('/applicant/sender/receiver', false, 'get', { jobId,applicantId })

  },
  listChatCompanyBasic:(companyId)=>{

    return http('/applicant/company/basic', false, 'get', {companyId})
  },
  searchJobByConditions:(data)=>{
    return http('/applicant/job/list', false, 'post', data)

  },
  regionList:()=>{
    return http('/applicant/region/list', false, 'get', {})
  }
 


  // weiLoad:(data)=>{
  //   return wx.request({
  //     url: '/job/wei/load',
  //     data: data,
  //     header: {},
  //     method: 'GET',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: function(res) {},
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  // }
}