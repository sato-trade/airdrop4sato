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

function Home({ t, navBarHeight, address, network, chainId,
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
            maxWidth: 441,
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
        textLarge: {
            color: 'white',
            fontSize: 24,
            fontWeight: '600'
        },

        textMid: {
            color: 'white',
            fontSize: 20,
            fontWeight: '600'
        },

        textSmall: {
            color: 'white',
            fontSize: 16,
            fontWeight: '600'
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
            minWidth: 100
        },
        btn_disabled: {
            backgroundColor: '#83ACF4',
            color: '#010846',
            borderColor: 'transparent',
            borderRadius: 25,
            height: 45,
            fontWeight: 600,
            opacity: 0.2
        },
    }));
    const classes = useStyles();
    const { registered, loggedIn, loggingIn, loading } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const location = useLocation();

    return (
        <div className={classes.root}>
            {
                loggedIn ? <Redirect to='/wallet' /> :
                    <div className='cards__container'>
                        <div className='cards__wrapper'>

                            <div className='cards__title__wrapper'>
                                <Typography className={classes.textLarge} gutterBottom>
                                    {t('walletTitle')}

                                </Typography>
                                <Link to='/'>
                                    <Button className={classes.textSmall} color="textSecondary" gutterBottom>
                                        资金记录
                                    </Button>
                                </Link>
                            </div>

                            <div className='cards__buttons__wrapper'>
                                <Link to='/wallet/deposit' style={{ textDecoration: 'none', alignItems: 'center', justifyContent: 'center' }}>
                                    <Button style={{ backgroundColor: '#1DF0A9', fontSize: 16, fontWeight: 'bold', height: 42, borderRadius: 21, padding: 16, color: '#010746' }}>
                                        {t('deposit')}
                                    </Button>
                                </Link>
                                <Link to='/wallet/withdraw' style={{ textDecoration: 'none', alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}>
                                    <Button style={{ backgroundColor: '#192786', fontSize: 16, fontWeight: 'bold', height: 42, borderRadius: 21, padding: 16, color: '#8FB9E1' }}>
                                        {t('withdraw')}
                                    </Button>
                                </Link>
                            </div>

                            <div style={{ height: 1, marginTop: 40, marginBottom: 20, backgroundColor: '#2134A7' }} />
                            <div className='cards__title__wrapper'>
                                <Typography className={classes.textMid} color="textSecondary" gutterBottom>
                                    {t('capitalTitle')}
                                </Typography>
                            </div>
                            <Grid container spacing={2} >
                                <Grid item xs={12} >

                                </Grid>
                                <Grid item xs={12} >
                                    <div className={classes.wrapper}>
                                        {
                                            address.length < 42 || !isValidAddress(address) ?
                                                <Button style={{ backgroundColor: '#1DF0A9', fontSize: 16, fontWeight: 'bold', height: 42, borderRadius: 21, padding: 16, color: '#010746' }} onClick={!isMetaMaskInstalled() ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : onClickConnect}>
                                                    {button1}
                                                </Button>
                                                :
                                                null
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
                        </div>
                    </div>
            }
        </div>
    );
}

export default withTranslation()(Home);
