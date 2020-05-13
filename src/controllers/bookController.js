import fs from 'fs';
import path from 'path';
import { DEFAULT_PAGE, DOC_LOCATION, METADATA_FILE } from './constant';
import { wrapData, wrapError, wrapMessage } from './utils';

const findAllBooks = (req, res) => {
  fs.readdir(DOC_LOCATION, (error, files) => {
    if (error) {
      res.status(204).json(wrapError(error));
    }
    res.json(wrapData(files));
  });
};

const createBook = (req, res) => {
  const { body } = req;
  const { title, slug: book, content } = body;
  fs.mkdir(path.join(DOC_LOCATION, book), (error) => {
    if (error) {
      res.status(409).json(wrapError(error));
      return;
    }
    fs.writeFileSync(path.join(DOC_LOCATION, book, DEFAULT_PAGE), content);
    const metadata = JSON.stringify({
      title,
      slug: book,
      pages: [{ title: 'Index', slug: 'index', filename: DEFAULT_PAGE, pages: null }],
    });
    fs.writeFileSync(path.join(DOC_LOCATION, book, METADATA_FILE), metadata);
    res.status(201).json(wrapMessage('Successfully created the book'));
  });
};

export { createBook, findAllBooks };
