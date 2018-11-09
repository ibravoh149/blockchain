import express from 'express';

import passport from 'passport';

import { Cryptocurrency } from '../controllers';

const passportConfg = require('../middleware/passport');


const router = express.Router();

// router.post('/setup-wallet',Cryptocurrency.genAddress);
// router.post('/setup-wallet', passport.authenticate('jwt', {session:false}), Cryptocurrency.setupWallet);
router.post('/send-fund', passport.authenticate('jwt', {session:false}), Cryptocurrency.sendMoney);
router.get('/get-balance/:address', passport.authenticate('jwt', {session:false}), Cryptocurrency.getAccountBalance);
// router.get('/recent-transactions/:address', Cryptocurrency.getTransaction);
router.get('/recent-transactions/:address/:type', passport.authenticate('jwt', {session:false}), Cryptocurrency.getTransactions);
// router.get('/accounts', Cryptocurrency.getAccounts);
// router.get('/accouns', passport.authenticate('jwt', {session:false}), Cryptocurrency.checkRecentTransaction);


export default router;