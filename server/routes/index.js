import express from 'express';
import user from './user';
import crypto from './cryptocurrency'

const route = express.Router();

route.use('/user', user);
route.use('/crypto', crypto);

export default route;