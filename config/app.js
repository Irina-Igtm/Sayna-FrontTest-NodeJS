require('dotenv').config();


config = {

    database: {
        url: 'mongodb://192.168.43.172:27017/base_test'
      },
    // App env
    env: process.env.NODE_ENV,

    // App debug mode
    debug: process.env.DEBUG ? process.env.DEBUG === 'true' : true,

    // App secret for password encoding
    appSecret: process.env.APP_SECRET || "itsverysecret",

    // Server port
    port: process.env.SERVER_PORT || 3000,

    // JWT secret
    jwtSecret: process.env.JWT_SECRET || "itsverysecret",

    // JWT expire time in seconds
    jwtExpire: parseInt(process.env.JWT_EXPIRE, 10) || 3600,

    // url utiliser
    baseUrl: process.env.APP_ENDPOINT || 'http://localhost:3000/',

}

module.exports = config;