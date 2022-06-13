import express from 'express'
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
import session from 'express-session'
import {games, gameModes, genres, developers, platforms, reviews, users, search} from './resources'
import cors from 'cors'
import {checkLogin} from "./resources/users";

const api = express()

api.use(express.json());
api.use(express.urlencoded({ extended: true }));




const ONE_HOUR = 1000 * 60 * 60

api.use(session({
  name: process.env.SESS_NAME || "dev",
  resave: false,
  saveUninitialized: false,
  secret: "secret",
  cookie: {
    maxAge: ONE_HOUR,
    sameSite: true,
    secure: process.env.NODE_ENV === "production"
  }
}))

/**
  * CORS
  */
api.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
  credentials: true
}));


/**
 * Serve static content from public directory for images
 */
api.use(express.static("public"));

/**
 * Send greetings to API Client
 */
api.get('/api/', (req, res) => res.send({
  status: "success",
  data: {},
  message: "Welcome to API for CSHD"
}));

api.post('/api/search', search)

api.post('/api/games', games.list)
api.get('/api/games/:id', games.getOne)

api.get('/api/gameModes', gameModes.list)
api.get('/api/gameModes/:id', gameModes.getOne)

api.get('/api/genres', genres.list)
api.get('/api/genres/:id', genres.getOne)

api.get('/api/developers', developers.list)
api.get('/api/developers/:id', developers.getOne)

api.get('/api/platforms', platforms.list)
api.get('/api/platforms/:id', platforms.getOne)

//api.get('/api/reviews', reviews.list)
api.get('/api/reviews/:id', reviews.getOne)
api.post('/api/reviews', checkLogin, reviews.store)
api.put('/api/reviews/:id', checkLogin, reviews.update)
api.delete('/api/reviews/:id', checkLogin, reviews.remove)

//api.get('/api/users', users.list)
api.get('/api/users/:id', users.getOne)
api.post('/api/login', users.login)
api.post('/api/users', users.store)
api.put('/api/users/:id', checkLogin, users.update)
api.delete('/api/logout', checkLogin, users.logout)
api.get('/api/loggedUser', checkLogin, users.loggedUser)

/**
 * Start listening on connections
 */
const port = process.env.PORT || 4000
api.listen(port, () => console.log(`App listening on port ${port}`))
