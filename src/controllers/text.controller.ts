import { Request, Response, NextFunction } from 'express';
import Text from '../models/Text';
import { analyzeText, getWordCount, getCharacterCount, getSentenceCount, getParagraphCount, getLongestWordsByParagraph } from '../services/textAnalysis.service';

/**
 * Creates a new text entry for the authenticated user.
 * 
 * Expects a JSON body with a 'content' field containing the text to be analyzed and stored.
 * Requires the user to be authenticated.
 * 
 * Response:
 * 201 Created: Returns the created text entry with its ID, content, analysis, and creation date.
 * 400 Bad Request: If 'content' is missing or not a string.
 * 401 Unauthorized: If the user is not authenticated.
 */
export const createText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Content is required and must be a string' });
    }
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Analyze the text
    const analysis = analyzeText(content);
    
    // Create the text entry
    const text = await Text.create({
      content,
      user: (req.user as any)._id,
      analysis
    });
    
    return res.status(201).json({
      _id: text._id,
      content: text.content,
      analysis: text.analysis,
      createdAt: text.createdAt
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Analyzes the provided text content and returns the number of words.
 * 
 * Expects a JSON body with a 'content' field containing the text to analyze.
 * Requires the user to be authenticated.
 * 
 * Response:
 * 200 OK: Returns the original content, the word count, and an analysis object.
 * 400 Bad Request: If 'content' is missing or not a string.
 * 401 Unauthorized: If the user is not authenticated.
 */
export const getWordCountAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Content is required and must be a string' });
    }
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const wordCount = getWordCount(content);
    
    return res.status(200).json({
      content,
      wordCount,
      analysis: { wordCount }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Analyzes the provided text content and returns the number of characters.
 * 
 * Expects a JSON body with a 'content' field containing the text to analyze.
 * Requires the user to be authenticated.
 * 
 * Response:
 * 200 OK: Returns the original content, the character count, and an analysis object.
 * 400 Bad Request: If 'content' is missing or not a string.
 * 401 Unauthorized: If the user is not authenticated.
 */
export const getCharacterCountAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Content is required and must be a string' });
    }
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const characterCount = getCharacterCount(content);
    
    return res.status(200).json({
      content,
      characterCount,
      analysis: { characterCount }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Analyzes the provided text content and returns the number of sentences.
 * 
 * Expects a JSON body with a 'content' field containing the text to analyze.
 * Requires the user to be authenticated.
 * 
 * Response:
 * 200 OK: Returns the original content, the sentence count, and an analysis object.
 * 400 Bad Request: If 'content' is missing or not a string.
 * 401 Unauthorized: If the user is not authenticated.
 */
export const getSentenceCountAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Content is required and must be a string' });
    }
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const sentenceCount = getSentenceCount(content);
    
    return res.status(200).json({
      content,
      sentenceCount,
      analysis: { sentenceCount }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Analyzes the provided text content and returns the number of paragraphs.
 * 
 * Expects a JSON body with a 'content' field containing the text to analyze.
 * Requires the user to be authenticated.
 * 
 * Response:
 * 200 OK: Returns the original content, the paragraph count, and an analysis object.
 * 400 Bad Request: If 'content' is missing or not a string.
 * 401 Unauthorized: If the user is not authenticated.
 */
export const getParagraphCountAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Content is required and must be a string' });
    }
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const paragraphCount = getParagraphCount(content);
    
    return res.status(200).json({
      content,
      paragraphCount,
      analysis: { paragraphCount }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Analyzes the provided text content and returns the longest word(s) from each paragraph.
 * 
 * Expects a JSON body with a 'content' field containing the text to analyze.
 * Requires the user to be authenticated.
 * 
 * Response:
 * 200 OK: Returns the original content, the longest words by paragraph, and an analysis object.
 * 400 Bad Request: If 'content' is missing or not a string.
 * 401 Unauthorized: If the user is not authenticated.
 */
export const getLongestWordsByParagraphAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Content is required and must be a string' });
    }
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const longestWordsByParagraph = getLongestWordsByParagraph(content);
    
    return res.status(200).json({
      content,
      longestWordsByParagraph,
      analysis: { longestWordsByParagraph }
    });
  } catch (err) {
    next(err);
  }
}; 