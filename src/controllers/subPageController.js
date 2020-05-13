import fs from 'fs';
import path from 'path';
import { DOC_LOCATION, METADATA_FILE } from './constant';
import { wrapError, wrapMessage } from './utils';

const createSubPage = (req, res) => {
  const { book, page } = req.params;
  const { title, slug: subPage, filename, content } = req.body;

  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(DOC_LOCATION, book, METADATA_FILE)));
    const metadataPage = metadata.pages.find((p) => p.slug === page);
    if (!metadataPage) {
      res.status(404).json(wrapError(`We have don't have the page ${page} on book ${book}`));
      return;
    }
    if (metadataPage.pages) {
      if (~metadataPage.pages.findIndex((sp) => sp.slug === subPage)) {
        res.status(409).json(wrapError(`We have already the sub page ${subPage} on book ${book}`));
        return;
      }
    } else {
      metadataPage.pages = [];
    }
    fs.writeFileSync(path.join(DOC_LOCATION, book, filename), content);
    metadataPage.pages.push({ title, slug: subPage, filename, pages: null });
    fs.writeFileSync(path.join(DOC_LOCATION, book, METADATA_FILE), JSON.stringify(metadata));
    res.status(201).json(wrapMessage('Successfully created the sub page'));
  } catch (error) {
    res.status(404).json(wrapError(error));
  }
};

export { createSubPage };
