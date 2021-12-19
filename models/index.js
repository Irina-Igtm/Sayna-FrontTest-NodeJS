const dbConfig = require("../config/config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.database.url)

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// variables call models
db.users = require("./user").Users(Sequelize, sequelize)

module.exports = db;