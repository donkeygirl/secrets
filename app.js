import express from "express";
import ejs from "ejs";
import 'dotenv/config';
import passport from 'passport';
import session from 'express-session';
import mongoose from "mongoose";
import localRoute from "./routes/local.js"
import googleRoute from "./routes/google.js"
import githubRoute from "./routes/github.js"
import User from './models/dbModels.js';
const mongoose_url = 'mongodb://127.0.0.1:27017/userDB';
const HTTP_PORT = 8080;

const app = express()
    .use(express.static('public'))
    .use(express.urlencoded({extended:true}))
    .set('view engine','ejs')      
    .use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    }))
    .use(passport.initialize())
    .use(passport.session());
    //session, put before mongoose.connect
mongoose.set('strictQuery', false);

useMongoose().then(()=>{
    app.listen(HTTP_PORT,()=>{
        console.log('Server started on port '+HTTP_PORT);
    })
}).catch(err=>console.log(err));
async function useMongoose(){    
    //database
    await mongoose.connect(mongoose_url);
    //cookies
    passport.use(User.createStrategy());
    let user_cache = {};  
    passport.serializeUser(function(user, next) {
        let id = user._id;
        user_cache[id] = user;
        next(null, id);
    });
    passport.deserializeUser(function(id, next) {
        next(null, user_cache[id]);
    });
    /* 
    passport.serializeUser(function (user, cb) {        
        process.nextTick(function () {
        cb(null, { id: user._id});
    });
    });
    passport.deserializeUser(function (user, cb) {        
        process.nextTick(function () {
            return cb(null, user);
        });
    });
    */
    
 
    //routers
    app.use('/', localRoute);
    app.use('/', googleRoute);
    app.use('/', githubRoute);
    
    app.all('*', (req, res) => {
        res.status(404).send('<h1>404! Page not found</h1>');
    });
}
