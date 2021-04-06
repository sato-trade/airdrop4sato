import {authActions} from "../redux/actions";
import MetaMaskOnboarding from "@metamask/onboarding";
import Web3 from "web3";
export const { isMetaMaskInstalled } = MetaMaskOnboarding
const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
    ? 'http://localhost:9010'
    : undefined

export const onBoard = new MetaMaskOnboarding({ forwarderOrigin })

export const unlock = async (msg, address, chainId, network, Web3, registered, dispatch) => {
    try {

        dispatch(authActions.authSigning())
        const from = address
        // const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
        const _msg = Web3.utils.soliditySha3(msg);
        const sign = await window.ethereum.request({
            method: 'personal_sign',
            params: [_msg, from],
        })
        let payload = {
            data: msg,
            sig: sign,
            pubKeyAddress: address,
            chainId: Web3.utils.hexToNumber(chainId),
            networkId: Number(network)
        }

        if (registered !== undefined ) {
            if (registered) {
                dispatch(authActions.logIn(payload))
            } else {
                dispatch(authActions.signUp(payload))
            }
        } else {
            console.log('not found!')
        }

    } catch (err) {
        console.error('sign error: ', err)
        dispatch(authActions.logOut())
    }
}

export const isMetaMaskConnected = (address) => {
    return address !== ''
}

export const onClickInstall = (setButton1, setButton1Disabled ) => {
    onBoard.startOnboarding()
    setButton1('Onboarding in progress')
    setButton1Disabled(true)
}

export const onClickConnect = async (network, chainId, addr, dispatch) => {
    try {
        await window.ethereum.request({
            method: 'eth_requestAccounts',
        })
        await unlock('unlock', addr, chainId, network, Web3, false, dispatch)
    } catch (error) {
        console.error(error)
    }


}
