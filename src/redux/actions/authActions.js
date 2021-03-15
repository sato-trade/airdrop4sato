import { authService } from '../services/authServices';
import {
    LOGIN,

    LOGIN_SUCCEED,
    LOGIN_FAILED,
    LOGOUT,

    SIGNUP,
    SIGNUP_SUCCEED,
    SIGNUP_FAILED,

    CHECK_EXIST,
    CHECK_FAILED,
    CHECK_SUCCEED
} from '../constants';
import { history } from '../../utils/History';
import { alertActions } from './alertActions';
import { authHeader } from "../../utils/AuthHeader";
import * as Url from "../../config/Url";

export const authActions = {
    checkUser,
    signUp,
    logIn,
    logOut
}

function checkUser(address, from) {
    return dispatch => {
        dispatch(request({ address }));
        authService.checkUser(address)
            .then(
                res => {
                    dispatch(success(!res.success));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(address) { return { type: CHECK_EXIST, address } }
    function success(registered) { return { type: CHECK_SUCCEED, registered } }
    function failure(error) { return { type: CHECK_FAILED, error } }
}

function signUp(payload) {
    return dispatch => {
        dispatch(request());
        authService.signUp(payload)
            .then(
                res => {
                    if (res.success) {
                        dispatch(success(res.success));
                    } else {
                        console.log('here: ', res)
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: SIGNUP } }
    function success(registered) { return { type: SIGNUP_SUCCEED, registered } }
    function failure(error) { return { type: SIGNUP_FAILED, error } }
}

function logIn(address, from) {
    return dispatch => {
        dispatch(request({ address }));
        authService.logIn(address)
            .then(
                res => {
                    dispatch(success(!res.success));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(address) { return { type: CHECK_EXIST, address } }
    function success(registered) { return { type: CHECK_SUCCEED, registered } }
    function failure(error) { return { type: CHECK_FAILED, error } }
}

function logOut(address, from) {
    return dispatch => {
        dispatch(request({ address }));
        authService.logOut(address)
            .then(
                res => {
                    dispatch(success(!res.success));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(address) { return { type: CHECK_EXIST, address } }
    function success(registered) { return { type: CHECK_SUCCEED, registered } }
    function failure(error) { return { type: CHECK_FAILED, error } }
}
