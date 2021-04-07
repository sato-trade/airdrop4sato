import {authActions} from "../redux/actions";
import MetaMaskOnboarding from "@metamask/onboarding";
import Web3 from "web3";
import { toBuffer } from 'ethereumjs-util'
import {walletActions} from "../redux/actions/walletActions";
import {formDateString} from "./Common";
const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
    ? 'http://localhost:9010'
    : undefined

export const onBoard = new MetaMaskOnboarding({ forwarderOrigin })

export const unlock = async (msg, address, chainId, network, Web3, registered, dispatch) => {
    try {

        dispatch(authActions.authSigning())
        const from = address
        const readable = `0x${Buffer.from(msg, 'utf8').toString('hex')}`
        const buffer = [...toBuffer(readable)]
        // const _msg = Web3.utils.soliditySha3(msg);
        const sign = await window.ethereum.request({
            method: 'personal_sign',
            params: [readable, from],
        })
        let payload = {
            data: buffer,
            sig: sign,
            pubKeyAddress: address,
            chainId: Web3.utils.hexToNumber(chainId),
            networkId: Number(network)
        }

        console.log('payload: ', typeof buffer, payload)

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

export const withdraw = async (msg, address, chainId, network, Web3, registered, dispatch, walletSigning, setTime, handleOpenNote, coin, chain, withdrawAmount, withdrawTo, token) => {
    try {
        const from = address
        const readable = `0x${Buffer.from(msg, 'utf8').toString('hex')}`
        const buffer = [...toBuffer(readable)]
        dispatch(walletActions.walletSigning())
        if (!walletSigning) {
            setTime(formDateString(new Date().getTime()))
            handleOpenNote()

            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [readable, from],
            })
            let payload = {
                personalSign: {
                    data: buffer,
                    sig: sign,
                    pubKeyAddress: address,
                    chainId: Web3.utils.hexToNumber(chainId),
                    networkId: Number(network),
                },
                currency: coin,
                chain: chain,
                amount: withdrawAmount,
                address: withdrawTo,
                token: token
            }
            dispatch(walletActions.withdraw(payload))
        }

    } catch (err) {
        console.error('withdraw request cancelled: ', err)
        dispatch(walletActions.walletSigningCancelled())
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
