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

/**
 * Updates a text document's content and analysis for the authenticated user.
 *
 * Required:
 * - Authentication: User must be logged in (req.user).
 * - Path parameter: req.params.id (string) - The ID of the text document to update.
 * - Body: { content: string }
 *
 * Response:
 * 200 OK: Returns the updated text document.
 * 400 Bad Request: If content is missing or not a string.
 * 401 Unauthorized: If the user is not authenticated.
 * 404 Not Found: If the text document does not exist or does not belong to the user.
 */
export const updateText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Content is required and must be a string' });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const userId = (req.user as any)._id;
    const text = await Text.findOne({ _id: req.params.id, user: userId });
    if (!text) {
      return res.status(404).json({ message: 'Text not found' });
    }
    text.content = content;
    text.analysis = analyzeText(content);
    await text.save();
    res.status(200).json({
      _id: text._id,
      content: text.content,
      analysis: text.analysis,
      createdAt: text.createdAt,
      updatedAt: text.updatedAt
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Lists the texts for the authenticated user with pagination.
 *
 * Required query parameters in req.query:
 * - page (optional, number): The page number to retrieve (default: 1).
 * - limit (optional, number): The number of items per page (default: 10, max: 50).
 *
 * Authentication:
 * - Requires the user to be authenticated.
 *
 * Response:
 * 200 OK: Returns an object with texts, total count, current page, and page count.
 * 401 Unauthorized: If the user is not authenticated.
 */
export const listTexts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    const userId = (req.user as any)._id;
    const [texts, total] = await Promise.all([
      Text.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id content createdAt')
        .lean(),
      Text.countDocuments({ user: userId })
    ]);
    res.json({
      texts,
      total,
      page,
      pageCount: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a single text document by its ID for the authenticated user.
 *
 * Required:
 * - Authentication: User must be logged in (req.user).
 * - Path parameter: req.params.id (string) - The ID of the text document to retrieve.
 *
 * Response:
 * 200 OK: Returns the text document if found and owned by the user.
 * 401 Unauthorized: If the user is not authenticated.
 * 404 Not Found: If the text document does not exist or does not belong to the user.
 */
export const getTextById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any)._id;
    const text = await Text.findOne({ _id: req.params.id, user: userId }).lean();
    if (!text) {
      return res.status(404).json({ message: 'Text not found' });
    }
    res.json(text);
  } catch (err) {
    next(err);
  }
}; 

/**
 * Deletes a text document for the authenticated user.
 *
 * Required:
 * - Authentication: User must be logged in (req.user).
 * - Path parameter: req.params.id (string) - The ID of the text document to delete.
 *
 * Response:
 * 204 No Content: If deleted successfully.
 * 401 Unauthorized: If the user is not authenticated.
 * 404 Not Found: If the text document does not exist or does not belong to the user.
 */
export const deleteText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const userId = (req.user as any)._id;
    const result = await Text.deleteOne({ _id: req.params.id, user: userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Text not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 