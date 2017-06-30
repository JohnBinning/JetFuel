const reRouteLink = (req, res) => {
  const { id } = req.params
  database('urls').where('id', id).select('url')
  .then(longUrl => {
    const { url } = longUrl[0]
    res.redirect(302, `http://${url}`)
  })
}

module.exports = {reRouteLink: reRouteLink};
