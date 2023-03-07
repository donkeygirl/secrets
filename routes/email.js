import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import passport from 'passport';
import {User,Secret} from '../models/dbModels.js';

const app = express()
    .use(express.static('public'))
    .use(express.urlencoded({extended:true}))
    .set('view engine','ejs');

mongoose.set('strictQuery',false);

const router = express.Router();

router.get('/',function(req, res){
    res.render('home');
});

router.get('/register',function(req, res){        
    res.render('register');
});
router.post('/register',(req, res) =>{
    try{        
        const newUser = new User({
            username:req.body.username
        });                 
        User.register(newUser, req.body.password, function(err, user) {        
            if (err) {                
                console.log(err.message);
                res.redirect('/register');
            }else{
                //res.render('login');
                passport.authenticate("local")(req, res, () => {
                    res.redirect("/login");
                });             
            }
        });       
    }catch{e=>console.log(e.message)} 
}); 

router.get('/login',function(req, res){
    res.render('login');
});
router.post('/login', passport.authenticate('local',{
        successRedirect: "/secrets",
        failureRedirect: "/login"  
    }), 
    function(req, res){    
});

router.get('/secrets', function(req, res){  
    if(req.isAuthenticated()){
        res.render('secrets');
    }else{
        res.redirect('/login');
    }
});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
  });

router.get('/submit',function(req, res){
    //User.
    res.render('submit');
});

export default router;