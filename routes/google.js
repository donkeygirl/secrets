import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import passport from 'passport';
import passportGoogle from "passport-google-oauth20";
import 'dotenv/config';
import User from '../models/dbModels.js';
const GoogleStrategy = passportGoogle.Strategy;

const app = express()
    .use(express.static('public'))
    .use(express.urlencoded({extended:true}))
    .set('view engine','ejs');

mongoose.set('strictQuery',false);
// GOOGLE Auth strategy
passport.use(new GoogleStrategy(
  {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/secrets"
  },
  function (accessToken, refreshToken, profile, cb) {
      //if interested to check fetched data from googleId which was signed up/in
      // console.log(profile);
      User.findOrCreate({googleId: profile.id, username: profile.emails[0].value }, function (err, user) {
          return cb(err, user);
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return cb(err, user);
    });      
  }
)); 


const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' ,successRedirect:'/secrets'}),
  function(req, res) {
    //Successful authentication, redirect home.
    //res.redirect('/secrets');
  });

export default router;