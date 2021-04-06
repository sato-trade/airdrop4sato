import { walletService } from '../services/walletService';
import {
    GET_USER_CAPITAL, GET_USER_CAPITAL_FAILED, GET_USER_CAPITAL_SUCCEED,
    WITHDRAW, WITHDRAW_FAILED, WITHDRAW_SUCCEED,
    GET_ALL_TOKEN_STATUS, GET_ALL_TOKEN_STATUS_FAILED, GET_ALL_TOKEN_STATUS_SUCCEED,
    GET_ALL_TOKEN_ICONS_SUCCEED,
    GET_L1_CAPITAL_SUCCEED, GET_L1_CAPITAL_FAILED,
    DEPOSIT, DEPOSIT_FAILED, DEPOSIT_SUCCEED, DEPOSIT_HASH, DEPOSIT_RECEIPT,
    GET_TRANSACTION_RECORDS_SUCCEED, GET_TRANSACTION_RECORDS_FAILED,
    GET_AMPL_REWARDS_SUCCEED, GET_AMPL_REWARDS_FAILED,
    REGISTER_AMPL_REWARDS, REGISTER_AMPL_REWARDS_SUCCEED, ALREADY_REGISTERED, NOT_QUALIFIED, REGISTER_AMPL_REWARDS_FAILED,
    GET_WITHDRAW_FEE, GET_WITHDRAW_FEE_SUCCESS, GET_WITHDRAW_FEE_FAILED, WALLET_SIGNING, WALLET_SIGNING_CANCELLED
} from '../constants';
import { history } from '../../utils/History';
import { alertActions } from './alertActions';
import Web3 from 'web3'
import * as Contract from "../../config/Contract.json";
import {Container} from "@material-ui/core";
let web3 = new Web3(window.ethereum)

export const walletActions = {
    getUserCapital,
    withdraw,
    getAllTokenStatus,
    deposit,
    getL1Capital,
    getTransactionRecords,
    getAmplRewards,
    registerAmplRewards,
    getFee,
    walletSigning,
    walletSigningCancelled
};

function walletSigning() {
    return dispatch => {
        dispatch(walletSigning(true))
    }
    function walletSigning(loading) {return { type: WALLET_SIGNING, loading }}
}

function walletSigningCancelled() {
    return dispatch => {
        dispatch(walletSigningCancelled(false))
    }
    function walletSigningCancelled(loading) {return { type: WALLET_SIGNING_CANCELLED, loading, message: 'actionCancelled' }}
}

function getUserCapital(token) {
    return dispatch => {
        dispatch(request());
        walletService.getUserCapital(token)
            .then(
                res => {
                    dispatch(success(res.data));
                },
                error => {
                    if (error === 'This username has been used by another account.') {
                        dispatch('add succeed!');
                    } else {
                        dispatch(failure(error.toString()));
                        dispatch(alertActions.error(error.toString()));
                    }
                }
            );
    };

    function request() { return { type: GET_USER_CAPITAL } }
    function success(data) { return { type: GET_USER_CAPITAL_SUCCEED, data } }
    function failure(error) { return { type: GET_USER_CAPITAL_FAILED, error } }
}

function withdraw(payload) {
    return dispatch => {
        dispatch(request());
        walletService.withdraw(payload)
            .then(
                res => {
                    dispatch(success('withdrawSucceed'));
                },
                error => {
                    if (error === 'This username has been used by another account.') {
                        dispatch('add succeed!');
                    } else {
                        dispatch(failure(error.toString()));
                        dispatch(alertActions.error(error.toString()));
                    }
                }
            );
    };

    function request() { return { type: WITHDRAW } }
    function success(message) { return { type: WITHDRAW_SUCCEED, message } }
    function failure(error) { return { type: WITHDRAW_FAILED, error } }
}

