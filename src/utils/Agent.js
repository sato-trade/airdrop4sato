import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);


const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
    if (token) {
        req.set('authorization', `Token ${token}`);
    }
}

const Request = {
    del: url =>
        superagent.del(`${url}`).use(tokenPlugin).then(responseBody),
    get: url =>
        superagent.get(`${url}`).use(tokenPlugin).then(responseBody),
    put: (url, body) =>
        superagent.put(`${url}`, body).use(tokenPlugin).then(responseBody),
    post: (url, body) =>
        superagent.post(`${url}`, body).use(tokenPlugin).then(responseBody)
};

export default {
    Request
}
