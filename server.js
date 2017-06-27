const express = require('express');
const app = express();
const md5 = require('md5');
const bodyParser = require('body-parser');

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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
})

app.post('/api/folders', (request, response) => {
  console.log(' req.body', request.body);
  const { name } = request.body
  // const id = md5(name)
  const id = Date.now()

  if(!name) {
    return response.status(422).send({
      error: 'No folder name provided'
    })
  }
  app.locals.folders[id] = name

  let message = 'folder created'
  response.status(201).json({ id, message })
})
