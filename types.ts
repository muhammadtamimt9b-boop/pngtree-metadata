
export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  metadata: Metadata | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface Metadata {
  title: string;
  keywords: string;
  description: string;
  primaryKeywords: string[];
}

export interface Settings {
  titleWordLimit: number;
  keywordCount: number;
  descriptionWordLimit: number;
  platform: Platform;
  useCustomPrompt: boolean;
  customPrompt: string;
  negativeKeywords: string;
  useNegativeKeywords: boolean;
  customKeywords: string;
  useCustomKeywords: boolean;
}

export enum Platform {
    ADOBE_STOCK = "Adobe Stock",
    PNGTREE = "PNGTree",
    FREEPIK = "Freepik",
    PIXABAY = "Pixabay",
}
