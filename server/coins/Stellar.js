import axios from 'axios';
import request from 'request';
// import { Keypair } from 'stellar-base';

const StellarSDK = require('stellar-sdk');



class Stellar{
    generateAccount(){
        const url ='https://friendbot.stellar.org';

        let KeyPair = StellarSDK.Keypair.random();
       

       let privateKey = KeyPair.secret();
       let publicKey = KeyPair.publicKey();
       
       request.get({
            url: url,
            qs: { addr: publicKey },
            json: true
          }, function(error, response, body) {
            if (error || response.statusCode !== 200) {
              console.error('ERROR!', error || body);
            }
            else {
              console.log('SUCCESS! You have a new account :)\n', body);
            }
          });

      return {privateKey, publicKey, KeyPair}


        
    }


    getBalance(address){

        var server = new StellarSDK.Server('https://horizon-testnet.stellar.org');

        server.loadAccount(address).then(function(account) {
        account.balances.forEach(function(balance) {
            console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
        });
    });

//         SDQ446WF6P3KNKCIYUIIA5MPVL7CHUE27CT53VWQF52AGVPHRGJ2WZLL
// GCGA7LBYOSC5C6CEVFS2UM7XCERMW7EP7BUEGUOIDXCKJTKBCK3OW74K
    }
}

export default Stellar