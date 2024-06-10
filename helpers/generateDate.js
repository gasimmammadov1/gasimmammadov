const moment = require('moment'); // tarixleri istediyimiz formada gostermek ucun

module.exports = { 
    generateDate : (date, format) => {
      return moment(date).format(format)
    }
  }