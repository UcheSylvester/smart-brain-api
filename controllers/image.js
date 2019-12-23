const Clarifai = require('clarifai')

const app = new Clarifai.App({
  apiKey: 'db27876c34de41ca883a3818f9d68890'
});

const handleAPIcall = (req, res) => {
  app.models.predict(
    Clarifai.FACE_DETECT_MODEL,
    req.body.input
  ).then(data => {
    res.json(data)
  }).catch(error => {
    res.status(400).json('unable to work with API')
  })


}

const handleImageEntries = (req, res, db) => {
  const { id } = req.body

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      if (entries.length) {
        res.json(entries[0])
      } else {
        res.status(400).json("user does not exist")
      }
    })
    .catch(error => {
      res.status(400).json('error updating entries')
    })

}

module.exports = {
  handleImageEntries: handleImageEntries,
  handleAPIcall: handleAPIcall
}