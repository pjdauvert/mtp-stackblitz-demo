import express from 'express';
import { type ISimpleItem, SimpleItemModel } from '../models/simpleItem.model';
import statusCode from 'http-status-codes';


const router = express.Router();

// Create
router.post('/model', async (req, res) => {
  try {
    const item = new SimpleItemModel(req.body);
    await item.save();
    res.status(statusCode.CREATED).json(item);
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: 'Error creating item', error });
  }
});

// Read all
router.get('/model/all', async (req, res) => {
  try {
    const items = await SimpleItemModel.find();
    const language = req.query.language as string;

    if (language) {
      //const translatedItems = items.map(item: ISimpleItem => item.translate(language));
      //res.json(translatedItems);
      res.json(items);
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
      // res.json(item.translate(language));
      res.json(item);
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

export default router;
