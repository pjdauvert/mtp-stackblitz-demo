import debug from 'debug';
import { type RequestParameters, type SourceLanguageCode, type TargetLanguageCode, Translator } from 'deepl-node';
import type { TranslationProvider, TranslatorFunction } from 'mongoose-translation-plugin';

const debugLog = debug('mtpdemo:translator:deeplAdapter');

export class DeepLTranslator implements TranslationProvider {
  private APIKey: string;

  private translator: Translator;

  private textTranslationOptions: RequestParameters;

  constructor() {
    this.APIKey = process.env.DEEPL_API_KEY || '';
    if (!this.APIKey) {
      throw new Error('DEEPL_API_KEY is required in environment variables');
    }
    debugLog('DeepL Api Key is set');

    this.translator = new Translator(this.APIKey, {
      appInfo: {
        appName: 'mtpdemo-deepl-adapter',
        appVersion: '1.0.0'
      }
    });
    this.textTranslationOptions = {
      //formality: 'more'
    };
  }

  private async validateSourceLanguage(language: string): Promise<void> {
    const sourceLanguages = await this.translator.getSourceLanguages();
    for (let i = 0; i < sourceLanguages.length; i++) {
      const lang = sourceLanguages[i];
      if (lang?.code === language) {
        return;
      }
    }
    throw new Error(`Invalid source language code: ${language}`);
  }

  private async validateTargetLanguage(language: string): Promise<void> {
    const targetLanguages = await this.translator.getTargetLanguages();
    for (let i = 0; i < targetLanguages.length; i++) {
      const lang = targetLanguages[i];
      if (lang?.code === language) {
        return;
      }
    }
    throw new Error(`Invalid target language code: ${language}`);
  }

  public getTranslations: TranslatorFunction = async ({ text, from, to }) => {
    await this.validateSourceLanguage(from);
    // Deepl requires the language to be in the format of "en-US" for english.
    let targetLanguage = to;
    if (to === 'en') {
      targetLanguage = 'en-US';
    }
    await this.validateTargetLanguage(targetLanguage);
    try {
      debugLog(`Translating ${text} from ${from} to ${to}`);
      const [translations] = await this.translator.translateText(text, from as SourceLanguageCode, targetLanguage as TargetLanguageCode, this.textTranslationOptions);
      debugLog(`Translations: ${JSON.stringify(translations, null, 2)}`);
      return Array.isArray(translations) ? translations.map((t) => t.text) : [translations?.text || ''];
    } catch (error) {
      const err = error as Error;
      debugLog(`Translation error: ${err.message}`);
      throw new Error(`Failed to translate with DeepL: ${err.message}`);
    }
  };
}
