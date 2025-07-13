import { ITextAnalysis } from '../models/Text';

export interface IParagraphLongestWords {
  paragraphIndex: number;
  longestWords: string[];
}

export function analyzeText(text: string): ITextAnalysis {
  // Remove extra whitespace and normalize
  const normalizedText = text.trim();
  
  // Character count (including spaces and punctuation)
  const characterCount = normalizedText.length;
  
  // Word count (split by whitespace, filter out empty strings)
  const words = normalizedText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Sentence count (split by sentence endings)
  const sentences = normalizedText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Paragraph count (split by double newlines)
  const paragraphs = normalizedText.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
  const paragraphCount = paragraphs.length || 1; // At least 1 paragraph
  
  // Find longest words from each paragraph
  const longestWordsPerParagraph = findLongestWordsPerParagraph(paragraphs);
  
  // Find longest words from entire text
  const longestWords = findLongestWords(words);
  
  return {
    wordCount,
    characterCount,
    sentenceCount,
    paragraphCount,
    longestWords,
    longestWordsPerParagraph
  };
}

function findLongestWordsPerParagraph(paragraphs: string[]): IParagraphLongestWords[] {
  return paragraphs.map((paragraph, index) => {
    const words = paragraph.split(/\s+/).filter(word => word.length > 0);
    const longestWords = findLongestWords(words);
    return {
      paragraphIndex: index + 1, // so that frontend paragraph count doesnt start from 0
      longestWords
    };
  });
}

function findLongestWords(words: string[]): string[] {
  if (words.length === 0) return [];
  
  // Clean words (remove punctuation, convert to lowercase)
  const cleanWords = words.map(word => 
    word.toLowerCase().replace(/[^\w]/g, '')
  ).filter(word => word.length > 0);
  
  if (cleanWords.length === 0) return [];
  
  // Find the maximum length
  const maxLength = Math.max(...cleanWords.map(word => word.length));
  
  // Find all words with the maximum length
  const longestWords = cleanWords.filter(word => word.length === maxLength);
  
  // Remove duplicates and return
  return [...new Set(longestWords)];
} 