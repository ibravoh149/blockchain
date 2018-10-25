'use strict'
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
// import { AccessControl } from 'accesscontrol'
import * as dotenv from 'dotenv';
import db from '../models';
import validate from '../middleware/validate';
import Helpers from '../helpers';

import grantsObject from '../middleware/roleaccess';

const nodemailer = require('nodemailer');

import crypto from 'crypto';

const secretKey = process.env.JWT_SECRET;
const expireIn = Number(process.env.JWT_EXP);


class User {
   static async createAccount(req, res){

    validate.validateSignup(req, res);
        const errors = req.validationErrors();
        if (errors) {
            res.status(400).json({
                message: errors
            });
            return;
        }

       try {
        const { body: { username, email, password } } = req;

        let existingUser = await db.users.findOne({where:{email}});
        if(existingUser){
            return res.status(409).json({message:`user with email ${email} already exists`});
        }
        else{
            const salt = bcrypt.genSaltSync(8);
            let user = await db.users.create({
                username, email, password: bcrypt.hashSync(password, salt),
            });

            return res.status(201).json({user});
        }

       } catch (error) {
           console.log(error)
       }
        
    }

    static async login(req, res){
        validate.validateLogin(req, res);
        const errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({
                message: errors
            });
        }

        try {
            const { email, password } = req.body;
            let user = await db.users.findOne({where:{email}});
            if (user && password
                && validate.comparePassword(password, user.password)
            ) {
                
                const token = jwt.sign({
                    sub: user.id,
                    email: user.email,
                }, secretKey,{expiresIn:expireIn});

                return res.status(200).json({
                    token,
                    user
                });
            }else {
                res.status(401).json({
                    message: 'Email or Password Incorrect'
                });
            }
        } catch (error) {
           console.log(error)
            
        }
    }

    static async addFriends(req, res){
        const userId= req.user.id;
        validate.validateAddfriend(req, res);
        const errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({
                message: errors
            });
        }

        try {
            const username  = req.body.username;
            let helper = new Helpers();
            let friendId = await helper.getFriendId(username);
            if(friendId === null){
                return res.status(404).json({message:"This user does not exists in the database"});
            }else if(friendId !== null && friendId === userId){
                return res.status(401).json({message:"you cannot add yourself as a friend"});                  
            }
            else{
               const existingFriend = await helper.checkExistingFriend(userId, friendId)
                if(!existingFriend){
                    await db.friends.create({userId, friendId});
                    return res.status(201).json({message:`${username} has been added to your friends list`});                  
                }
                return res.status(409).json({message:"This person is already a friend"});                  
            }


        } catch (error) {
            console.log(error);
        }
    }
}
export default User;