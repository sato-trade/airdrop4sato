import React, { useState, useEffect } from 'react';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { Typography, Grid, Button, Card, CardContent, Modal } from '@material-ui/core';
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

function Home({t, navBarHeight, address, network, chainId}) {
    const [ connected, setConnected ] = useState(false)
    const [ signResult, setSignResult ] = useState('')
    const [button1, setButton1] = useState('')
    const [button2, setButton2] = useState(t('unlock'))
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
            fontWeight: 600,
        },
        btn_disabled: {
            backgroundColor: '#83ACF4',
            color: '#010846',
            borderColor: 'transparent',
            borderRadius: 25,
            height: 45,
            fontWeight: 600,
            opacity: 0.2
        }
    }));
    const classes = useStyles();

    const { registered, loggedIn, loggingIn, loading } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const location = useLocation();
    /**
     * Personal Sign
     */
    const sign = async () => {
        const exampleMessage = 'Example `personal_sign` message'
        try {
            const from = address
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


            let payload = {
                data: exampleMessage,
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
            setSignResult(`Error: ${err.message}`)
        }
    }

    /**
     * Personal Sign Verify
     */
    const onClickInstall = () => {
        setButton1('Onboarding in progress')
        setButton1Disabled(true)
        onBoard.startOnboarding()
    }

    const onClickConnect = async () => {
        console.log('clicked!!!!!!')
        try {
            const newAccounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })
            // handleNewAccounts(newAccounts)
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

    const isMetaMaskConnected = () => {
        setConnected(address !== '')
        return address !== ''
    }


    useEffect(() => {
        updateButtons()
        return() => {
            console.log('clear button')
        }
    }, [button1Disabled, button2Disabled, button1, address ])

    useEffect(() => {
        console.log('checking user')
        const { _from } = location.state || { from: { pathname: "/" } };
        if (address.length === 42 && isValidAddress(address)) {
            dispatch(authActions.checkUser(address, _from))
        }
        return() => {
            console.log('clear check')
        }
    }, [address, network, chainId])


    useEffect(() => {
        setButton2(t('unlock'))
        return() => {
            console.log('clear unlock')
        }
    }, [t])

    useEffect(() => {
        if (loading) {
            setButton2(t('loading'))
        }
        if (loggingIn) {
            setButton2(t('loggingIn'))
        } else {
            if (registered) {
                if (loggedIn) {
                    setButton2(t('loggedIn'))
                    setButton2Disabled(true)
                }
            } else {
                setButton2(t('unlock'))
            }
        }
        return() => {
            console.log('clear registration')
        }
    }, [registered, loggedIn, loggingIn, loading])

    return (
        <div className={classes.root}>
            {
                loggedIn ? <Redirect to='/wallet' /> :
                    <Card className={classes.walletBox}>
                        <CardContent className={classes.walletContent}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} >
                                    <Typography className={classes.wrapper} color="textSecondary" gutterBottom>
                                        {t('walletTitle')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button style={{ width: 100 }}  className={classes.btn} disabled={button2Disabled}>
                                        {t('deposit')}
                                    </Button>
                                </Grid>
                                <Grid item xs={8}>
                                    <Button style={{ width: 180 }}  className={classes.btn} disabled={button2Disabled}>
                                        {t('withdraw')}
                                    </Button>
                                </Grid>
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
                                            address.length < 42 || !isValidAddress(address) ?
                                                <Button className={classes.btn} onClick={!isMetaMaskInstalled() ? onClickInstall : onClickConnect} disabled={button1Disabled}
                                                >
                                                    {button1}
                                                </Button> : null
                                        }
                                        {
                                            address.length === 42 && isValidAddress(address) ?
                                                <Button style={{ width: 197 }} className={button2Disabled ? classes.btn_disabled : classes.btn} onClick={!registered || !loggedIn ? sign : null} variant="outlined" color="primary" disabled={button2Disabled}>
                                                    {button2}
                                                </Button> : null
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
            }
        </div>
    );
}

export default withTranslation()(Home);
