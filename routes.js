const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const reRouteLink = (request, response) => {
  const id = request.params.id;
  database('links').where('id', id).select('url')
  .then(longUrl => {
    const url = longUrl[0];
    response.redirect(302, `http://${url}`);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
};

module.exports = reRouteLink;
