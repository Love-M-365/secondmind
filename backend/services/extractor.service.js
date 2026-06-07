import pdf from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

export const extractTextFromFile = async (fileBuffer, mimeType) => {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdf(fileBuffer);
      return data.text || '';
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimeType === 'application/msword'
    ) {
      const data = await mammoth.extractRawText({ buffer: fileBuffer });
      return data.value || '';
    } else if (mimeType.startsWith('text/') || mimeType === 'application/json') {
      return fileBuffer.toString('utf-8');
    } else {
      // Default fallback attempt to convert buffer to string
      return fileBuffer.toString('utf-8');
    }
  } catch (error) {
    console.error(`Error extracting text for mimeType ${mimeType}:`, error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n\s*\n/g, '\n\n') // Reduce multiple blank lines
    .trim();
};
