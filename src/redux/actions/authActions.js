import { authService } from '../services/authServices';
import {
    LOGIN,
    LOGIN_SUCCESSFUL,
    LOGIN_FAILED,
    LOGOUT,
    REGISTER,
    CHECK_EXIST,
    REGISTERED,
    NOT_REGISTERED,
    FETCH_POSTS
} from '../constants';
import { history } from '../../utils/History';
import { alertActions } from './alertActions';
import {authHeader} from "../../utils/AuthHeader";
import * as Url from "../../config/Url";

export const authActions = {
    checkUser,
    // register,
    // login,
    // logOut
}

function checkUser(address, from) {
    return dispatch => {
        dispatch(request({ address }));
        authService.checkUser(address)
            .then(
                address => {
                    console.log('here: ', address)
                    dispatch(success());
                },
                error => {
                    console.log('here instead: ', error)
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(address) { return { type: CHECK_EXIST, address } }
    function success(registered) { return { type: REGISTERED, registered } }
    function failure(error) { return { type: NOT_REGISTERED, error } }
}

// function register() {
//     return dispatch => {
//         dispatch(request({ username }));
//
//         authService.login(username, password)
//             .then(
//                 user => {
//                     dispatch(success(user));
//                     history.push(from);
//                 },
//                 error => {
//                     dispatch(failure(error.toString()));
//                     dispatch(alertActions.error(error.toString()));
//                 }
//             );
//     };
//
//     function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
//     function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
//     function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
// }
//
// function login() {
//     return dispatch => {
//         dispatch(request({ username }));
//
//         authService.login(username, password)
//             .then(
//                 user => {
//                     dispatch(success(user));
//                     history.push(from);
//                 },
//                 error => {
//                     dispatch(failure(error.toString()));
//                     dispatch(alertActions.error(error.toString()));
//                 }
//             );
//     };
//
//     function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
//     function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
//     function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
// }
//
// function logOut() {
//     return dispatch => {
//         dispatch(request({ username }));
//
//         authService.login(username, password)
//             .then(
//                 user => {
//                     dispatch(success(user));
//                     history.push(from);
//                 },
//                 error => {
//                     dispatch(failure(error.toString()));
//                     dispatch(alertActions.error(error.toString()));
//                 }
//             );
//     };
//
//     function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
//     function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
//     function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
// }
