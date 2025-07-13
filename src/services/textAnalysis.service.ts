import { ITextAnalysis } from '../models/Text';
import NodeCache from 'node-cache';

export interface IParagraphLongestWords {
  paragraphIndex: number;
  longestWords: string[];
}

const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache

/**
 * Generates a simple hash string from the given text.
 * This is used to create a cache key for text analysis results.
 * 
 * @param text - The input text to hash.
 * @returns A string representing the hash of the input text.
 */
function generateHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

/**
 * Analyzes the given text and returns various statistics including word count,
 * character count, sentence count, paragraph count, and the longest words in each paragraph.
 * Utilizes caching to avoid redundant computations for the same input text.
 *
 * @param text - The input text to be analyzed.
 * @returns An object containing analysis results:
 *   - wordCount: Total number of words in the text.
 *   - characterCount: Total number of characters in the text.
 *   - sentenceCount: Total number of sentences in the text.
 *   - paragraphCount: Total number of paragraphs in the text.
 *   - longestWordsPerParagraph: Array of objects, each containing the paragraph index and its longest word(s).
 */
export function analyzeText(text: string): ITextAnalysis {
  const cacheKey = `analysis_${generateHash(text)}`;
  const cached = cache.get<ITextAnalysis>(cacheKey);
  if (cached) return cached;

  const normalizedText = text.trim();
  const characterCount = normalizedText.length;
  const words = normalizedText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const sentences = normalizedText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const sentenceCount = sentences.length;
  const paragraphs = normalizedText.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
  const paragraphCount = paragraphs.length || 1;
  const longestWordsPerParagraph = findLongestWordsPerParagraph(paragraphs);

  const analysis: ITextAnalysis = {
    wordCount,
    characterCount,
    sentenceCount,
    paragraphCount,
    longestWordsPerParagraph
  };
  cache.set(cacheKey, analysis);
  return analysis;
}

export function getWordCount(text: string): number {
  return analyzeText(text).wordCount;
}

export function getCharacterCount(text: string): number {
  return analyzeText(text).characterCount;
}

export function getSentenceCount(text: string): number {
  return analyzeText(text).sentenceCount;
}

export function getParagraphCount(text: string): number {
  return analyzeText(text).paragraphCount;
}

export function getLongestWordsByParagraph(text: string): IParagraphLongestWords[] {
  return analyzeText(text).longestWordsPerParagraph;
}

function findLongestWordsPerParagraph(paragraphs: string[]): IParagraphLongestWords[] {
  return paragraphs.map((paragraph, index) => {
    const words = paragraph.split(/\s+/).filter(word => word.length > 0);
    const longestWords = findLongestWords(words);
    return {
      paragraphIndex: index + 1,
      longestWords
    };
  });
}

function findLongestWords(words: string[]): string[] {
  if (words.length === 0) return [];
  const cleanWords = words.map(word => word.toLowerCase().replace(/[^\w]/g, '')).filter(word => word.length > 0);
  if (cleanWords.length === 0) return [];
  const maxLength = Math.max(...cleanWords.map(word => word.length));
  const longestWords = cleanWords.filter(word => word.length === maxLength);
  return [...new Set(longestWords)];
} 