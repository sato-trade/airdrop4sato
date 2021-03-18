import { poolService} from '../services/poolService';
import {
    ADD_LIQUIDITY, ADD_SUCCEED, ADD_FAILED, REMOVE_LIQUIDITY, REMOVE_SUCCEED, REMOVE_FAILED
} from '../constants';
import { history } from '../../utils/History';
import { alertActions } from './alertActions';
import * as Url from "../../config/Url";

export const authActions = {
    addLiquidity,
    removeLiquidity
}

function addLiquidity(address, from) {
    return dispatch => {
        dispatch(request({ address }));
        poolService.addLiquidity(address)
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

    function request(address) { return { type: ADD_LIQUIDITY, address } }
    function success(msg) { return { type: ADD_SUCCEED, msg } }
    function failure(error) { return { type: ADD_FAILED, error } }
}

function removeLiquidity(payload) {
    return dispatch => {
        dispatch(request());
        poolService.removeLiquidity(payload)
            .then(
                res => {
                    if (res) {
                        dispatch(success('remove succeed'));
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: REMOVE_LIQUIDITY } }
    function success(msg) { return { type: REMOVE_SUCCEED, msg } }
    function failure(error) { return { type: REMOVE_FAILED, error } }
}
