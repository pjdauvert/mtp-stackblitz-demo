import mongoose from 'mongoose';
import { TranslatableDocument, translationPlugin } from 'mongoose-translation-plugin';
import { DeepLTranslator } from '../translator/deeplAdapter';
const Schema = mongoose.Schema;

export interface ISimpleItem extends mongoose.Document {
  name: string;
  description: string;
  balance: number;
}

type ISimpleDocument = ISimpleItem & TranslatableDocument<ISimpleItem>;

const schema = new Schema({
  name: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true, match: /^[a-z0-9]{3,10}$/ },
  description: { type: String, translatable: true },
  balance: Number,
});

schema.plugin(translationPlugin, { provider: new DeepLTranslator() });

export const SimpleItemModel = mongoose.model<ISimpleDocument>(
  'SimpleItemModel',
  schema
);
