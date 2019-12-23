const handleGetUsers = (req, res, db) => {
  db.select('*').from('users')
    .then(users => {
      if (users.length) {
        res.json(users)
      } else {
        res.status(400).json('no registered user yet')
      }
    })
    .catch(error => {
      res.status(400).json('unable to get users')
    })
}

module.exports = {
  handleGetUsers: handleGetUsers
}