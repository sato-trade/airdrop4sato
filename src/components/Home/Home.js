import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Grid, Button, Card, CardContent, CardActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Home.css';
import { withTranslation } from 'react-i18next';
import MetaMaskOnboarding from '@metamask/onboarding'
import { recoverPersonalSignature } from 'eth-sig-util'
import { isValidAddress } from 'ethereumjs-util'
import useWindowDimensions from '../../utils/WindowDimensions'

import { authActions } from '../../redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';

const Web3 = require("web3");
const { isMetaMaskInstalled } = MetaMaskOnboarding
const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
    ? 'http://localhost:9010'
    : undefined

function Home({t, navBarHeight}) {
    const [ connected, setConnected ] = useState(false)
    const [ chainId, setChainId ] = useState(0)
    const [ network, setNetwork ] = useState('')
    const [ addr, setAddr ] = useState('')
    const [ signResult, setSignResult ] = useState('')
    const [ recoveryResult, setRecoverResult ] = useState('')
    const [ ecRecoveryResult, setEcRecoverResult ] = useState('')
    const [button1, setButton1] = useState('')
    const [button2, setButton2] = useState(t('unlock'))
    const [button3, setButton3] = useState('VERIFY')
    const [button1Disabled, setButton1Disabled] = useState(true)
    const [button2Disabled, setButton2Disabled] = useState(true)
    const [onBoard, setOnboard] = useState(new MetaMaskOnboarding({ forwarderOrigin }))

    const { height, width } = useWindowDimensions();
    const useStyles = makeStyles((theme) => ({
        root: {
            ...theme.typography.button,
            backgroundColor: '#010846',
            padding: theme.spacing(1),
            flexGrow: 1,
            height: height - navBarHeight,
            textAlign: 'center'
        },
        walletBox: {
            width: 441,
            borderRadius: 24,
            backgroundColor: '#101B66',
            justifyContent: 'center',
            display: 'inline-flex',
            marginTop: 100,
            paddingTop: 30,
            paddingBottom: 30
        },
        walletContent: {
            width: 300,
            alignItems: 'flex-start',
        },
        wrapper: {
            color: 'white',
            alignItems: 'flex-start',
            display: 'flex'
        },
        result: {
            fontSize: 10,
            color: '#000000',
            width: 200
        },
        btn: {
            backgroundColor: '#83ACF4',
            color: '#010846',
            borderColor: 'transparent',
            borderRadius: 25,
            height: 45,
            fontWeight: 600
        }
    }));
    const classes = useStyles();

    const loading = useSelector(state => state.auth.loading);
    const registered = useSelector(state => state.auth.registered)
    const dispatch = useDispatch();
    const location = useLocation();

    /**
     * Personal Sign
     */
    const sign = async () => {
        const exampleMessage = 'Example `personal_sign` message'
        try {
            const from = addr
            // const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
            const msg = Web3.utils.soliditySha3(exampleMessage);

            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [msg, from],
            })
            setSignResult(sign)
            /***
             * need to send network id to java backend & symbol (? huobi eco chain) -- 210205
             * @type {{sig: *, address: string, data: string}}
             */

            const chainId = await window.ethereum.request({
                method: 'eth_chainId',
            })

            const networkId = await window.ethereum.request({
                method: 'net_version',
            })

            let payload = {
                data: exampleMessage,
                sig: sign,
                pubKeyAddress: addr,
                chainId: Web3.utils.hexToNumber(chainId),
                networkId: Number(networkId)
            }

            console.log('payload: ', payload)

            if (registered !== undefined) {
                if (registered) {
                    console.log('logging!')
                    dispatch(authActions.logIn(payload))
                } else {
                    console.log('registering!')
                    dispatch(authActions.signUp(payload))
                }
            } else {
                console.log('not found!')
            }
        } catch (err) {
            console.error(err)
            setSignResult(`Error: ${err.message}`)
        }


    }

    /**
     * Personal Sign Verify
     */
    const verify = async () => {
        const exampleMessage = 'Example `personal_sign` message'
        try {
            const from = addr
            // const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
            const sign = signResult
            const msg = Web3.utils.soliditySha3(exampleMessage);

            const recoveredAddr = recoverPersonalSignature({
                'data': msg,
                'sig': sign,
            })
            if (recoveredAddr === from) {
                console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`)
                setRecoverResult(recoveredAddr)
            } else {
                console.log(`SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`)
                console.log(`Failed comparing ${recoveredAddr} to ${from}`)
            }
            const ecRecoverAddr = await window.ethereum.request({
                method: 'personal_ecRecover',
                params: [msg, sign],
            })
            if (ecRecoverAddr === from) {
                console.log(`Successfully ecRecovered signer as ${ecRecoverAddr}`)
                setEcRecoverResult(ecRecoverAddr)
            } else {
                console.log(`Failed to verify signer when comparing ${ecRecoverAddr} to ${from}`)
            }
        } catch (err) {
            console.error(err)
            setRecoverResult(`Error: ${err.message}`)
            setEcRecoverResult(`Error: ${err.message}`)
        }
    }

    const onClickInstall = () => {
        setButton1('Onboarding in progress')
        setButton1Disabled(true)
        onBoard.startOnboarding()
    }

    const onClickConnect = async () => {
        try {
            const newAccounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })
            handleNewAccounts(newAccounts)
        } catch (error) {
            console.error(error)
        }
    }

    const updateButtons = () => {
        const accountButtonsDisabled = !isMetaMaskInstalled() || !isMetaMaskConnected()
        if (accountButtonsDisabled) {
            setButton2Disabled(true)
        } else {
            setButton2Disabled(false)
        }


        if (!isMetaMaskInstalled()) {
            setButton1('Click here to install MetaMask!')
            setButton1Disabled(false)
        } else if (isMetaMaskConnected()) {
            setButton1('Connected')
            setButton1Disabled(true)
            if (onBoard) {
                onBoard.stopOnboarding()
            }
        } else {
            setButton1('Connect')
            setButton1Disabled(false)
        }
    }

    function handleNewChain (chainId) {
        setChainId(chainId)
    }

    function handleNewNetwork (networkId) {
        setNetwork(networkId)
    }

    function handleNewAccounts (addr) {
        setAddr(addr[0])
        updateButtons()
    }

    async function getNetworkAndChainId () {
        try {
            const chainId = await window.ethereum.request({
                method: 'eth_chainId',
            })
            handleNewChain(chainId)

            const networkId = await window.ethereum.request({
                method: 'net_version',
            })
            handleNewNetwork(networkId)
        } catch (err) {
            console.error(err)
        }
    }


    const initialize = async () => {
        if (isMetaMaskInstalled()) {
            window.ethereum.autoRefreshOnNetworkChange = false
            window.ethereum.on('chainChanged', handleNewChain)
            window.ethereum.on('networkChanged', handleNewNetwork)
            window.ethereum.on('accountsChanged', handleNewAccounts)
        }
    }

    const isMetaMaskConnected = () => {
        setConnected(addr !== '')
        return addr !== ''
    }

    useEffect(() => {
        initialize().then(async () => {
            try {
                const newAccounts = await window.ethereum.request({
                    method: 'eth_accounts',
                })
                handleNewAccounts(newAccounts)
            } catch (err) {
                console.error('Error on init when getting accounts', err)
            }
        })
        return() => {
            console.log('clear initialization')
        }
        console.log('is registered: ', registered)
    }, [])

    useEffect(() => {
        updateButtons()
        return() => {
            console.log('clear button')
        }
    }, [button1Disabled, button2Disabled, button1, addr ])

    useEffect(() => {
        const { _from } = location.state || { from: { pathname: "/" } };
        if (addr.length === 42 && isValidAddress(addr)) {
            dispatch(authActions.checkUser(addr, _from))
        }
        return() => {
            console.log('clear check')
        }
    }, [addr])

    useEffect(() => {
        getNetworkAndChainId()
        return() => {
            console.log('clear networkId')
        }
    }, [chainId, network])

    useEffect(() => {
        setButton2(t('unlock'))
        return() => {
            console.log('clear unlock')
        }
    }, [t])

    useEffect(() => {
        return() => {
            console.log('clear window')
        }
    }, [height, width])

    return (
        <div className={classes.root}>
            <Card className={classes.walletBox}>
                <CardContent className={classes.walletContent}>
                    <Grid container spacing={2} >
                        <Grid item xs={12} >
                            <Typography className={classes.wrapper} color="textSecondary" gutterBottom>
                                {t('walletTitle')}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button style={{ width: 100 }}  className={classes.btn} onClick={sign} disabled={button2Disabled}>
                                {t('deposit')}
                            </Button>
                        </Grid>
                        <Grid item xs={8}>
                            <Button style={{ width: 180 }}  className={classes.btn} onClick={sign} disabled={button2Disabled}>
                                {t('withdraw')}
                            </Button>
                        </Grid>
                        {/*<Grid item xs={3} />*/}
                    </Grid>
                    <div style={{ height: 1, marginTop: 20, marginBottom: 20, backgroundColor: '#2435AC' }} />
                    <Grid container spacing={2} >
                        <Grid item xs={12} >
                            <Typography className={classes.wrapper} color="textSecondary" gutterBottom>
                                {t('capitalTitle')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <div className={classes.wrapper}>
                                {
                                    addr.length < 42 || !isValidAddress(addr) ?
                                        <Button className={classes.btn} onClick={!isMetaMaskInstalled() ? onClickInstall : onClickConnect} disabled={button1Disabled}
                                        >
                                            {button1}
                                        </Button> : null
                                }
                                {
                                    addr.length === 42 && isValidAddress(addr) ?
                                        <Button style={{ width: 197 }} className={classes.btn} onClick={sign} variant="outlined" color="primary" disabled={button2Disabled}>
                                            {button2}
                                        </Button> : null
                                }
                                <Typography variant="h5" component="h5" className={classes.result}>
                                    {signResult}
                                </Typography>
                                {/*<Button onClick={verify} variant="outlined" color="primary" disabled={button3Disabled}>*/}
                                {/*    {button3}*/}
                                {/*</Button>*/}
                                {/*<Typography variant="h5" component="h5" className={classes.result}>*/}
                                {/*    {recoveryResult}*/}
                                {/*</Typography>*/}
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </div>
    );
}

export default withTranslation()(Home);
