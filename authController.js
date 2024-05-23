import { genSalt, hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User, { findOne, findById } from '../models/User';

export async function register(req, res) {
  const { name, email, password } = req.body;
  try {
    let user = await findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    const salt = await genSalt(10);
    user.password = await hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
}

export async function getProfile(req, res) {
  try {
    const user = await findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
}
