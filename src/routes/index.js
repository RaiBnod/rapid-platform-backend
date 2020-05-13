import { findAllBooks } from '../controllers/bookController';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to rapid-platform Backend');
  });
  app.get('/api/books', findAllBooks);
};

export default routes;
