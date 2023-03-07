import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import passport from 'passport';
import GitHubStrategy from "passport-github2";
import 'dotenv/config';
import User from '../models/dbModels.js';


const app = express()
    .use(express.static('public'))
    .use(express.urlencoded({extended:true}))
    .set('view engine','ejs');

mongoose.set('strictQuery',false);
//GITHUB Auth strategy
    
    passport.use(new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://127.0.0.1:8080/auth/github/secrets",
        },
        function (accessToken, refreshToken, profile, done) {           
            User.findOrCreate({ githubId: profile.id, username: profile.username}, function (err, user) {
                return done(err, user);
            });
        }
    ));
    

const router = express.Router();

router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/secrets', passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
});

export default router;

