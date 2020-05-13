import fs from 'fs';
import path from 'path';
import { DOC_LOCATION, METADATA_FILE } from './constant';
import { wrapData, wrapError, wrapMessage } from './utils';

const getPages = (req, res) => {
  const { book } = req.params;
  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(DOC_LOCATION, book, METADATA_FILE)));
    const pages = metadata.pages.map((p) => p.slug);
    res.json(wrapData(pages));
  } catch (error) {
    res.status(400).json(wrapError(error));
  }
};

const getPage = (req, res) => {
  const { book, page } = req.params;
  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(DOC_LOCATION, book, METADATA_FILE)));
    const pageDictionary = metadata.pages.find((p) => p.slug === page);
    if (!pageDictionary) {
      res.status(400).json(wrapError('Page does not found on metadata'));
      return;
    }
    const content = fs.readFileSync(path.join(DOC_LOCATION, book, pageDictionary.filename));
    res.json(wrapData(content.toString()));
  } catch (error) {
    res.status(400).json(wrapError(error));
  }
};

const createPage = (req, res) => {
  const { book } = req.params;
  const { title, slug: page, filename, content } = req.body;
  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(DOC_LOCATION, book, METADATA_FILE)));
    if (metadata.pages.find((p) => p.slug === page)) {
      res.status(409).json(wrapError(`We have already that page on book ${book}`));
      return;
    }
    fs.writeFileSync(path.join(DOC_LOCATION, book, filename), content);
    metadata.pages.push({ title, slug: page, filename, pages: null });
    fs.writeFileSync(path.join(DOC_LOCATION, book, METADATA_FILE), JSON.stringify(metadata));
    res.status(201).json(wrapMessage('Successfully created the page'));
  } catch (error) {
    res.status(404).json(wrapError(error));
  }
};

const updatePage = (req, res) => {
  const { book, page } = req.params;
  const { title, filename, content } = req.body;
  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(DOC_LOCATION, book, METADATA_FILE)));
    const index = metadata.pages.findIndex((p) => p.slug === page);
    if (!~index) {
      res.status(404).json(wrapError(`We don't have that page on book ${book} to edit`));
      return;
    }
    fs.unlinkSync(path.join(DOC_LOCATION, book, metadata.pages[index].filename));
    metadata.pages.splice(index);
    fs.writeFileSync(path.join(DOC_LOCATION, book, filename), content);
    metadata.pages.push({ title, slug: page, filename, pages: null });
    fs.writeFileSync(path.join(DOC_LOCATION, book, METADATA_FILE), JSON.stringify(metadata));
    res.status(201).json(wrapMessage('Successfully created the page'));
  } catch (error) {
    res.status(404).json(wrapError(error));
  }
};

const deletePage = (req, res) => {
  const { book, page } = req.params;
  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(DOC_LOCATION, book, METADATA_FILE)));
    const index = metadata.pages.findIndex((p) => p.slug === page);
    if (!~index) {
      res.status(404).json(wrapError(`We don't have that page on book ${book} to delete`));
      return;
    }
    fs.unlinkSync(path.join(DOC_LOCATION, book, metadata.pages[index].filename));
    metadata.pages.splice(index);
    fs.writeFileSync(path.join(DOC_LOCATION, book, METADATA_FILE), JSON.stringify(metadata));
    res.status(201).json(wrapMessage('Successfully deleted the page'));
  } catch (error) {
    res.status(404).json(wrapError(error));
  }
};

export { getPages, getPage, createPage, updatePage, deletePage };
