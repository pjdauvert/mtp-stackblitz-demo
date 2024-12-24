import { Translator, type SourceLanguageCode, type TargetLanguageCode, type RequestParameters } from 'deepl-node';
import debug from 'debug';
import type { TranslatablePayload } from 'mongoose-translation-plugin';

const debugLog = debug('mtpdemo:translator:deeplAdapter');

export class DeepLTranslator {
  private static instance: DeepLTranslator;
  private key: string;
  private translator: Translator;
  private textTranslationOptions: RequestParameters;

  private constructor() {
    this.key = process.env.DEEPL_API_KEY;
    if (!this.key) {
      throw new Error('DEEPL_API_KEY is required to use mongoose translation plugin');
    } else debugLog(`Using DeepL Api Key: ${this.key}`);

    this.translator = new Translator(this.key, {
      appInfo: {
        appName: 'mtpdemo-deepl-adapter',
        appVersion: '1.0.0',
      }
    });
    this.textTranslationOptions = {
      formality: 'more',

    };
  }

  public static getInstance(): DeepLTranslator {
    if (!DeepLTranslator.instance) {
      DeepLTranslator.instance = new DeepLTranslator();
    }
    return DeepLTranslator.instance;
  }
  
  private async validateSourceLanguage(language: string): Promise<void> {
    const sourceLanguages = await this.translator.getSourceLanguages();
    for (let i = 0; i < sourceLanguages.length; i++) {
      const lang = sourceLanguages[i];
      if (lang.code === language) {
        return;
      }
    }
    throw new Error(`Invalid source language code: ${language}`);
  }

  private async validateTargetLanguage(language: string): Promise<void> {
    const targetLanguages = await this.translator.getTargetLanguages();
    for (let i = 0; i < targetLanguages.length; i++) {
      const lang = targetLanguages[i];
      if (lang.code === language) {
        return;
      }
    }
    throw new Error(`Invalid target language code: ${language}`);
  }


  public async getTranslations({text, from, to}: TranslatablePayload): Promise<string[]> {
    await this.validateSourceLanguage(from);
    await this.validateTargetLanguage(to);
    debugLog(`Translating ${text} from ${from} to ${to}`);
    const [translations] = await this.translator.translateText(text, from as SourceLanguageCode, to as TargetLanguageCode, this.textTranslationOptions);
    debugLog(`Translations: ${JSON.stringify(translations, null, 2)}`);
    return Array.isArray(translations) ? translations.map(t => t.text) : [translations.text];
  }
}
