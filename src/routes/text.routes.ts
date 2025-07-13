import { Router } from 'express';
import { 
  createText, 
  getWordCountAnalysis, 
  getCharacterCountAnalysis, 
  getSentenceCountAnalysis, 
  getParagraphCountAnalysis, 
  getLongestWordsByParagraphAnalysis 
} from '../controllers/text.controller';

const router = Router();

router.post('/texts', createText);
router.post('/analyze/word-count', getWordCountAnalysis);
router.post('/analyze/character-count', getCharacterCountAnalysis);
router.post('/analyze/sentence-count', getSentenceCountAnalysis);
router.post('/analyze/paragraph-count', getParagraphCountAnalysis);
router.post('/analyze/longest-words-by-paragraph', getLongestWordsByParagraphAnalysis);

export default router; 