const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
    host: "localhost",
    port: 3306,
    database: "blog_app",
    dialect: "mysql",
    username: "root",
    password: "12345678",
})

module.exports = {
    sequelize,
    DataTypes,
};