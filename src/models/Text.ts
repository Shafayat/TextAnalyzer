import mongoose, { Document, Schema } from 'mongoose';

export interface IParagraphLongestWords {
  paragraphIndex: number;
  longestWords: string[];
}

export interface ITextAnalysis {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  longestWordsPerParagraph: IParagraphLongestWords[];
}

export interface IText extends Document {
  content: string;
  user: mongoose.Types.ObjectId;
  analysis: ITextAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for the longest words in each paragraph.
 * 
 * Fields:
 * - paragraphIndex: The index of the paragraph (number, required).
 * - longestWords: Array of the longest words in the paragraph (array of strings, required).
 */
const ParagraphLongestWordsSchema: Schema = new Schema<IParagraphLongestWords>({
  paragraphIndex: { type: Number, required: true },
  longestWords: [{ type: String, required: true }]
});

/**
 * Mongoose schema for text analysis data.
 * 
 * Fields:
 * - wordCount: Total number of words in the text (number, required).
 * - characterCount: Total number of characters in the text (number, required).
 * - sentenceCount: Total number of sentences in the text (number, required).
 * - paragraphCount: Total number of paragraphs in the text (number, required).
 * - longestWordsPerParagraph: Array containing the longest words for each paragraph (array of ParagraphLongestWordsSchema).
 */
const TextAnalysisSchema: Schema = new Schema<ITextAnalysis>({
  wordCount: { type: Number, required: true },
  characterCount: { type: Number, required: true },
  sentenceCount: { type: Number, required: true },
  paragraphCount: { type: Number, required: true },
  longestWordsPerParagraph: [ParagraphLongestWordsSchema]
});

/**
 * Mongoose schema for the Text model.
 * 
 * Fields:
 * - content: The main text content (string, required).
 * - user: Reference to the User who owns the text (ObjectId, required).
 * - analysis: Analysis data for the text (embedded TextAnalysisSchema, required).
 * 
 * Timestamps are automatically managed (createdAt, updatedAt).
 */
const TextSchema: Schema = new Schema<IText>({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  analysis: { type: TextAnalysisSchema, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IText>('Text', TextSchema); 