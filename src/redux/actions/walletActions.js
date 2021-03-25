import { walletService } from '../services/walletService';
import {
    GET_USER_CAPITAL, GET_USER_CAPITAL_FAILED, GET_USER_CAPITAL_SUCCEED,
    WITHDRAW, WITHDRAW_FAILED, WITHDRAW_SUCCEED,
    GET_ALL_TOKEN_STATUS, GET_ALL_TOKEN_STATUS_FAILED, GET_ALL_TOKEN_STATUS_SUCCEED, GET_ALL_TOKEN_ICONS_SUCCEED,
    GET_L1_CAPITAL_SUCCEED, GET_L1_CAPITAL_FAILED,
    DEPOSIT, DEPOSIT_FAILED, DEPOSIT_SUCCEED, DEPOSIT_HASH, DEPOSIT_RECEIPT
} from '../constants';
import { history } from '../../utils/History';
import { alertActions } from './alertActions';
import Web3 from 'web3'
import * as Contract from "../../config/Contract.json";
let web3 = new Web3(window.ethereum)

export const walletActions = {
    getUserCapital,
    withdraw,
    getAllTokenStatus,
    deposit,
    getL1Capital
    /**
     * raw transaction deposit into contract
     * maker transaction towards contract address through metamask transaction
     *
     * dont show any deposit pending records, only approved records
     *
     */
};

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
                    dispatch(success(!res.success));
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

    function request(address) { return { type: WITHDRAW, address } }
    function success(msg) { return { type: WITHDRAW_SUCCEED, msg } }
    function failure(error) { return { type: WITHDRAW_FAILED, error } }
}

function deposit(payload) {
    return dispatch => {
        dispatch(request());
        const transactionParameters = {
            // nonce: web3.utils.toHex(nonce), // ignored by MetaMask
            // gasPrice: gasPrice, // customizable by user during MetaMask confirmation.
            // gas: web3.utils.toHex(21000), // customizable by user during MetaMask confirmation.
            to: Contract.ropsten.dacb.address, // Required except during contract publications.
            from: payload.l2Address, // must match user's active address.
            value: web3.utils.toWei(payload.amount, 'ether'), // Only required to send ether to the recipient from the initiating external account.
            // chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };

        web3.eth.sendTransaction(transactionParameters)
            .on('transactionHash', function(hash){
                console.log('hash')
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



    // walletService.deposit(payload)
    //     .then(
    //         res => {
    //             console.log('here deposit result: ', res)
    //             if (res) {
    //                 dispatch(success('remove succeed'));
    //             }
    //         },
    //         error => {
    //             console.log('here deposit result: ', error)
    //             dispatch(failure(error.toString()));
    //             dispatch(alertActions.error(error.toString()));
    //         }
    //     );
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
                    console.log('get l1Capital succeed: ', res)
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
