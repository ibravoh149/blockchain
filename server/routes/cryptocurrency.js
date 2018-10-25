import express from 'express';

import passport from 'passport';

import { Cryptocurrency } from '../controllers';
const passportConfg = require('../middleware/passport');


const router = express.Router();

router.post('/setup-wallet', passport.authenticate('jwt', {session:false}), Cryptocurrency.setupWallet);
router.post('/send-fund', passport.authenticate('jwt', {session:false}), Cryptocurrency.sendMoney);
router.get('/get-balance/:address', passport.authenticate('jwt', {session:false}), Cryptocurrency.getAccountBalance);


export default router;