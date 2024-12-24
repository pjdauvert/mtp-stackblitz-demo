import mongoose from 'mongoose';
//import { TranslatableDocument, TranslatablePayload, TranslatedPlainObject, translationPlugin } from 'mongoose-translation-plugin';
//import { getGoogleTranslations } from '../translator/googleAdapter';
const Schema = mongoose.Schema;

export interface ISimpleItem extends mongoose.Document {
  name: string;
  description: string;
  balance: number;
}

//type ISimpleDocument = ISimple & TranslatableDocument<ISimple>;

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, translatable: true },
  balance: Number,
});

//schema.plugin(translationPlugin, { translator: getGoogleTranslations });

export const SimpleItemModel = mongoose.model<ISimpleItem>(
  'SimpleItemModel',
  schema
);
