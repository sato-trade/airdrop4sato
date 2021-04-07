import * as Url from '../../config/Url'
import { authHeader } from '../../utils/AuthHeader';
import { handleResponse } from '../../utils/HandleResponse'
import * as Contract from "../../config/Contract.json";
import Web3 from 'web3'
import {getChain} from "../../utils/Common";

let web3 = new Web3(window.ethereum)

export const walletService = {
    getUserCapital,
    withdraw,
    getAllTokenStatus,
    getL1Capital,
    getTransactionRecords,
    getAmplRewards,
    registerAmplRewards,
    getFee
};

async function getUserCapital(token) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(token),
    };
    return fetch(Url.GET_USER_CAPITAL, requestOptions).then(handleResponse);
}

async function withdraw(payload) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(payload.token),
        body: JSON.stringify(payload)
    };
    return fetch(Url.WITHDRAW, requestOptions).then(handleResponse);
}

async function getAllTokenStatus(token) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(token),
    };
    return fetch(Url.GET_ALL_TOKENS_STATUS, requestOptions).then(handleResponse);
}

async function getL1Capital(address, network, chainId) {
    async function loopingCapital () {
        let chain = getChain(network, chainId)
            // + '_test'
        let balance = []
        let balanceCheckerContract = new web3.eth.Contract(Contract.default[chain].balanceChecker.abi, Contract.default[chain].balanceChecker.address);
        for (const key in Contract.default[chain].coins) {
            if (key === 'ETH') {
                await web3.eth.getBalance(address, (err, res) => {
                    if (err){
                        console.log('failed: ', err)
                    }
                    balance.push({token: key, free: Number(res) / Math.pow(10, Contract.default[chain].coins[key].decimals)})
                })
            } else {
                await balanceCheckerContract.methods.tokenBalance(address, Contract.default[chain].coins[key].address).call({}, (err, res) => {
                    if (err){
                        console.log('failed: ', err)
                    }
                    balance.push({token: key, free: Number(res) / Math.pow(10, Contract.default[chain].coins[key].decimals)})
                })
            }
        }
        return balance
    }

    return await loopingCapital()
}

async function getTransactionRecords(token) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(token),
    };
    return fetch(Url.GET_TRANSACTION_RECORDS, requestOptions).then(handleResponse);
}

async function getAmplRewards(token) {

    const requestOptions = {
        method: 'GET',
        headers: authHeader(token)
    };
    if (token && token.length > 0) {
        return fetch( Url.GET_AMPL_REWARDS, requestOptions).then(handleResponse);
    } else {
        return fetch( Url.GET_AMPL_REWARDS + '/public', requestOptions).then(handleResponse);
    }
}

async function registerAmplRewards(token) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(token),
        body: null
    };
    return fetch(Url.REGISTER_AMPL_REWARDS, requestOptions).then(handleResponse);
}

async function getFee(payload) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(payload.token),
    };
    return fetch(Url.GET_FEE + payload.action + '/' + payload.amount, requestOptions).then(handleResponse);
}

