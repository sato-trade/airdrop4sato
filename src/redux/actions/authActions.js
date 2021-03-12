import { authService } from '../services/authServices';
import {
    LOGIN,
    LOGIN_SUCCESSFUL,
    LOGIN_FAILED,
    LOGOUT,
    REGISTER,
    CHECK_EXIST
} from '../constants';
import { history } from '../_helpers';
import { alertActions } from './alertActions';

export const authActions = {
    checkUser,
    register,
    login,
    logOut
}



function checkUser(address, from) {
    return dispatch => {
        dispatch(request({ address }));

        authService.checkUser(address)
            .then(
                user => {
                    dispatch(success(user));
                    history.push(from);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(address) { return { type: CHECK_EXIST, address } }
    function success(address) { return { type: LOGIN_SUCCESSFUL, address } }
    function failure(error) { return { type: LOGIN_FAILED, error } }
}

function register() {
    return dispatch => {
        dispatch(request({ username }));

        authService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push(from);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function login() {
    return dispatch => {
        dispatch(request({ username }));

        authService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push(from);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logOut() {
    return dispatch => {
        dispatch(request({ username }));

        authService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push(from);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}
