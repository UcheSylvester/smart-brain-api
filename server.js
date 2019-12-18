const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')

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

    bcrypt.hash(password, null, null, function (err, hash) {
      // Store hash in your password DB.
      console.log(password, hash)
    });

    database.users.push({
      id: '123',
      name: name,
      email: email,
      entries: 0,
      joined: new Date()
    })

    res.json({
      message: 'success',
      user: database.users[database.users.length - 1]
    })
  } else {
    res.status(400).json('input user details to register')
  }
})

// Get a user profile
app.get('/profile/:id', (req, res) => {
  const { id } = req.params

  const user = database.users.find(user => user.id === id)

  return (user) ?
    res.json({ message: "success", user }) :
    res.status(400).json('user not found')
})

// Update user entries
app.put('/image', (req, res) => {
  const { id } = req.body
  let found = false;

  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++
      return res.json(user.entries)
    }
  })

  if (!found) {
    res.status(400).json('user not found')
  }
})



// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function (err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });

app.listen(8080, () => console.log('app running on port 8080'))

/****
  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = user
  /profile/:userId --> GET = user
  /image --> PUT = user
 */