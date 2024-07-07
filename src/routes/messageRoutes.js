import express from 'express';
import { receiveWhatsappMessage } from '../controllers/messageController.js';

const router = express.Router();

router.post('/receive', receiveWhatsappMessage);

export default router;