const Comment = require('../models/comment_model');

class CommentController {
    async createComment(req, res) {
        try {
            const content = req.body.content; // Get comment content from request body
            if (!content) {
                return res.status(400).json({ error: 'Comment content is required' });
            }
            const author = req.session.user.id; // Assuming the user ID is stored in the session
            const postId = req.params.id; // Get postId from request parameters
            const comment = await Comment.create({ content, postId, author });
            res.redirect(`/post/${postId}`); // Redirect to the post page after creating the comment
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({ error: 'Failed to create comment' });
        }
    }

    async getCommentsByPostId(req, res) {
        try {
            const postId = req.params.id;
            const comments = await Comment.findAll({ where: { postId } });
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            res.status(500).json({ error: 'Failed to fetch comments' });
        }
    }
}

module.exports = CommentController;