const Post = require('../models/post_model');
const Comment = require('../models/comment_model');
const User = require('../models/user_model'); // Assuming you have a User model defined
const Profile = require('../models/profile_model'); // Assuming you have a Profile model defined
const { Op } = require('sequelize');

class PostController{
    async createPost(req, res){
        try {
            const { title, content, tag } = req.body;
            const imageUrl = req.file ? '/images/' + req.file.filename : null; // Assuming you're using multer for file uploads
            const author = req.session.user.id; // Assuming user ID is stored in session

            const post = await Post.create({
                title: title,
                content: content,
                imageUrl: imageUrl,
                author: author,
                tag: tag
            })
            post.save();
            res.redirect('/post'); // Redirect to the post list or detail page after successful creation
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(400).json(error);
        }
    }

    async getAllPosts(req, res) {
        try {
            const { offset = 0, limit } = req.query; // Default to 10 posts per page
            const posts = await Post.findAll({
                offset: parseInt(offset),
                ...(limit && { limit: parseInt(limit) }),
                order: [['createdAt', 'DESC']], // Order by creation date, newest first
            });
            // res.status(200).json(posts);
            res.render('list_post', { posts: posts, query: req.query.query || '' }); // Render search results
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(400).json(error);
        }
    }

    async getPostById(req, res) {
        try {
            const postId = req.params.id;
            const post = await Post.findByPk(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            const comments = await Comment.findAll({
                where: { postId: postId },
                include: [{ model: User, attributes: ['username'] }], // Assuming you want to include the author's username
                order: [['createdAt', 'DESC']] // Order comments by creation date, newest first
            });

            const author = await User.findByPk(post.author); // Fetch the author's details
            const profiles = await Profile.findAll({ where: { userId: author.id } });

            res.render('view_post', { post: post, comments: comments, author: author, profiles: profiles }); // Render the post with its comments
        } catch (error) {
            console.error("Error fetching post:", error);
            res.status(400).json(error);
        }
    }

    async updatePost(req, res) {
        try {
            const postId = req.params.id;
            const { title, content, tag } = req.body;
            const imageUrl = req.file ? '/images/' + req.file.filename : null; // Assuming you're using multer for file uploads

            const post = await Post.findByPk(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            post.title = title || post.title;
            post.content = content || post.content;
            post.imageUrl = imageUrl || post.imageUrl;
            post.tag = tag || post.tag;

            await post.save();
            res.status(200).json(post);
        } catch (error) {
            console.error("Error updating post:", error);
            res.status(400).json(error);
        }
    }

    async deletePost(req, res) {
        try {
            const postId = req.params.id;
            const post = await Post.findByPk(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            await post.destroy();
            res.redirect('/post'); // Redirect to the post list after successful deletion
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(400).json(error);
        }
    }

    async getPostsByUser(req, res) {
        try {
            const userId = req.session.user.id; // Assuming user ID is stored in session
            const posts = await Post.findAll({
                where: { author: userId },
                order: [['createdAt', 'DESC']], // Order by creation date, newest first
            });
            res.status(200).json(posts);
        } catch (error) {
            console.error("Error fetching user's posts:", error);
            res.status(400).json(error);
        }
    }

    async getPostsByTag(req, res) {
        try {
            const tag = req.params.tag;
            const posts = await Post.findAll({
                where: { tag: tag },
                order: [['createdAt', 'DESC']], // Order by creation date, newest first
            });
            res.status(200).json(posts);
        } catch (error) {
            console.error("Error fetching posts by tag:", error);
            res.status(400).json(error);
        }
    }

    async getPostsByTitle(req, res) {
        try {
            const title = req.params.title;
            const posts = await Post.findAll({
                where: { title: title },
                order: [['createdAt', 'DESC']], // Order by creation date, newest first
            });
            res.status(200).json(posts);
        } catch (error) {
            console.error("Error fetching posts by title:", error);
            res.status(400).json(error);
        }
    }

    async searchPosts(req, res) {
        try {
            let query = req.query.query || ''; // Assuming the search term is passed as a query parameter

            query = query.trim(); // Trim whitespace from the search term
            query = query.replace(/[,]/g, '%'); // Remove commas and replace with percent sign for SQL LIKE

            const posts = await Post.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${query}%` } },
                        { content: { [Op.like]: `%${query}%` } },
                        { tag: { [Op.like]: `%${query}%` } }
                    ]
                },
                order: [['createdAt', 'DESC']], // Order by creation date, newest first
            });
            res.render('list_post', { posts: posts, query: query }); // Render search results
        } catch (error) {
            console.error("Error searching posts:", error);
            res.status(400).json(error);
        }
    }

    async getPostByIdForEdit(req, res) {
        try {
            const postId = req.params.id;
            const post = await Post.findByPk(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            res.render('edit_post', { post: post }); // Render a form for editing the post
        } catch (error) {
            console.error("Error fetching post for edit:", error);
            res.status(400).json(error);
        }
    }
}

module.exports = PostController;
