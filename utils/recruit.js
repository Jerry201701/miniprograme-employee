const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function randomNumber() {
  var n = Math.random().toString(36).substr(2, 15)
  console, log(n)
  return n
}

const timestamp = parseInt(new Date().getTime() / 1000) + ''


const number = Math.random().toString(36).substr(2, 15)
const ramdonNumber = timestamp.concat(number)


module.exports = {
  formatTime: formatTime,
  randomNumber: randomNumber

}
