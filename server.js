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
    host: '127.0.0.1',
    user: 'postgres',
    password: '12345',
    database: 'smart-brain'
  }
});

// db.select('*').from('users').then(data => console.log(data))

const app = express()

app.use(bodyParser.json())
app.use(cors())

// Get all users
app.get('/users', (req, res) => { users.handleGetUsers(req, res, db) })

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

// Registering new user
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// Get a user profile
app.get('/profile/:id', (req, res) => { profile.handleGetProfile(req, res, db) })

// Update user entries
app.put('/image', (req, res) => { image.handleImageEntries(req, res, db) })


app.listen(8080, () => console.log('app running on port 8080'))

/****
  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = user
  /profile/:userId --> GET = user
  /image --> PUT = user
 */