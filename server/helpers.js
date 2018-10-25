import * as dotenv from 'dotenv';

import db from './models';

const block_io = require('block_io');

dotenv.config();

const version = 2;

let bitCoin = new block_io(process.env.BITCOIN_API_KEY, process.env.SECRET_PIN, version);



class Helpers{
    constructor(){
        this.userId=null
        this.getUserId=this.getUserId.bind(this);
        this.getFriendId=this.getFriendId.bind(this);
        this.checkExistingFriend= this.checkExistingFriend.bind(this);
        this.confirmNetwork=this.confirmNetwork.bind(this);
    }
static async createAccount(){}

static async createWallet(data){
   return db.address.create({})
   .then();
}

async getFriendId(username){
    let userId = await db.users.findOne({where:{username}});
    if(!userId) return null;
    return this.userId = userId.id; 
    // this.getUserId()
}

async checkExistingFriend(user, id){
    let userId = await db.friends.findOne({where:{userId:user,friendId:id}});
    if(!userId) return false;
    return true; 
    // this.getUserId()
}

getUserId(){
    return this.userId;
}

async confirmNetwork(userId,userAddress, friendAddress){
    let userAdd = await db.address.findOne({where:{userId, address:userAddress}});
    let friendAdd = await db.address.findOne({where:{address:friendAddress}});
    return {userAdd, friendAdd}
}

static async getNotification(){}

static async checkBalance(){}

static async checkRecentTransaction(){}

static async programTransaction(){}
}

export default Helpers