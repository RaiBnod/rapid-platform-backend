import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';

const express = require('express');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

routes(app);
app.use(express.static('public'));

const server = app.listen(8080, () => {
  const { port } = server.address();

  console.log('Rapid platform Backend app listening at port: %s', port);
});
