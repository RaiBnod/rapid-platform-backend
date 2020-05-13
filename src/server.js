import routes from './routes';

const express = require('express');

const app = express();

routes(app);
app.use(express.static('public'));

const server = app.listen(8080, () => {
  const { port } = server.address();

  console.log('Rapid platform Backend app listening at port: %s', port);
});
