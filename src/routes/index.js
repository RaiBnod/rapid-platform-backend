import { createBook, findAllBooks } from '../controllers/bookController';
import {
  createPage,
  deletePage,
  getPage,
  getPages,
  updatePage,
} from '../controllers/pageController';
import { createSubPage } from '../controllers/subPageController';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.send('Welcome to rapid-platform Backend');
  });

  app.get('/api/books', findAllBooks);
  app.post('/api/book', createBook);

  app.get('/api/book/:book/pages', getPages);
  app.get('/api/book/:book/page/:page', getPage);
  app.post('/api/book/:book/page', createPage);
  app.put('/api/book/:book/page/:page', updatePage);
  app.delete('/api/book/:book/page/:page', deletePage);

  app.post('/api/book/:book/page/:page', createSubPage);
};

export default routes;
