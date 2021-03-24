import * as Url from '../../config/Url'
import { authHeader } from '../../utils/AuthHeader';
import { handleResponse } from '../../utils/HandleResponse'
import { abi, address } from "../../config/Contract";
import Web3 from 'web3'

let web3 = new Web3(window.ethereum)

export const walletService = {
    getUserCapital,
    withdraw,
    getAllTokenStatus,
    deposit
};

async function getUserCapital(token) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(token),
    };
    return fetch(Url.GET_USER_CAPITAL, requestOptions).then(handleResponse);
}

async function deposit(payload) {
    const gasPrice = await web3.eth.getGasPrice()

    const nonce = await web3.eth.getTransactionCount(payload.l1Address)

    const chainId = await web3.eth.getChainId()


    const transactionParameters = {
        // nonce: web3.utils.toHex(nonce), // ignored by MetaMask
        // gasPrice: gasPrice, // customizable by user during MetaMask confirmation.
        // gas: web3.utils.toHex(21000), // customizable by user during MetaMask confirmation.
        to: address, // Required except during contract publications.
        from: payload.l2Address, // must match user's active address.
        value: web3.utils.toWei(payload.amount, 'ether'), // Only required to send ether to the recipient from the initiating external account.
        // chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    return await web3.eth.sendTransaction(transactionParameters)
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


