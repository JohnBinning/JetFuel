const express = require('express');
const app = express();
const md5 = require('md5');
const shortid = require('shortid');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')[configuration];

console.log(shortid.generate(), 'short id2')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'jetFuel';
app.locals.folders = {};

app.get('/', (request, response) => {
  response.sendFile('index.html')
  response.sendFile('./styles/index.css')
  response.sendFile('./scripts/index.js')
})

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then((folders) => {
      if (folders.length) {
        response.status(200).json(folders)
      } else {
        response.status(404).json({
          error: 'No folders found'
        })
      }
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/folders/:id', (request, response) => {
  database('folders').where('id', request.params.id).select()
  .then((folders) => {
    if (folders.length) {
      response.status(200).json(folders)
    } else {
      response.status(404).json({
        error: `No folders found with id of ${request.params.id}`
      })
    }
  })
  .catch((error) => {
    response.status(500).json({ error })
  })
})

app.post('/api/folders', (request, response) => {
  console.log(' req.body', request.body);
  const { name } = request.body

  if(!name) {
    return response.status(422).send({
      error: 'No folder name provided'
    })
  }

  database('folders').insert(folders, 'id')
    .then((folders) => {
      response.status(201).json({ id: folders[0] })
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})











app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
})
