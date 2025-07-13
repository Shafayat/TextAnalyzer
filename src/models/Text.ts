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
  longestWords: string[];
  longestWordsPerParagraph: IParagraphLongestWords[];
}

export interface IText extends Document {
  content: string;
  user: mongoose.Types.ObjectId;
  analysis: ITextAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

const ParagraphLongestWordsSchema: Schema = new Schema<IParagraphLongestWords>({
  paragraphIndex: { type: Number, required: true },
  longestWords: [{ type: String, required: true }]
});

const TextAnalysisSchema: Schema = new Schema<ITextAnalysis>({
  wordCount: { type: Number, required: true },
  characterCount: { type: Number, required: true },
  sentenceCount: { type: Number, required: true },
  paragraphCount: { type: Number, required: true },
  longestWords: [{ type: String, required: true }],
  longestWordsPerParagraph: [ParagraphLongestWordsSchema]
});

const TextSchema: Schema = new Schema<IText>({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  analysis: { type: TextAnalysisSchema, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IText>('Text', TextSchema); 