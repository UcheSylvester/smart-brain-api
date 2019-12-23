const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

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

const database = {
  users: [
    {
      id: '120',
      name: 'Peter',
      email: 'peters@gmail.com',
      password: 'oranges',
      entries: 0,
      joined: new Date()
    },
    {
      id: '121',
      name: 'Martha',
      email: 'martha@gmail.com',
      password: 'martta',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => res.send(database.users))

app.post('/signin', (req, res) => {

  const user = database.users.find(user => user.email === req.body.email && user.password === req.body.password)

  return (user) ?
    res.json({ message: 'success', user }) :
    res.status(400).json({ message: 'user not found', user })
})

// Registering new user
app.post('/register', (req, res) => {
  if (req.body) {
    const { email, name, password } = req.body
    let userFound = false;

    // Saving the newly resgistered user to the users' table in db using knex
    db('users')
      .returning('*')
      .insert({
        name: name,
        email: email,
        joined: new Date()
      })
      .then(user => {
        res.json({
          message: 'success',
          user: user[0]
        })
      })
      .catch(err => {
        res.status(400).json('could not register this user')
      })

    bcrypt.hash(password, null, null, function (err, hash) {
      // Store hash in your password DB.
      console.log(password, hash)
    });
  }

})

// Get a user profile
app.get('/profile/:id', (req, res) => {
  const { id } = req.params

  // Selecting the user with the id in params
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('user not found')
      }
    })
    .catch(err => {
      res.status(400).json('error getting user')
    })

})

// Update user entries
app.put('/image', (req, res) => {
  const { id } = req.body

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(error => {
      res.status(400).json('error updating entries')
    })

})


app.listen(8080, () => console.log('app running on port 8080'))

/****
  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = user
  /profile/:userId --> GET = user
  /image --> PUT = user
 */