import { authService } from '../services/authServices';
import {
    AUTH_SIGNING,
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
import * as Url from "../../config/Url";

export const authActions = {
    checkUser,
    signUp,
    logIn,
    logOut,
    authSigning
}

function authSigning() {
    return dispatch => {
       dispatch(authSigning(true))
    }
    function authSigning(loading) {return { type: AUTH_SIGNING, loading }}
}

function checkUser(address) {
    return dispatch => {
        dispatch(request({ address }));
        authService.checkUser(address)
            .then(
                res => {
                    dispatch(success(!res.success));
                },
                error => {
                    if (error.message === 'This username has been used by another account.') {
                        dispatch(success(true));
                    } else {
                        dispatch(failure(error.toString()));
                        dispatch(alertActions.error(error.toString()));
                    }
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
                    if (res) {
                        dispatch(success(res.success));
                        dispatch(logIn(payload))
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

function logIn(payload) {
    return dispatch => {
        dispatch(request());
        authService.logIn(payload)
            .then(
                res => {
                    res.payload = payload
                    dispatch(success(res));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(payload) { return { type: LOGIN, payload } }
    function success(data) { return { type: LOGIN_SUCCEED, data } }
    function failure(error) { return { type: LOGIN_FAILED, error } }
}

function logOut() {
    return dispatch => {
        dispatch(request());

    };
    function request() { return { type: LOGOUT } }
}
