import React, { useState, useEffect } from 'react';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { Typography, Grid, Button, Card, CardContent, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Home.css';
import { withTranslation } from 'react-i18next';
import MetaMaskOnboarding from '@metamask/onboarding'
import { isValidAddress } from 'ethereumjs-util'
import useWindowDimensions from '../../utils/WindowDimensions'
import { unlock, isMetaMaskConnected, onClickInstall, onClickConnect, onBoard, isMetaMaskInstalled } from '../../utils/Sign'

import { authActions } from '../../redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';

const Web3 = require("web3");
const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
    ? 'http://localhost:9010'
    : undefined

function Home({t, navBarHeight, address, network, chainId,
                  sendBackButton1, sendBackButton1Disabled, button1, button1Disabled,
                  sendBackButton2, sendBackButton2Disabled, button2, button2Disabled
}) {


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

    const updateButtons = () => {
        const accountButtonsDisabled = !isMetaMaskInstalled() || !isMetaMaskConnected()
        if (accountButtonsDisabled) {
            sendBackButton2Disabled(true)
        } else {
            sendBackButton2Disabled(false)
        }
        if (!isMetaMaskInstalled()) {
            sendBackButton1('Click here to install MetaMask!')
            sendBackButton1Disabled(false)
        } else if (isMetaMaskConnected()) {
            sendBackButton1(t('connected'))
            sendBackButton1Disabled(true)
            if (onBoard) {
                onBoard.stopOnboarding()
            }
        } else {
            sendBackButton1('Connect')
            sendBackButton1Disabled(false)
        }
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
        sendBackButton2(t('unlock'))
        return() => {
            console.log('clear unlock')
        }
    }, [t])

    useEffect(() => {
        if (loading) {
            sendBackButton2(t('loading'))
        }
        if (loggingIn) {
            sendBackButton2(t('loggingIn'))
        } else {
            if (registered) {
                if (loggedIn) {
                    sendBackButton2(t('loggedIn'))
                    sendBackButton2Disabled(true)
                }
            } else {
                sendBackButton2(t('unlock'))
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
                                    <Link to='/wallet/deposit'>
                                        <Button style={{ width: 100 }}  className={classes.btn}>
                                            {t('deposit')}
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={8}>
                                    <Link to='/wallet/withdraw'>
                                        <Button style={{ width: 180 }}  className={classes.btn}>
                                            {t('withdraw')}
                                        </Button>
                                    </Link>
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
                                                <Button className={classes.btn} onClick={!isMetaMaskInstalled() ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : onClickConnect}
                                                >
                                                    {button1}
                                                </Button> : null
                                        }
                                        {
                                            address.length === 42 && isValidAddress(address) ?
                                                <Button style={{ width: 197 }} className={button2Disabled ? classes.btn_disabled : classes.btn} onClick={!registered || !loggedIn ? () => unlock('unlock', address, chainId, network, Web3, registered, dispatch) : null} variant="outlined" color="primary" disabled={button2Disabled}>
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
