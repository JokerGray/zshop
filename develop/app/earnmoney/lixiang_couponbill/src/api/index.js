const ajax = require('@fdaciuk/ajax')
var request = ajax({
  headers: {
    apikey: sessionStorage.getItem('apikey') || 'test'
  }
})
const URL = process.env.NODE_ENV === 'production' ? '/zxcity_restful/ws/rest' : 'api'

export default {
  getshareProfitList (shareUserId, selectDate, dayType, page) {
    let selectType = dayType === 'day' || dayType === 'yesterday' ? 1 : 2
    let dayNumber = dayType === 'day' ? 0 : dayType === 'yesterday' ? -1 : dayType === 'week' ? 7 : 30
    let data = {
      cmd: 'earnmoney/getshareProfitList',
      version: 2,
      data: `{
        shareUserId: ${shareUserId},
        selectBusiness: 3,
        pagination: {page: ${page}, rows: 10},
        selectDate: '${selectDate}',
        selectType: '${selectType}',
        dayNumber: '${dayNumber}'
      }`
    }
    return request.post(URL + '/', data)
  },
  getShareReportForUser (shareUserId, selectDate, dayType) {
    let selectType = dayType === 'day' || dayType === 'yesterday' ? 1 : 2
    let dayNumber = dayType === 'day' ? 0 : dayType === 'yesterday' ? -1 : dayType === 'week' ? 7 : 30
    let data = {
      cmd: 'earnmoney/getShareReportForUser',
      version: 2,
      data: `{
        shareUserId: '${shareUserId}',
        selectBusiness: 3,
        selectDate: '${selectDate}',
        selectType: '${selectType}',
        dayNumber: '${dayNumber}'
      }`
    }
    return request.post(URL + '/', data)
  }
}
