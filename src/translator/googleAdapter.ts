import { v2 } from '@google-cloud/translate';

//import type { TranslatablePayload } from 'mongoose-translation-plugin';
type Payload = {
  text: string;
  from: string;
  to: string;
};

// Contents dynamic on demand translations
export const getGoogleTranslations = async ({
  text,
  from,
  to,
}: Payload): Promise<string[]> => {
  // require environment variable GOOGLE_API_KEY
  const key = process.env.GOOGLE_API_KEY;
  if (!key)
    throw new Error(
      'GOOGLE_API_KEY is required to use mongoose translation plugin'
    );
  else console.log(`Usin Google Api Key: ${key}`);
  // Instantiates a client
  const Translator = new v2.Translate({ key });
  const [translations] = await Translator.translate(text, {
    from,
    to,
    model: 'nmt',
  });
  return Array.isArray(translations) ? translations : [translations];
};
