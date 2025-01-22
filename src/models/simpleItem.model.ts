import mongoose from 'mongoose';
import { TranslatableDocument, translationPlugin } from 'mongoose-translation-plugin';
import { GoogleTranslator } from '../translator/googleAdapter';
const Schema = mongoose.Schema;

export interface ISimpleItem extends mongoose.Document {
  name: string;
  description: string;
  balance: number;
}

type ISimpleDocument = ISimpleItem & TranslatableDocument<ISimpleItem>;

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, translatable: true },
  balance: Number,
});

schema.plugin(translationPlugin, { provider: new GoogleTranslator() });

export const SimpleItemModel = mongoose.model<ISimpleItem>(
  'SimpleItemModel',
  schema
);
