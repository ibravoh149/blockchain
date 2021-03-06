'use strict'
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
// import { AccessControl } from 'accesscontrol'
import * as dotenv from 'dotenv';
import db from '../models';
import crypto from 'crypto';

import validate from '../middleware/validate';
import grantsObject from '../middleware/roleaccess';

import Helpers from '../helpers';

import Bitcoin from '../coins/Bitcoin';
import Stellar from '../coins/Stellar';

let block_io = require('block_io');

dotenv.config();
const version = 2;

let bitCoin = new block_io(process.env.BITCOIN_API_KEY, process.env.SECRET_PIN, version)

let liteCoin = new block_io(process.env.LITECOIN_API_KEY, process.env.SECRET_PIN, version);

let dogeCoin = new block_io(process.env.DOGECOIN_API_KEY, process.env.SECRET_PIN, version);

let helper = new Helpers();


const nodemailer = require('nodemailer');


class Cryptocurrency {

    static async setupWallet(req, res) {
        const userId = req.user.id;
        const userEmail = req.user.email;
        validate.validateWalletId(req, res);
        const errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({
                message: errors
            });
        }

        const walletId = req.body.walletId;

        try {
            let existingUserWallet = await db.userwallets.findOne({ where: { walletId, userId } });

            if (existingUserWallet) {
                return res.status(409).json({ message: 'This wallet already exists' });
            }

            let userwallet = await db.userwallets.create({ userId, walletId });

            if (userwallet) {
                switch (walletId) {
                    case 1:
                        // bitcoin wallet
                       await bitCoin.get_new_address({ 'label': userEmail }, function (error, data) {
                            if (error) return res.status(409).json({ message: error.message });

                            const addressInfo = {
                                userwalletId: userwallet.id,
                                userId,
                                network: data.data.network,
                                address: data.data.address,
                                label: data.data.label
                            }

                            helper.setupAddressAndBalance(addressInfo);

                            return res.status(201).json({ message: `successfully setup ${data.data.network} wallet` });

                        });

                        break


                    case 2:
                        // litecoint wallet
                        await liteCoin.get_new_address({ 'label': userEmail }, function (error, data) {
                            if (error) return res.status(409).json({ message: error.message });

                            const addressInfo = {
                                userwalletId: userwallet.id,
                                userId,
                                network: data.data.network,
                                address: data.data.address,
                                label: data.data.label
                            }
                            helper.setupAddressAndBalance(addressInfo);

                            return res.status(201).json({ message: `successfully setup ${data.data.network} wallet` });


                        });

                        break

                    case 3:
                        // dogecoin wallet
                        await dogeCoin.get_new_address({ 'label': userEmail }, function (error, data) {
                            if (error) return res.status(409).json({ message: error.message });

                            const addressInfo = {
                                userwalletId: userwallet.id,
                                userId,
                                network: data.data.network,
                                address: data.data.address,
                                label: data.data.label
                            }

                             helper.setupAddressAndBalance(addressInfo);
                            
                            return res.status(201).json({ message: `successfully setup ${data.data.network} wallet` });

                        });
                        break
                }
            }
        } catch (error) {
            console.log(error);
        }

    }


    static async sendMoney(req, res) {
        const userId = req.user.id;
        const userEmail = req.user.email;


        validate.validateSendMoney(req, res);
        const errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({
                message: errors
            });
        }

        try {
            const { amount, userAddress, friendAddress } = req.body;

            const no_limit= await helper.checkWeeklyLimit(userId, userAddress)

            if(no_limit){
                return res.status(403).json({message:"weekly tranfer limit has been exceeded"});
            }

            const addresses = await helper.confirmNetworks(userId, userAddress, friendAddress);

            if (addresses && addresses.userAdd.network === addresses.friendAdd.network) {
                
            //     switch (addresses.friendAdd.network) {
            //             // bitcoin
            //         case 'BTCTEST':
            //             await bitCoin.withdraw_from_addresses({
            //                 'amounts': amount,
            //                 'from_addresses': addresses.userAdd.address,
            //                 'to_addresses': addresses.friendAdd.address
            //             }, function (error, data) {
            //                 if (error) return res.status(403).json({ message: error.message });
            //                 helper.updateWeeklyLimit(userId,  addresses.userAdd.address)
            //                 return res.status(201).json({ data });
            //             })
            //             break

            //         //litecoint
            //         case 'LTCTEST':
            //             await liteCoin.withdraw_from_addresses({
            //                 'amounts': amount,
            //                 'from_addresses': addresses.userAdd.address,
            //                 'to_addresses': addresses.friendAdd.address
            //             }, function (error, data) {
            //                 if (error) return res.status(403).json({ message: error.message });
            //                 helper.updateWeeklyLimit(userId,  addresses.userAdd.address)
            //                 return res.status(201).json({ data })
            //             })
            //             break

            //         //dogecoin
            //         case 'DOGETEST':
            //         await dogeCoin.withdraw_from_addresses({
            //             'amounts': amount,
            //             'from_addresses': addresses.userAdd.address, 
            //             'to_addresses': addresses.friendAdd.address
            //         }, function (error, data) {
            //             if (error) return res.status(403).json({ message: error.message });
            //             helper.updateWeeklyLimit(userId,  addresses.userAdd.address)
            //             return res.status(201).json({ data })
            //         })
            //             break
                // }

                const sendFund = await helper.sendFund(addresses.userAdd.id,addresses.friendAdd.id,amount)

                if(!sendFund){
                    return res.status(403).json({message:"You don't have enough funds to transfer"})
                }

                await helper.updateWeeklyLimit(userId,  addresses.userAdd.address);
                const ref = crypto.randomBytes(20).toString('hex');
                const sentTransactionInfo = {
                    addressId:addresses.userAdd.id,
                    tx_ref:ref,
                    status:'success',
                    type:'sent'
                }
                const receievedTransactionInfo = {
                    addressId:addresses.friendAdd.id,
                    tx_ref:ref,
                    status:'success',
                    type:'received'
                }
                await db.transactions.create(sentTransactionInfo)
                await db.transactions.create(receievedTransactionInfo)
                await helper.sendMail(ref,userEmail);
                return res.status(201).json({message:"transaction successfull"});

            }else{
                return res.status(403).json({ message: "oops, you and the receiver \n must on thesame currency" });
            }


        } catch (error) {
            console.log(error);
        }


    }

    static async getAccountBalance(req, res){
        const userId = req.user.id;
        const userEmail = req.user.email;
        const address = req.params.address;

        try {
            const userAddress = await helper.confirmNetwork(userId, address);
            if(userAddress){
               
                // switch (userAddress.network) {
                    // case 'BTCTEST':
                    //     // await bitCoin.get_address_balance({'addresses': userAddress.address},function(error, data){
                    //     //     if (error) return res.status(403).json({ message: error.message });
                    //     //     helper.updateBalance(userAddress.id, data.data.network, 
                    //     //     data.data.available_balance,
                    //     //     data.data.pending_received_balance);
                    //     //     return res.status(200).json({ data });
                    //     // });

                    //      await db.balance.findOne({where:{address:userAddress.address}});
                        
                    //     break;

                    // case 'LTCTEST':
                    //     await liteCoin.get_address_balance({'addresses': userAddress.address},function(error, data){
                    //         if (error) return res.status(403).json({ message: error.message });
                    //         helper.updateBalance(userAddress.id, data.data.network, 
                    //         data.data.available_balance,
                    //         data.data.pending_received_balance);
                    //         return res.status(200).json({ data })
                    //     });
                    //     break;

                    // case 'DOGETEST':
                    //     await dogeCoin.get_address_balance({'addresses': userAddress.address},function(error, data){
                    //         if (error) return res.status(403).json({ message: error.message });
                    //         helper.updateBalance(userAddress.id, data.data.network, 
                    //         data.data.available_balance,
                    //         data.data.pending_received_balance);
                    //         return res.status(200).json({ data })
                    //     });
                    //     break;
                
                    // default:
                    //     break;
                // }

                let data = await db.balance.findOne({where:{addressId:userAddress.id}});
                return res.status(200).json({ data });

            }else{
                return res.status(404).json({ message: "This address doesn't exists" });
            }
        } catch (error) {
            console.log(error);
        }
    }

    static async checkRecentTransaction(req, res){
        const userId = req.user.id;
        const userEmail = req.user.email;
        const address = req.params.address;
        const limit=  5

        try {
            const userAddress = await helper.confirmNetwork(userId, address);
            if(userAddress){
                // switch (userAddress.network) {
                //     case 'BTCTEST':
                //     await bitCoin.get_transactions({'type': type, 'addresses': userAddress.address},function(error, data){
                //         if (error) return res.status(403).json({ message: error.message });
                //         return res.status(200).json({ data:data.data });
                //     });
                //     break;
                    
                //     case 'LTCTEST':
                //     await liteCoin.get_transactions({'type': type, 'addresses': userAddress.address},function(error, data){
                //         if (error) return res.status(403).json({ message: error.message });
                //         return res.status(200).json({ data:data.data });
                //     });
                //     break
                //     case 'DOGETEST':
                //     await dogeCoin.get_transactions({'type': type, 'addresses': userAddress.address},function(error, data){
                //         if (error) return res.status(403).json({ message: error.message });
                //         return res.status(200).json({ data:data.data });
                //     });
                //     break
                //     default:
                //         break;
                // }

                let data = await db.transactions.findAll({where:{addressId:userAddress.id},
                    limit
                });

                if(data.length<1){
                    return res.status(404).json({message:"No recent transaction"})
                }

                return res.status(200).json({data})
                
            }else{
                return res.status(404).json({ message: "This address doesn't exists" });
            }
            
        } catch (error) {
            console.log(error)
        }

    }

    
    
}

export default Cryptocurrency