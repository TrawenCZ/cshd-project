import express from 'express'
import { games, gameModes, genres, developers, platforms, reviews, users } from './resources'

const api = express()

/**
 * Make express parse JSON in body and parse url encoded strings
 */
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

/**
 * Serve static content from public directory for images
 */
api.use(express.static("public"));

/**
 * Send greetings to API Client
 */
api.get('/', (req, res) => res.send({
  status: "success",
  data: {},
  message: "Welcome to API for CSHD"
}));

/**
 * Resource games
 */
api.get('/api/games', games.list);
api.post('/api/games', games.store);


/**
 * Resource gameModes
 */
api.get('/api/gameModes', gameModes.list)
api.get('/api/gameModes/:id', gameModes.getOne)

/**
 * Start listening on connections
 */
const port = process.env.PORT || 3000
api.listen(port, () => console.log(`App listening on port ${port}`))
