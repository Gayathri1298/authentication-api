import { verify } from 'jsonwebtoken';
import { findById } from '../models/User';

export default async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    const user = await findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (!user.isPublic && !req.user.isAdmin && req.user.id !== user.id.toString()) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
