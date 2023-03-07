import mongoose from "mongoose";
import passport from 'passport';
import passportLocal from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';
import findOrCreate from 'mongoose-findorcreate';
const {Schema} = mongoose;
//import 'dotenv/config';
mongoose.set('strictQuery', false);

// const secretSchema = new Schema({
//     secret:String
// });
// const Secret = mongoose.model('Secret', secretSchema);

const userSchema = new Schema({
    email:String,
    // {
    //     type:String,
    //     unique:true,
    //     required:true,
    //     dropDups: true
    // },
    googleId: String,
    githubId: String,
    secret:String
    //secret:[secretSchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

//export {User,Secret};
export default User;