
const handleRegister = (req, res, db, bcrypt) => {
  console.log('lddlld')
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

}

module.exports = {
  handleRegister: handleRegister
}