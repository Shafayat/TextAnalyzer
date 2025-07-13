import { Request, Response, NextFunction, Router } from 'express';
import { 
  createText, 
  getWordCountAnalysis, 
  getCharacterCountAnalysis, 
  getSentenceCountAnalysis, 
  getParagraphCountAnalysis, 
  getLongestWordsByParagraphAnalysis, 
  listTexts, 
  getTextById, 
  updateText, 
  deleteText
} from '../controllers/text.controller';

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.user) return next();
  res.status(401).json({ message: 'Authentication required' });
}

const router = Router();

router.post('/texts', ensureAuthenticated, createText);
router.get('/texts', ensureAuthenticated, listTexts);
router.get('/texts/:id', ensureAuthenticated, getTextById);
router.put('/texts/:id', ensureAuthenticated, updateText);
router.delete('/texts/:id', ensureAuthenticated, deleteText);
router.post('/analyze/word-count', ensureAuthenticated, getWordCountAnalysis);
router.post('/analyze/character-count', ensureAuthenticated, getCharacterCountAnalysis);
router.post('/analyze/sentence-count', ensureAuthenticated, getSentenceCountAnalysis);
router.post('/analyze/paragraph-count', ensureAuthenticated, getParagraphCountAnalysis);
router.post('/analyze/longest-words-by-paragraph', ensureAuthenticated, getLongestWordsByParagraphAnalysis);

export default router; 