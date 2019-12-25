const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const users = require('./controllers/users')

// connecting to postgres using knex
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATBASE_URL,
    ssl: true
  }
});

const app = express()

const PORT = process.env.PORT || 8080

app.use(bodyParser.json())
app.use(cors())


app.get('/', (req, res) => res.send("it is working"))
// Get all users
app.get('/users', (req, res) => { users.handleGetUsers(req, res, db) })

// user sign in
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

// call to clarifai
app.post('/imageurl', (req, res) => { image.handleAPIcall(req, res) })

// Registering new user
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// Get a user profile
app.get('/profile/:id', (req, res) => { profile.handleGetProfile(req, res, db) })

// Update user entries
app.put('/image', (req, res) => { image.handleImageEntries(req, res, db) })



app.listen(PORT, () => console.log(`app running on port ${PORT}`))

/****
  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = user
  /profile/:userId --> GET = user
  /image --> PUT = user
 */