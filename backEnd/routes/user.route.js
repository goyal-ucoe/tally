const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const {GOOGLE_CONFIG, FACEBOOK_CONFIG} = require('./strategyConfig');
// const mongoose = require('mongoose');
// const md5 = require('md5');
// const bcrypt = require('bcrypt');
// const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const authController = require('./auth.Controller');
//const cors = require('cors');

router.use(passport.initialize());
router.use(passport.session());
// router.use(session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false
// }));
//router.use(cors());
passport.authenticate();
passport.use(User.createStrategy());


// Google Strategy
// Configure the Google strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new GoogleStrategy(
    GOOGLE_CONFIG,
    (accessToken, refreshToken, profile, cb) => {

      console.log('Profile --> ',profile);
      
      // create or upsert record
      const StrategyId = 'googleId';
      const displayName = profile['displayName'];
      const index = displayName.indexOf(' ');
      const firstName = displayName.substring(0,index);
      const lastName = displayName.substring(index + 1, displayName.length);
      const email = profile['emails'][0].value;
      const email_verified = profile['emails'][0].verified;

      const userObj = {
        email: email,
        name: displayName,
        firstName: firstName,
        lastName: lastName,
        email_verified: email_verified
      };

      // In this example, the user's Google profile is supplied as the user
      // record.  In a production-quality application, the Google profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      authController.upsertUserRecord(accessToken, refreshToken, profile, cb, StrategyId, userObj);
       
    }
  )
);


// // Facebook Strategy
// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new FacebookStrategy(
    FACEBOOK_CONFIG,
    (accessToken, refreshToken, profile, cb) => {

      console.log('Profile --> ',profile);

      const StrategyId = 'facebookId';
      const displayName = profile['displayName'];
      const index = displayName.indexOf(' ');
      const firstName = displayName.substring(0,index);
      const lastName = displayName.substring(index + 1, displayName.length);
      const email = profile['emails'][0].value;

      const userObj = {
        email: email,
        name: displayName,
        firstName: firstName,
        lastName: lastName
      };

      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      authController.upsertUserRecord(accessToken, refreshToken, profile, cb, StrategyId, userObj);
    }
  )
);


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser((user, done) => {
  // if(user._id){
  //   done(null, user);
  // }else{
    done(null, user);
  // }
    
});
passport.deserializeUser((user,done)=>{
    done(null, user);
})


// Setting up the passport middleware for each of the OAuth providers
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login' });
const facebookAuth = passport.authenticate('facebook', { scope: ['email'] });
const facebookAuthCallback = passport.authenticate('facebook', { failureRedirect: '/login' });


router.route('/')
    .get((req, res) => {
        console.log('isAuthenticated --> ',req.isAuthenticated());
        if(req.isAuthenticated()){
            res.send('Successfully Authenticated');
        } else {
            res.send(null);
        }
    });



router.route('/auth/google').get(
  googleAuth
);

 
router.route('/auth/google/secrets').get(
  googleAuthCallback, authController.google
);



router.route('/auth/facebook').get(
  facebookAuth
);

router.route('/auth/facebook/callback').get(
  facebookAuthCallback, authController.facebook
);

router.route('/register')
.get((req, res) => {
  res.render('register');
})
.post((req, res)=>{
 console.log('User --> ', req.body);
  const user = req.body;
  user['name'] = user.firstName + (user.lastName && ' ' + user.lastName) ;
  User.register({
      name : user['name'],
      firstName : user.firstName, 
      email : user.email,
      active: true
  }, user.password, (err, user) => {
    if(err){
      console.log('Error --> ', err);
      res.redirect('/');
    }else{
      // var authenticate = User.authenticate();
      // console.log('authenticate --> ', authenticate);
        // passport.authenticate('local', function(err, result) {
        //   console.log('Error --> ', err);
        //   console.log('result --> ', result);
        //   res.redirect('/');
        // });
      passport.authenticate('local')(req, res, () => {
        res.redirect('/');
      });
    }
  });

});

 
// router.route('/').get((req, res) => {
//     User.find()
//         .then(users => res.json(users))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route('/add').post((req, res) => {
//     console.log('On add Request -->', JSON.stringify(req.body));
//     const name = req.body.firstName + (req.body.lastName && req.body.lastName);
//     const newUser = new User({
//         name
//     });

//     newUser.save()
//     .then(() => res.json('User added!'))
//     .catch(err => res.status(400).json('Error: ' + err));

// });

module.exports = router;
