import { ITextAnalysis } from '../models/Text';

export interface IParagraphLongestWords {
  paragraphIndex: number;
  longestWords: string[];
}

/**
 * Runs a full analysis on the given text and returns a summary of the results.
 * This will count words, characters, sentences, paragraphs, and also finds the longest words
 * both in the whole text and in each paragraph. 
 * 
 * @param text - The text you want to analyze.
 * @returns An object with wordCount, characterCount, sentenceCount, paragraphCount, and longestWordsPerParagraph.
 */
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
    longestWordsPerParagraph
  };
}


/**
 * Returns the number of words in the given text.
 * spaces at the beginning and end of the text are ignored.
 * 
 * @param text - The input text to analyze.
 * @returns The count of words in the text.
 */
export function getWordCount(text: string): number {
  const normalizedText = text.trim();
  const words = normalizedText.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}


/**
 * Returns the number of characters in the given text.
 * spces at the beginning and end of the text are ignored.
 * 
 * @param text - The input text to analyze.
 * @returns The count of characters in the text.
 */
export function getCharacterCount(text: string): number {
  const normalizedText = text.trim();
  return normalizedText.length;
}

/**
 * Counts the number of sentences in the given text.
 * This function splits the text by common sentence enders like . ! or ?
 * 
 * @param text - The text you want to count sentences in.
 * @returns The number of sentences found in the text.
 */
export function getSentenceCount(text: string): number {
  const normalizedText = text.trim();
  const sentences = normalizedText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  return sentences.length;
}


/**
 * Counts how many paragraphs are in the given text.
 * This just looks for blank lines (double newlines) to split paragraphs.
 * 
 * @param text - The text you want to check for paragraphs.
 * @returns The number of paragraphs found
 */
export function getParagraphCount(text: string): number {
  const normalizedText = text.trim();
  const paragraphs = normalizedText.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
  return paragraphs.length || 1;
}

/**
 * Finds the longest word(s) in each paragraph of the text.
 * 
 * This function splits the text into paragraphs (using blank lines), then for each paragraph,
 * it figures out which word or words are the longest.
 * 
 * @param text - The text you want to analyze, with paragraphs separated by blank lines.
 * @returns An array where each item tells you the paragraph number and its longest word(s).
 */
export function getLongestWordsByParagraph(text: string): IParagraphLongestWords[] {
  const normalizedText = text.trim();
  const paragraphs = normalizedText.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
  return findLongestWordsPerParagraph(paragraphs);
}

/**
 * For each paragraph, finds the longest word or words in it.
 * 
 * This goes through all the paragraphs you give it, splits each one into words, 
 * and then finds out which word(s) are the longest in that paragraph. 
 * 
 * @param paragraphs - An array of paragraphs (as strings) to check.
 * @returns An array of objects, each with the paragraph number and its longest word(s).
 */
function findLongestWordsPerParagraph(paragraphs: string[]): IParagraphLongestWords[] {
  return paragraphs.map((paragraph, index) => {
    const words = paragraph.split(/\s+/).filter(word => word.length > 0);
    const longestWords = findLongestWords(words);
    return {
      paragraphIndex: index + 1, // so the frontend doesn't start counting at 0, which is confusing!
      longestWords
    };
  });
}

/**
 * Finds the longest word or words in a list of words.
 * 
 * So this just takes your array of words, cleans them up (gets rid of punctuation, makes everything lowercase, that sorta thing), 
 * and then figures out which word or words are the longest.
 * 
 * @param words - An array of words to check.
 * @returns An array of the longest word(s) found, with no duplicates.
 */
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