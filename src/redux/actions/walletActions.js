import { walletService } from '../services/walletService';
import {
    GET_USER_CAPITAL, GET_USER_CAPITAL_FAILED, GET_USER_CAPITAL_SUCCEED,
    WITHDRAW, WITHDRAW_FAILED, WITHDRAW_SUCCEED,
    GET_ALL_TOKEN_STATUS, GET_ALL_TOKEN_STATUS_FAILED, GET_ALL_TOKEN_STATUS_SUCCEED,
    DEPOSIT, DEPOSIT_FAILED, DEPOSIT_SUCCEED
} from '../constants';
import { history } from '../../utils/History';
import { alertActions } from './alertActions';
export const walletActions = {
    getUserCapital,
    withdraw,
    getAllTokenStatus,
    deposit
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
    console.log('payload is here: ', payload)
    return dispatch => {
        dispatch(request());
        walletService.deposit(payload)
            .then(
                res => {
                    console.log('here deposit result: ', res)
                    if (res) {
                        dispatch(success('remove succeed'));
                    }
                },
                error => {
                    console.log('here deposit result: ', error)
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(payload) { return { type: DEPOSIT, payload } }
    function success(msg) { return { type: DEPOSIT_SUCCEED, msg } }
    function failure(error) { return { type: DEPOSIT_FAILED, error } }
}

function getAllTokenStatus(token) {
    return dispatch => {
        dispatch(request());
        walletService.getAllTokenStatus(token)
            .then(
                res => {
                    dispatch(success(res.data));
                    // let iconMaps
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
    function success(data) { return { type: GET_ALL_TOKEN_STATUS_SUCCEED, data } }
    function failure(error) { return { type: GET_ALL_TOKEN_STATUS_SUCCEED, error } }
}
