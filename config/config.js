require('dotenv').config();
const data = {
    database: {
        url: 'mongodb://192.168.43.172:27017/base_test'
      },
      port: process.env.SERVER_PORT || 3000
}

module.exports = data