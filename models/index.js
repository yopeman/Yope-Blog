const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || "blog_app",
    dialect: process.env.DB_DIALECT || "mysql",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "12345678",
})

sequelize.sync()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Unable to connect to the database:", err));  

module.exports = {
    sequelize,
    DataTypes,
};