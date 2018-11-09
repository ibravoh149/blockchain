import axios from 'axios';

const bitcoin = require('bitcoinjs-lib');


class Bitcoin {
    constructor() {
        // this.generateKeypair=this.generateKeypair.bind(this);
        this.generateAccount = this.generateAccount.bind(this);
        this.getUnspentTransactions=this.getUnspentTransactions.bind(this);
        this.getRecommendedFee=this.getRecommendedFee.bind(this);
        this.keyPair = null;
        this.address = null;
        this.pk = null
    }


    generateAccount() {
        let testnet = bitcoin.networks.testnet;
        let keyPair = bitcoin.ECPair.makeRandom({ network: testnet });
        let privateKey = keyPair.toWIF();
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: testnet });

        const urlForMyAddress = `https://testnet-api.smartbit.com.au/v1/blockchain/address/${address}`
            axios
            .get(urlForMyAddress)
            .then(response => console.log(response.data))

        return { address, privateKey, keyPair }
    }

    getAddressTx(address) {
        axios.get('https://blockchain.info/rawaddr/' + address)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    getUnspentTransactions(address) {
        const url = `https://testnet-api.smartbit.com.au/v1/blockchain/address/${address}/unspent`
        return axios.get(url)
            .then(response => response.data.unspent)
            .catch(error=>console.log(error))

    }

    getRecommendedFee() {
        const url = 'https://bitcoinfees.21.co/api/v1/fees/recommended'
        const medianTransactionSize = 226
        return axios
            .get(url)
            .then(response => response.fastestFee * medianTransactionSize)
            .catch(error=>console.log(error))
    }



    // mqmSbQwEZuCKwBsEdwvJMmMX4cjwWBmXiy 
    // cPyGpAxavgLxZegUgMet8kAoax7fQNGNvksoMvVWqGBopsHVkCxL



}

export default Bitcoin;