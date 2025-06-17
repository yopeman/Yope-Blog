const { sequelize, DataTypes } = require('./index');
const User = require('./user_model'); // Assuming you have a User model defined
const Post = require('./post_model'); // Assuming you have a Post model defined

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: 'id'
        }
    },
    author: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: User,
            key: 'id'
        },
    }
});

Comment.belongsTo(User, { foreignKey: 'author' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

sequelize.sync()
    .then(() => {
        console.log('Comment table created successfully.');
    })
    .catch((error) => {
        console.error('Error creating Comment table:', error);
    });

module.exports = Comment;
