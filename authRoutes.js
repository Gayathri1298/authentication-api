const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

// Register and login routes
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  authController.register(req, res);
});

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  authController.login(req, res);
});

router.get('/me', passport.authenticate('jwt', { session: false }), authController.getProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
  // Successful authentication, redirect or respond with a JWT token
  const token = authController.generateToken(req.user); // Assuming you have a method to generate a JWT token
  res.redirect(`/success?token=${token}`);
});

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/' }), (req, res) => {
  const token = authController.generateToken(req.user);
  res.redirect(`/success?token=${token}`);
});

// Twitter OAuth
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { session: false, failureRedirect: '/' }), (req, res) => {
  const token = authController.generateToken(req.user);
  res.redirect(`/success?token=${token}`);
});

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/' }), (req, res) => {
  const token = authController.generateToken(req.user);
  res.redirect(`/success?token=${token}`);
});

module.exports = router;
