'use strict'
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
// import { AccessControl } from 'accesscontrol'
import * as dotenv from 'dotenv';
import db from '../models';
import crypto from 'crypto';

import validate from '../middleware/validate';
// import grantsObject from '../middleware/roleaccess';
import axios from 'axios';

import request from 'request';




import Helpers from '../helpers';

import Bitcoin from '../coins/Bitcoin';

import Stellar from '../coins/Stellar';

const StellarSDK = require('stellar-sdk');

const bitcoin = require('bitcoinjs-lib');

let block_io = require('block_io');

dotenv.config();
const version = 2;

let bitCoin = new block_io(process.env.BITCOIN_API_KEY, process.env.SECRET_PIN, version)
let bit= new Bitcoin();



const nodemailer = require('nodemailer');

let helper = new Helpers();

dotenv.config();

class Cryptocurrency {


    static async sendMoney(req, res){
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

            const still_in_limit= await helper.checkTransactionLimit(userAddress,userId, amount)

            if(!still_in_limit){
                return res.status(403).json({message:"daily tranfer limit has been exceeded"});
            }

            const addresses = await helper.confirmNetworks(userId, userAddress, friendAddress);

            if (addresses && addresses.userAdd.network === addresses.friendAdd.network) {
                
                switch (addresses.friendAdd.network) {
                        // bitcoin
                    case 'BTC':
                        var WIF = addresses.userAdd.privateKey;
                        var testnet = bitcoin.networks.testnet
                        var keyPairSpend = bitcoin.ECPair.fromWIF(WIF, testnet);
                       
                        bit.getUnspentTransactions(addresses.userAdd.address)
                            .then((unspentTransactions) => {
                              const unspent = unspentTransactions[0]

                              const change = unspent.value_int - amount
                              const tx = new bitcoin.TransactionBuilder(testnet)
                              tx.addInput(unspent.txid, unspent.n)
                              tx.addOutput(addresses.friendAdd.address, amount)
                              tx.addOutput(addresses.userAdd.address, change)
                
                              tx.sign(0, keyPairSpend)
                
                        
                              let txhex= tx.build().toHex()
                            
                               
                               const url = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'
                               const params = { hex: txhex }
                               axios.post(url, params)
                               .then((response)=>{
                                   
                                var txInfo={
                                    userId:userId,
                                    addressId:addresses.userAdd.id,
                                    transaction_amount:amount
                                }
                                db.transactions.create(txInfo)
                                helper.sendMail(userEmail);

                                    res.status(201).json({message:'Transaction successful'})
                               })
                               .catch((error)=>{
                                   console.log(error)
                               })
                
                            }).catch((error)=>{
                                console.log(error.data)
                            })
                       
                        break

                    //stellar
                    case 'STL':
                    var sourceSecretKey = addresses.userAdd.privateKey;


                    var sourceKeypair = StellarSDK.Keypair.fromSecret(sourceSecretKey);
                    var sourcePublicKey = sourceKeypair.publicKey();
                    
                    var receiverPublicKey = addresses.friendAdd.address;
                    
                    var server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
                    StellarSDK.Network.useTestNetwork();
                    
                    server.loadAccount(sourcePublicKey)
                      .then(function(account) {
                        var transaction = new StellarSDK.TransactionBuilder(account)
                          .addOperation(StellarSDK.Operation.payment({
                            destination: receiverPublicKey,
                            asset: StellarSDK.Asset.native(),
                            amount: amount,
                          }))
                          .build();
                    
                        
                        transaction.sign(sourceKeypair);
                    
                        console.log(transaction.toEnvelope().toXDR('base64'));
                    
                         server.submitTransaction(transaction)
                          .then(function(transactionResult) {
                            console.log(JSON.stringify(transactionResult, null, 2));
                            console.log('\nSuccess! View the transaction at: ');
                            console.log(transactionResult._links.transaction.href);

                            var txInfo={
                                userId:userId,
                                addressId:addresses.userAdd.id,
                                transaction_amount:amount
                            }
                            db.transactions.create(txInfo)
                            helper.sendMail(userEmail);

                            res.status(201).json({message:'Transaction successful'})
                           
                          })
                          .catch(function(err) {
                            console.log('An error has occured:');
                            console.log(err);
                          });
                      })
                      .catch(function(e) {
                        console.error(e);
                      });
                    
                   
                    
                        break
                }

               
            }else{
                return res.status(403).json({ message: "oops, you and the receiver \n must on thesame currency" });
            }


        } catch (error) {
            console.log(error);
        }

    }

    static async getAccountBalance(req, res) {
        const userId = req.user.id;
        // const userEmail = req.user.email;
        const address = req.params.address;

        try {
            const userAddress = await helper.confirmNetwork(userId, address);
            if (userAddress) {

                switch (userAddress.network) {
                    case 'BTC':

                        return axios.get('https://api.blockcypher.com/v1/btc/test3/addrs/' + address + '/balance')
                            .then((response) => {
                                helper.updateBalance(userAddress.id,
                                    response.data.final_balance);

                                const data = {
                                    available_balance: response.data.final_balance,
                                    // total_sent: response.data.total_sent
                                }

                                return res.status(200).json({ data })

                            })
                            .catch((error) => {
                                console.log(error)
                            })




                    case 'STL':
                        var server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
                        server.loadAccount(address).then(function (account) {
                            let balances=[];
                            account.balances.forEach(function (balance) {
                                
                                helper.updateBalance(userAddress.id,
                                    balance.balance);

                                    balances.push({available_balance:balance.balance})

                            });
                            // var data={
                            //     available_balance:account.balances[0].balance
                            // }

                            return res.status(200).json({ data:balances });
                            
                        });
                        

                  
                }

            } else {
                return res.status(404).json({ message: "This address doesn't exists" });
            }
        } catch (error) {
            console.log(error);
        }
    }

    static async getTransactions(req, res){
        const userId = req.user.id;
        const address = req.params.address;
        const type = req.params.type;


        try {
            const userAddress = await helper.confirmNetwork(userId, address);
            if(userAddress){
                switch (userAddress.network) {
                    case 'BTC':
                    await bitCoin.get_transactions({'type': type, 'addresses': userAddress.address},function(error, data){
                        if (error) return res.status(403).json({ message: error.message });
                        
                        return res.status(200).json({ data:data.data });
                    });
                    break;
                    
                    case 'STL':
                    var server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
                    var account = userAddress.address;
                    
                    server.transactions()
                        .forAccount(account)
                        .call()
                        .then(function (page) {
                            
                        return res.status(200).json({ data:page.records });

                            // return page.next();
                        })
                        
                        .catch(function (err) {
                            console.log(err);
                        });
                    
                    break
                    default:
                        break;
                }
                
            }else{
                return res.status(404).json({ message: "This address doesn't exists" });
            }
            
        } catch (error) {
            console.log(error)
        }

    }
}

export default Cryptocurrency