import { use, serializeUser, deserializeUser } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User, { findOne, findById } from '../models/User';

use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await findOne({ providerId: profile.id });
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: 'google',
        providerId: profile.id
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
}));

use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await findOne({ providerId: profile.id });
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: 'facebook',
          providerId: profile.id
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }));


  use(new TwitterStrategy({
    clientID: process.env.TWITTER_CONSUMER_KEY,
    clientSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: '/auth/twitter/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await findOne({ providerId: profile.id });
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: 'twitter',
          providerId: profile.id
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }));

  use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await findOne({ providerId: profile.id });
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: 'github',
          providerId: profile.id
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }));


serializeUser((user, done) => {
  done(null, user.id);
});
deserializeUser((id, done) => {
  findById(id, (err, user) => {
    done(err, user);
  });
});
