'use strict'
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// import { AccessControl } from 'accesscontrol'
import * as dotenv from 'dotenv';
import db from '../models';
import validate from '../middleware/validate';

import Bitcoin from '../coins/Bitcoin';

import Stellar from '../coins/Stellar';

import Helpers from '../helpers';

// import grantsObject from '../middleware/roleaccess';

const nodemailer = require('nodemailer');


const secretKey = process.env.JWT_SECRET;
const expireIn = Number(process.env.JWT_EXP);
const helper = new Helpers();

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

            
           let account = await helper.setupAccount(user.id);

           if(!account){
                return res.status(502).json({message:'Bad request'});
           }

            const token = jwt.sign({
                sub: user.id,
                email: user.email,
            }, secretKey,{expiresIn:expireIn});

            return res.status(201).json({user,token});
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
                return res.status(403).json({message:"you cannot add yourself as a friend"});                  
            }
            else{
               const existingFriend = await helper.checkExistingFriend(userId, friendId)
                if(!existingFriend){
                    await db.friends.create({userId, friendId});
                    // await db.friends.create({friendId, userId});
                    return res.status(201).json({message:`${username} has been added to your friends list`});                  
                }
                return res.status(409).json({message:"This person is already a friend"});                  
            }


        } catch (error) {
            console.log(error);
        }
    }

    static async getFriends(req, res){
        const userId= req.user.id;

        try {
            let friendIds = await db.friends.findAll({where:{userId},
                attributes:['friendId']
            });

            if (friendIds.length>0){
                let ids=[];

                friendIds.map((friendId)=>{
                    ids.push(friendId.friendId)
                });


                const friends  = await db.users.findAll({
                    where:{id:[...ids]},
                    include:[
                        { model:db.userwallets, attributes:['id'], include:[{model:db.wallets, attributes:['name']}]},
                        { model:db.address, as:'address', attributes:['network','address']}
                    ]
                });

                // return console.log(friends);


                return res.status(200).json({friends})
            }
            return res.status(404).json({message:"your friend list is empty"});
        } catch (error) {
            console.log(error);
            
        }
    }

    static async getMyProfile(req, res){
        const id= req.user.id;

        try {
            let userInfo = await db.users.findOne({where:{id},
                include:[
                    { model:db.userwallets, attributes:['id'], include:[{model:db.wallets, attributes:['name']}]},
                    { model:db.address, as:'address', attributes:['network','address','weekly_limit']}
                ]
            });
            return res.status(200).json({userInfo});
        } catch (error) {
            console.log(error);
            
        }

    }
}
export default User;