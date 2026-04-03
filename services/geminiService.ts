
import { GoogleGenAI, Type } from "@google/genai";
import type { Settings, Metadata } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const generateMetadata = async (imageFile: File, settings: Settings): Promise<Metadata> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Image = await fileToBase64(imageFile);

  let basePrompt = settings.useCustomPrompt && settings.customPrompt
    ? settings.customPrompt
    : `Generate an SEO-optimized Title (${settings.titleWordLimit} words), ${settings.keywordCount} single-word high-volume Keywords (comma separated, first 10 must be top-searched), a ${settings.descriptionWordLimit}-word natural Description, and 3 primary keywords based on the content of the uploaded image for the platform: ${settings.platform}.`;

  const promptAdditions: string[] = [];
  if (settings.useNegativeKeywords && settings.negativeKeywords) {
      promptAdditions.push(`The generated title, description, and keywords MUST NOT contain any of these words: ${settings.negativeKeywords}.`);
  }
  if (settings.useCustomKeywords && settings.customKeywords) {
      promptAdditions.push(`The generated title, description, and keywords MUST include these words: ${settings.customKeywords}.`);
  }

  const prompt = `${basePrompt} ${promptAdditions.join(' ')}`.trim();


  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: imageFile.type, data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: `An SEO-optimized title of about ${settings.titleWordLimit} words.` },
          keywords: { type: Type.STRING, description: `A comma-separated string of ${settings.keywordCount} high-volume keywords.` },
          description: { type: Type.STRING, description: `A natural-sounding description of about ${settings.descriptionWordLimit} words.` },
          primaryKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: `An array of the 3 most important keywords.`
          }
        },
        required: ['title', 'keywords', 'description', 'primaryKeywords']
      }
    }
  });

  const jsonString = response.text.trim();
  const result: Metadata = JSON.parse(jsonString);

  // Post-process to ensure constraints are met
  const keywordsArray = result.keywords.split(',').map(k => k.trim()).filter(Boolean);
  result.keywords = keywordsArray.slice(0, settings.keywordCount).join(', ');

  return result;
};
