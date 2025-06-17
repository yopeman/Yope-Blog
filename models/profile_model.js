const { sequelize, DataTypes } = require("./index.js");
const User = require('./user_model.js') // Assuming user_model.js exports the User model

const Profile = sequelize.define("Profile", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
            model: User,
            key: "id"
        },
        allowNull: false,
        onDelete: "CASCADE", // If a user is deleted, their profile will also be deleted
    },
    profilePictureUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

sequelize.sync()
    .then(() => {
        console.log("Profile table created successfully.");
    })
    .catch((error) => {
        console.error("Error creating Profile table:", error);
    });

module.exports = Profile;
