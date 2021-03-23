import {authActions} from "../redux/actions";

export const unlock = async (msg, address, chainId, network, Web3, registered, dispatch) => {
    try {
        const from = address
        // const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
        const _msg = Web3.utils.soliditySha3(msg);

        const sign = await window.ethereum.request({
            method: 'personal_sign',
            params: [_msg, from],
        })
        /***
         * need to send network id to java backend & symbol (? huobi eco chain) -- 210205
         * @type {{sig: *, address: string, data: string}}
         */


        let payload = {
            data: msg,
            sig: sign,
            pubKeyAddress: address,
            chainId: Web3.utils.hexToNumber(chainId),
            networkId: Number(network)
        }

        if (registered !== undefined) {
            if (registered) {
                dispatch(authActions.logIn(payload))
            } else {
                dispatch(authActions.signUp(payload))

            }
        } else {
            console.log('not found!')
        }
    } catch (err) {
        console.error(err)
    }
}
