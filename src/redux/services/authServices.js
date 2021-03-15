import Agent from '../../utils/Agent'
import * as Url from '../../config/Url'
import { authHeader } from '../../utils/AuthHeader';

// checkUser: (address) =>
//     Agent.Request.get('/user/sign-up/username/checker?username=' + address, {}),
// register: (address, data, sig, chainId, networkId) =>
//     Agent.Request.post('/user/metamask/sign-up', { address, data, sig, chainId, networkId }),
// login: (address, data, sig, chainId, networkId) =>
//     Agent.Request.post('/user/metamask/login', { address, data, sig, chainId, networkId }),
// logOut: () => {
//     /**
//      * delete token
//      * disconnect metamask
//      */
//     console.log('logOut!')
// }

export const authService = {
    // login,
    // logOut,
    // register,
    checkUser
};

function checkUser(address) {
    // let res = Agent.Request.get(Url.CHECK_USER, { address })

    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(Url.CHECK_USER + address, requestOptions)
        .then(handleResponse)
        .then(res => {
            console.log('res: ', res)

            return true;
        });
}

function login(address, data, sig, chainId, networkId) {
    return Agent.Request.post(Url.LOGIN, { address, data, sig, chainId, networkId })
        .then(handleResponse)
        .then(res => {
            console.log('login res is here: ', res)
            // localStorage.setItem('user', JSON.stringify(user));
            //
            // return user;
        });
}

function signUp(address, data, sig, chainId, networkId) {
    return Agent.Request.post(Url.SIGN_UP, { address, data, sig, chainId, networkId })
        .then(handleResponse)
        .then(res => {
            console.log('signUp res is here: ', res)
            // localStorage.setItem('user', JSON.stringify(user));
            //
            // return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function handleResponse(response) {
    console.log('at handle response: ', response)
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
