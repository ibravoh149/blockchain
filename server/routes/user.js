import express from 'express';

import passport from 'passport';

import { User } from '../controllers';


const router = express.Router();

router.post('/create', User.createAccount);
router.post('/login', User.login);
router.post('/add-friend', passport.authenticate('jwt', {session:false}), User.addFriends);
router.get('/get-friends', passport.authenticate('jwt', {session:false}), User.getFriends);
router.get('/get-my-profile', passport.authenticate('jwt', {session:false}), User.getMyProfile);


export default router;