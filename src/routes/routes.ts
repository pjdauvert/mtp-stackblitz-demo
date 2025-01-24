import express from 'express';
import { SimpleItemModel } from '../models/simpleItem.model';
import statusCode from 'http-status-codes';
import fs from 'node:fs';

const router = express.Router();

// Create
router.post('/model', async (req, res) => {
  try {
    if (!req.body.name || !req.body.balance || !req.body.description || !req.body.language) throw new Error('Missing required fields');
    const item = new SimpleItemModel(req.body);
    await item.save();
    res.status(statusCode.CREATED).json(item);
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: 'Error creating item', error });
  }
});

// Seed
router.post('/model/seed', async (req, res) => {
  try {
    await SimpleItemModel.deleteMany({});
    const seedData = fs.readFileSync('./src/public/seed.json', 'utf8');
    await SimpleItemModel.insertMany(JSON.parse(seedData));
    res.json({ message: 'Items seeded successfully' });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error seeding items', error });
  }
});

// Read all
router.get('/model/all', async (req, res) => {
  try {
    const items = await SimpleItemModel.find();
    const language = req.query.language as string;

    if (language) {
      const translatedItems = await Promise.all(items.map(async item => item.translate(language)));
      res.json(translatedItems);
    } else {
      res.json(items);
    }
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching items', error });
  }
});

// Read one
router.get('/model/:name', async (req, res) => {
  try {
    const item = await SimpleItemModel.findOne({ name: req.params.name });
    if (!item) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Item not found' });
    }

    const language = req.query.language as string;
    if (language) {
      const translatedPlainObject = await item.translate(language);
      res.json(translatedPlainObject);
    } else {
      res.json(item);
    }
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching item', error });
  }
});

// Update
router.put('/model/:name', async (req, res) => {
  try {
    const item = await SimpleItemModel.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      { new: true }
    );
    if (!item) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: 'Error updating item', error });
  }
});

// Disable AutoTranslation
router.put('/model/:name/disableAutoTranslation/:language', async (req, res) => {
  try {
    const item = await SimpleItemModel.findOne({ name: req.params.name });
    if (!item) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Item not found' });
    }
    const languageParam = req.params.language;
    const tr = item.translation.find(tr => tr.language === languageParam);
    if (!tr) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Translation not found' });
    } else {
      tr.autoTranslated = false;
      //const index = item.translation.findIndex(tr => tr.language === language);
      //if (index !== -1) {
      //  item.translation[index] = tr;
      //}
      await item.save();
      res.json(item);
    }
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: 'Error disabling auto translation', error });
  }
});

// Delete
router.delete('/model/:name', async (req, res) => {
  try {
    const item = await SimpleItemModel.findOneAndDelete({
      name: req.params.name,
    });
    if (!item) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: 'Error deleting item', error });
  }
});

// Delete All
router.delete('/model', async (req, res) => {
  try {
    await SimpleItemModel.deleteMany({});
    res.json({ message: 'All items deleted successfully' });
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: 'Error deleting all items', error });
  }
});


export default router;
