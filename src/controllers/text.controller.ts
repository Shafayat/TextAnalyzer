import { Request, Response, NextFunction } from 'express';
import Text from '../models/Text';
import { analyzeText } from '../services/textAnalysis.service';


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