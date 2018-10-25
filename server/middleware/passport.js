import { ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';
import passport from 'passport';
import db from '../models';

const JwtStrategy = require('passport-jwt').Strategy;

dotenv.config();

const secretKey = process.env.JWT_SECRET;

// jwt strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey:secretKey 
}, (payload, done)=>{
    //get the user from token 
  return db.users.findById(payload.sub) 
    .then((user)=>{
        //return false if user not found
        if(!user){
            return done(null, false);
        }
        //return user if found
      
        return done(null, user);
    })
    .catch((error)=>{
       return done(error, false)
    });
}));
