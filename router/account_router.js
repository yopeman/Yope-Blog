const express = require('express');
const UserController = require('../controller/user_controller')
const upload = require('./index');
const router = express.Router();
const userController = new UserController();

router.get('/signup', (req, res)=>{
    if (req.session.user) {
        return res.redirect('/account/logout'); // Redirect to logout if user is already logged in
    }
    res.render('signup')
})

router.post('/signup', userController.signup)

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/account/logout'); // Redirect to logout if user is already logged in
    }
    res.render('login')
})

router.post('/login', userController.login)

router.get('/logout', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/account/login'); // Redirect to login if user is not logged in
    }
    res.render('logout', { user: req.session.user });
});

router.post('/logout', userController.logout)

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/account/login'); // Redirect to login if user is not logged in
    }
    res.render('profile', { user: req.session.user, profiles: req.session.profiles || null });
    // res.json(req.session.user) // For testing purposes, return user data as JSON
})


router.get('/profile/edit', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/account/login'); // Redirect to login if user is not logged in
    }
    res.render('edit_profile', { user: req.session.user });    
})

router.post('/profile', upload.single('profilePicture'), userController.editProfile)


module.exports = router;