const handleGetProfile = (req, res, db) => {
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

}

module.exports = {
  handleGetProfile: handleGetProfile
}