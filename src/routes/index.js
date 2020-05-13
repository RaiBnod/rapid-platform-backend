import { createBook, findAllBooks } from '../controllers/bookController';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to rapid-platform Backend');
  });
  app.get('/api/books', findAllBooks);
  app.put('/api/book', createBook);
};

export default routes;
