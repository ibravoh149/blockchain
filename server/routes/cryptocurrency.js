import express from 'express';

import passport from 'passport';

import { Cryptocurrency } from '../controllers';
const passportConfg = require('../middleware/passport');


const router = express.Router();

router.post('/setup-wallet', passport.authenticate('jwt', {session:false}), Cryptocurrency.setupWallet);
router.post('/send-fund', passport.authenticate('jwt', {session:false}), Cryptocurrency.sendMoney);


export default router;