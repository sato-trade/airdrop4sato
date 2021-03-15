import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);


const success = res => {
    console.log('success: ', res)

    return res.body
};

const failed = res => {
    console.log('failed: ', res.response.body)
    // for(let i in res) {
    //     console.log(i)
    //     console.log(res[i])
    // }
    return res.response.body
}

let token = null;
const tokenPlugin = req => {
    if (token) {
        req.set('authorization', `Token ${token}`);
    }
}

const Request = {
    del: url =>
        superagent.del(`${url}`).use(tokenPlugin).then(success),
    get: url =>
        superagent.get(`${url}`).use(tokenPlugin).then(success),
    put: (url, body) =>
        superagent.put(`${url}`, body).use(tokenPlugin).then(success),
    post: (url, body) => {
        superagent.post(`${url}`, body).use(tokenPlugin).then(success).catch(failed)
    }
};

export default {
    Request
}
