const { sequelize, DataTypes } = require('./index');
const User = require('./user_model'); // Assuming you have a User model defined

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    author: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'posts',
    timestamps: true // Automatically adds createdAt and updatedAt fields
    
});

module.exports = Post;