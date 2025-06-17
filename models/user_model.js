const { sequelize, DataTypes } = require("./index.js"); 

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: {
                args: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                msg: "Must be a valid email"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 64],
                msg: "Password must be between 8 and 64 characters"
            },
            is: {
                args: /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\-]+$/,
                msg: "Password can only contain alphanumeric characters and special symbols"
            }
        }
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 1000],
                msg: "Bio must be at most 1000 characters"
            }
        }
    },
    status: {
        type: DataTypes.ENUM("active", "inactive", "suspended"),
        defaultValue: "active",
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});

sequelize.sync()
    .then(() => console.log("User tables created successfully."))
    .catch((error) => console.error("Error creating tables:", error));

module.exports =  User;

