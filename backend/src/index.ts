import express from 'express'
import {games, gameModes, genres, developers, platforms, reviews, users, search} from './resources'
import cors from 'cors'

const api = express()

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

/**
  * CORS
  */
api.use(cors());

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

api.get('/api/reviews', reviews.list)
api.get('/api/reviews/:id', reviews.getOne)
api.post('/api/reviews', reviews.store)
api.put('/api/reviews/:id', reviews.update)
api.delete('/api/reviews/:id', reviews.remove)

//api.get('/api/users', users.list)
api.post('/api/login', users.login)
api.get('/api/users/:id', users.getOne)
api.post('/api/users', users.store)
api.put('/api/users/:id', users.update)

/**
 * Start listening on connections
 */
const port = process.env.PORT || 4000
api.listen(port, () => console.log(`App listening on port ${port}`))
