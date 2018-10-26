import * as dotenv from 'dotenv';

import db from './models';

const block_io = require('block_io');
const nodemailer = require('nodemailer');

dotenv.config();

const version = 2;

let bitCoin = new block_io(process.env.BITCOIN_API_KEY, process.env.SECRET_PIN, version);

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_SMTP_USERNAME,
        pass: process.env.MAILTRAP_SMTP_PASSWORD
    }
  });

class Helpers {
    constructor() {
        this.userId = null
        this.getUserId = this.getUserId.bind(this);
        this.getFriendId = this.getFriendId.bind(this);
        this.checkExistingFriend = this.checkExistingFriend.bind(this);
        this.confirmNetworks = this.confirmNetworks.bind(this);
        this.confirmNetwork = this.confirmNetwork.bind(this);
        this.updateBalance = this.updateBalance.bind(this);
        this.checkWeeklyLimit = this.checkWeeklyLimit.bind(this);
        this.updateWeeklyLimit = this.updateWeeklyLimit.bind(this);
        this.resetWeeklyLimit = this.resetWeeklyLimit.bind(this);
        this.sendMail=this.sendMail.bind(this);
        this.sendFund= this.sendFund.bind(this);
        this.setupBalance=this.setupBalance.bind(this);
        this.setupAddressAndBalance=this.setupAddressAndBalance.bind(this);
    }


    async getFriendId(username) {
        let userId = await db.users.findOne({ where: { username } });
        if (!userId) return null;
        return this.userId = userId.id;
        // this.getUserId()
    }

    async checkExistingFriend(user, id) {
        let userId = await db.friends.findOne({ where: { userId: user, friendId: id } });
        if (!userId) return false;
        return true;
        // this.getUserId()
    }

    getUserId() {
        return this.userId;
    }

    async setupAddressAndBalance(addressInfo){

        try {
        let createdAddress = await db.address.create(addressInfo);
            if(createdAddress){
                const balanceInfo={
                    addressId:createdAddress.id,
                    network:createdAddress.network,
                    available_balance:0,
                    pending_received_balance:0
                    }
                    await db.balance.create(balanceInfo);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async setupBalance(info){
        let balance= await db.balance.create(info);
        return balance
    }

    async sendFund(userAddressId, friendAddressId, amount){
       let getBalance = await db.balance.findOne({where:{addressId:userAddressId}});
        if(getBalance.available_balance < 0 || getBalance.available_balance === amount){
            return false
        }else{
            const difference = getBalance.available_balance-amount;

            await getBalance.decrement('available_balance', {by:amount});

            let creditAccount = await db.balance.findOne({where:{addressId:friendAddressId}});
            await creditAccount.increment('available_balance',{by:amount});
            return true;
        }
    }


    async checkWeeklyLimit(userId, address) {
        let limit = await db.address.findOne({ where: { userId, address } });
        if(limit){
            if (Number(limit.weekly_limit) == Number(limit.weekly_limit_count_up)) {
                return true
            }
            return false
        }
       return 
    }


    async updateWeeklyLimit(userId, address) {
        let limit = await db.address.findOne({ where: { userId, address } });
        if (limit) {
            limit.increment('weekly_limit_count_up');
        }
    }


    async resetWeeklyLimit() {
        try {
            let limit = await db.address.findAll();
            if (limit.length > 0) {
                for (let i = 0; i < limit.length; i++) {
                    limit[i].update({ weekly_limit_count_up: 0 })
                }
            }
        } catch (error) {
            console.log(error)
        }

    }


    async confirmNetworks(userId, userAddress, friendAddress) {
        let userAdd = await db.address.findOne({ where: { userId, address: userAddress } });
        let friendAdd = await db.address.findOne({ where: { address: friendAddress } });
        return { userAdd, friendAdd }
    }


    async confirmNetwork(userId, address) {
        let userAddress = await db.address.findOne({ where: { userId, address } });
        return userAddress;
    }


    async updateBalance(addressId, network, available_balance, pending_received_balance) {
        let balance = await db.balance.findOne({ where: { addressId } });
        if (balance) {
            await balance.update({ available_balance, pending_received_balance })
        } else {
            await db.balance.create({ addressId, network, available_balance, pending_received_balance });
        }
    }


    async sendMail(tx_reference_number, email){

        const mailOptions= {
            from: '"Blackbox" <www.blackbox.com>',
            to: email,
            subject: "Email Test",
            text: `Transacton successful. Your transaction reference number is ${tx_reference_number}`
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if(err){
                console.log(err);
            }
            
          });
        
    }

    static async programTransaction() { }
}

export default Helpers