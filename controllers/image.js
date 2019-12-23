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
  handleImageEntries: handleImageEntries
}