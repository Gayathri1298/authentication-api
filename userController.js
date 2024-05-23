import { findById, find } from '../models/User';

export async function editProfile(req, res) {
  const { name, photo, bio, phone, email, password, isPublic } = req.body;
  try {
    let user = await findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (name) user.name = name;
    if (photo) user.photo = photo;
    if (bio) user.bio = bio;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    user.isPublic = isPublic !== undefined ? isPublic : user.isPublic;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
}

export async function getPublicProfiles(req, res) {
  try {
    const users = await find({ isPublic: true }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
}

export async function getUserProfile(req, res) {
  try {
    const user = await findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!user.isPublic && !req.user.isAdmin && req.user.id !== user.id.toString()) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
}
