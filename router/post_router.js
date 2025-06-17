const express = require('express');
const router = express.Router();
const PostController = require('../controller/post_controller');
const CommentController = require('../controller/comment_controller');
const upload = require('./index');
const postController = new PostController();
const commentController = new CommentController();

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/account/login');
}

router.get('/', postController.getAllPosts); // verified
router.get('/create', isAuthenticated, (req, res) => {
    res.render('new_post'); // Render a form for creating a new post
});

router.get('/search', postController.searchPosts);
router.post('/', isAuthenticated, upload.single('image'), postController.createPost); // verified
router.get('/:id', postController.getPostById); // verified
router.get('/edit/:id', isAuthenticated, postController.getPostByIdForEdit); // verified
router.post('/edit/:id', isAuthenticated, upload.single('image'), postController.updatePost); // verified
router.get('/delete/:id', isAuthenticated, postController.deletePost); // verified
router.get('/user/:id', postController.getPostsByUser);
router.get('/tag/:tag', postController.getPostsByTag);
router.get('/title/:title', postController.getPostsByTitle);
router.post('/comment/:id', isAuthenticated, commentController.createComment);

module.exports = router;