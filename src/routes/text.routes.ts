import { Router } from 'express';
import { createText } from '../controllers/text.controller';

const router = Router();

router.post('/texts', createText);

export default router; 