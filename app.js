const express = require('express')
const session = require('express-session')
const UserController = require('./controller/user_controller')
const MySQLStore = require('express-mysql-session')(session)
const FileStore = require('session-file-store')(session)
const path = require('path');
const user_route = require('./router/account_router');
const post_route = require('./router/post_router');

require('dotenv').config();
const app = express()
const port = process.env.APP_PORT || 3000

app.use(express.static(path.join(__dirname, './public')))
app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    // store: new MySQLStore({
    //     host: process.env.DB_HOST,
    //     port: process.env.DB_PORT,
    //     user: process.env.DB_USER,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_NAME,
    //     expiration: 1000 * 60 * 60 * 24 * 30 // 30 days
    // }), // Configure MySQL session store
    // store: new FileStore({}),
    store: new session.MemoryStore(), // Use in-memory store for simplicity
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 } // 30 days
}))

app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Blog App [${req.session.user ? req.session.user.username : 'Guest'}]</h1>
        <p><a href="/account/signup">Sign Up</a></p>
        <p><a href="/account/login">Login</a></p>
        <p><a href="/account/logout">Logout</a></p>
        <p><a href="/account/profile">Profile</a></p><br>

        <p><a href="/post">Post</a></p>
    `)
})

app.use('/account', user_route)
app.use('/post', post_route)

app.listen(port, () => console.log(`http://localhost:${port}/`))