function deposit(payload) {
    return dispatch => {
        dispatch(request());
        let transactionParameters = {}
        if (payload.coin === 'ETH') {
            transactionParameters = {
                // nonce: web3.utils.toHex(nonce), // ignored by MetaMask
                // gasPrice: gasPrice, // customizable by user during MetaMask confirmation.
                // gas: web3.utils.toHex(21000), // customizable by user during MetaMask confirmation.
                to: Contract.ropsten.dacb.address, // Required except during contract publications.
                from: payload.l2Address, // must match user's active address.
                value: web3.utils.toWei(payload.amount, 'ether'), // Only required to send ether to the recipient from the initiating external account.
                // chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
            };


        } else {
            let contractInstance = new web3.eth.Contract(Contract.ropsten.transferErc20.abi, Contract.ropsten.coins[payload.coin].address);
            let contractData = contractInstance.methods.transfer(Contract.ropsten.dacb.address, web3.utils.toBN(payload.amount * Math.pow(10, Contract.ropsten.coins[payload.coin].decimals))).encodeABI()
            // // calculate ERC20 token amount
            // // call transfer function
            // contract.transfer(Contract.ropsten.dacb.address, value, (error, txHash) => {
            //     // it returns tx hash because sending tx
            //     console.log(txHash);
            // });

            transactionParameters = {
                // nonce: web3.utils.toHex(nonce), // ignored by MetaMask
                // gasPrice: gasPrice, // customizable by user during MetaMask confirmation.
                // gas: web3.utils.toHex(21000), // customizable by user during MetaMask confirmation.
                to: Contract.ropsten.coins[payload.coin].address, // Required except during contract publications.
                from: payload.l2Address, // must match user's active address.
                data: contractData,
                // value: web3.utils.toWei(0, 'ether'), // Only required to send ether to the recipient from the initiating external account.
                // chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
            };
        }

        web3.eth.sendTransaction(transactionParameters)
            .on('transactionHash', function(hash){
                dispatch(onHash(hash))
            })
            .on('receipt', function(receipt){
                dispatch(onReceipt(receipt))
            })
            .on('confirmation', function(confirmationNumber, receipt){
                if (confirmationNumber = 5) {
                    dispatch(success(confirmationNumber))
                }
            })
            .on('error', function(error) {
                dispatch(failure(error))
            });

    };

    function request(payload) { return { type: DEPOSIT, payload } }
    function onHash(hash) { return { type: DEPOSIT_HASH, hash } }
    function onReceipt(receipt) { return { type: DEPOSIT_RECEIPT, receipt } }
    function success(confirmationNumber) { return { type: DEPOSIT_SUCCEED, confirmationNumber } }
    function failure(error) { return { type: DEPOSIT_FAILED, error } }
}

function getAllTokenStatus(token) {
    return dispatch => {
        dispatch(request());
        walletService.getAllTokenStatus(token)
            .then(
                res => {
                    dispatch(success(res.data));
                    let iconMaps = {}
                    for ( let i = 0; i< res.data.length; i++ ) {
                        let name = res.data[i].token
                        let logo = {}
                        logo.bigLogoUrl = res.data[i].bigLogoUrl
                        logo.smallLogoUrl = res.data[i].smallLogoUrl
                        iconMaps[name] = logo
                    }
                    dispatch(successIcon(iconMaps));
                },
                error => {
                    if (error === 'This username has been used by another account.') {
                        dispatch('add succeed!');
                    } else {
                        dispatch(failure(error.toString()));
                        dispatch(alertActions.error(error.toString()));
                    }
                }
            );
    };

    function request() { return { type: GET_ALL_TOKEN_STATUS } }
    function successIcon(iconMaps) { return { type: GET_ALL_TOKEN_ICONS_SUCCEED, iconMaps } }
    function success(data) { return { type: GET_ALL_TOKEN_STATUS_SUCCEED, data } }
    function failure(message) { return { type: GET_ALL_TOKEN_STATUS_SUCCEED, message } }
}

function getL1Capital(address) {
    return dispatch => {
        walletService.getL1Capital(address)
            .then(
                res => {
                    dispatch(success(res));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }


    function success(data) { return { type: GET_L1_CAPITAL_SUCCEED, data } }
    function failure(message) { return { type: GET_L1_CAPITAL_FAILED, message } }
}

function getTransactionRecords(token) {
    return dispatch => {
        walletService.getTransactionRecords(token)
            .then(
                res => {
                    dispatch(success(res.data));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }


    function success(data) { return { type: GET_TRANSACTION_RECORDS_SUCCEED, data } }
    function failure(error) { return { type: GET_TRANSACTION_RECORDS_FAILED, error } }
}

function getAmplRewards(token) {
    return dispatch => {
        walletService.getAmplRewards(token)
            .then(
                res => {
                    dispatch(success(res.data));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }


    function success(data) { return { type: GET_AMPL_REWARDS_SUCCEED, data } }
    function failure(error) { return { type: GET_AMPL_REWARDS_FAILED, error } }
}

function registerAmplRewards(token) {
    return dispatch => {
        dispatch(request());
        walletService.registerAmplRewards(token)
            .then(
                res => {
                    dispatch(success('RegisterSuccess'));
                },
                error => {
                    if (error.data === "NotEligibleError") {
                        dispatch(alreadyRegistered(error.data));
                    } else if (error.data === 'AlreadyRegisterError') {
                        dispatch(notQualified(error.data));
                    } else {
                        dispatch(failure('NotAvailable'));
                    }

                }
            );
    }

    function request() { return { type: REGISTER_AMPL_REWARDS } }
    function success(message) { return { type: REGISTER_AMPL_REWARDS_SUCCEED, message } }
    function alreadyRegistered(message) { return { type: ALREADY_REGISTERED, message } }
    function notQualified(message) { return { type: NOT_QUALIFIED, message } }
    function failure(message) { return { type: REGISTER_AMPL_REWARDS_FAILED, message } }
}

function getFee(payload) {
    return dispatch => {
        dispatch(request());
        walletService.getFee(payload)
            .then(
                res => {
                    dispatch(success(res.data));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }

    function request() { return { type: GET_WITHDRAW_FEE } }
    function success(data) { return { type: GET_WITHDRAW_FEE_SUCCESS, data } }
    function failure(message) { return { type: GET_WITHDRAW_FEE_FAILED, message } }
}
