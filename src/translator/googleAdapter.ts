import { v2 } from '@google-cloud/translate';
import debug from 'debug';
import type { TranslatablePayload } from 'mongoose-translation-plugin';

const debugLog = debug('mtpdemo:translator:googleAdapter');

export class GoogleTranslator {
  private static instance: GoogleTranslator;
  private key: string;
  private translator: v2.Translate;
  private constructor() {
    this.key = process.env.GOOGLE_API_KEY;
    if (!this.key) {
      throw new Error('GOOGLE_API_KEY is required to use mongoose translation plugin');
    } else debugLog(`Using Google Api Key: ${this.key}`);

    this.translator = new v2.Translate({ key: this.key });  
  }

  public static getInstance(): GoogleTranslator {
    if (!GoogleTranslator.instance) {
      GoogleTranslator.instance = new GoogleTranslator();
    }
    return GoogleTranslator.instance;
  }

  private async validateLanguage(language: string): Promise<void> {
    const sourceLanguages = await this.translator.getLanguages();
    for (let i = 0; i < sourceLanguages.length; i++) {
      const lang = sourceLanguages[i];
      if (lang.code === language) {
        debugLog(`using language: ${lang.name} (${lang.code})`);
        return;
      }
    }
    throw new Error(`Language ${language} not supported by Google Translate`);
  }

  public async getTranslations({text, from, to}: TranslatablePayload): Promise<string[]> {
    await this.validateLanguage(from);
    await this.validateLanguage(to);
    debugLog(`Translating ${text} from ${from} to ${to}`);
    const [translations, metadata] = await this.translator.translate(text, {
      from,
      to,
      model: 'nmt',
    });
    debugLog(`Translations: ${translations}, Metadata: ${metadata}`);
    return Array.isArray(translations) ? translations : [translations];
  }

}

