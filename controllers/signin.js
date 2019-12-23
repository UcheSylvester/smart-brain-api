const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("incorrect form submission, please enter email and/or password")
  }

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

}

module.exports = {
  handleSignin: handleSignin
}