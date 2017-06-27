const express = require('express');
const app = express();
// const bodyParser = require('body-parser');

app.use(express.static(`${__dirname}/public`));
// app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.locals.title = 'jetFuel';

app.get('/', (request, response) => {
  response.sendFile('index.html')
  response.sendFile('./styles/index.css')
  response.sendFile('./scripts/index.js')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
})
