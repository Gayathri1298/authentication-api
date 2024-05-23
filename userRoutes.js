import { Router } from 'express';
const router = Router();
import { editProfile, getPublicProfiles, getUserProfile } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { check, validationResult } from 'express-validator';

router.put('/edit', [
  check('email', 'Please include a valid email').optional().isEmail(),
  check('password', 'Please enter a password with 6 or more characters').optional().isLength({ min: 6 })
], authMiddleware, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  editProfile(req, res);
});

router.get('/public', getPublicProfiles);
router.get('/:id', authMiddleware, getUserProfile);

export default router;
