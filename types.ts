export interface Message {
  role: 'user' | 'model';
  text: string;
}

// Fix: Add and export `ImageFile` interface to resolve the export error.
export interface ImageFile {
  mimeType: string;
  data: string;
}
