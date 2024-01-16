import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import articles  from './article'
import users  from './user'
import images  from './images'

const router = express.Router();

router.use('/articles', articles);
router.use('/users', users);
router.use('/images', images);

export default router;
