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

app.get('/', (req, res) => res.send(database.users))

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // Getting the email and hash inserted into the login table when registering user
  // and comparing it with the entered password using bcrypt
  // if isValid (login details are correct), return the user else return error 
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)

      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(error => {
            res.status(400).json("unable to get user")
          })
      } else {
        res.status(400).json("incorrect email or password")
      }
    })
    .catch(error => {
      res.status(400).json("wrong credentials")
    })

})

// Registering new user
app.post('/register', (req, res) => {
  if (req.body) {
    const { email, name, password } = req.body

    // hashing password
    const hash = bcrypt.hashSync(password);

    // using knex transaction to establish relationship b/w user and login tables
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          // Saving the newly resgistered user to the users' table in db using knex
          return trx('users')
            .returning('*')
            .insert({
              name: name,
              email: loginEmail[0],
              joined: new Date()
            })
            .then(user => {
              res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    }).catch(err => {
      res.status(400).json('unable to register this user')
    })

  }

})

// Get a user profile
app.get('/profile/:id', (req, res) => {
  const { id } = req.params

  // Selecting the user with the id in params
  db.select('*').from('users')
    .where({ id })
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