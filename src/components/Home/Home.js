import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button, Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import './Home.css';
import {withTranslation} from 'react-i18next';
import {isValidAddress} from 'ethereumjs-util'
import {onClickConnect, onClickInstall, unlock} from '../../utils/Sign'

import {useDispatch, useSelector} from 'react-redux';

const Web3 = require("web3");

function Home({ t, navBarHeight, address, network, chainId,
    sendBackButton1, sendBackButton1Disabled, button1, button1Disabled,
    sendBackButton2, sendBackButton2Disabled, button2, button2Disabled
}) {


    const useStyles = makeStyles((theme) => ({
        root: {
            ...theme.typography.button,
            backgroundColor: '#010846',
            padding: theme.spacing(1),
            flexGrow: 1,
            textAlign: 'center',
            height:1000
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
            fontWeight: '600',
        },

        textMid: {
            color: 'white',
            fontSize: 20,
            fontWeight: '600'
        },

        textSmall: {
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            textTransform:"none"
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
    const { registered, loggedIn, loading } = useSelector(state => state.auth)
    const dispatch = useDispatch();

    return (
        <div className={classes.root}>
            {
                loggedIn ? <Redirect to='/wallet' /> :
                    <div className='cards__container'>
                        <div className='cards__wrapper'>

                            <div className='cards__title__wrapper'>
                                <Typography className={classes.textLarge} style={{textTransform:'none'}}>
                                    {t('walletTitle')}

                                </Typography>
                                <Link to='/wallet/records'>
                                    <Button className={classes.textSmall} color="textSecondary">
                                        {t('records')}
                                    </Button>
                                </Link>
                            </div>

                            <div className='cards__buttons__wrapper'>
                                <Link to='/wallet/deposit' style={{ textDecoration: 'none', alignItems: 'center', justifyContent: 'center' }}>
                                    <Button style={{textTransform:'none', backgroundColor: '#1DF0A9', fontSize: 16, fontWeight: 'bold', height: 42, borderRadius: 21, padding: 16, color: '#010746' }}>
                                        {t('deposit')}
                                    </Button>
                                </Link>
                                <Link to='/wallet/withdraw' style={{ textDecoration: 'none', alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}>
                                    <Button style={{textTransform:'none', backgroundColor: '#192786', fontSize: 16, fontWeight: 'bold', height: 42, borderRadius: 21, padding: 16, color: '#8FB9E1' }}>
                                        {t('withdraw')}
                                    </Button>
                                </Link>
                            </div>

                            <div style={{ height: 1, marginTop: 40, marginBottom: 20, backgroundColor: '#2134A7' }} />
                            <div className='cards__title__wrapper'>
                                <Typography className={classes.textMid} color="textSecondary" style={{textTransform:'none'}} gutterBottom>
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
                                                <Button style={{ textTransform:'none',backgroundColor: '#1DF0A9', fontSize: 16, fontWeight: 'bold', height: 42, borderRadius: 21, padding: 16, color: '#010746' }} onClick={!window.ethereum ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : onClickConnect}>
                                                    {button1}
                                                </Button>
                                                :
                                                null
                                        }
                                        {
                                            address.length === 42 && isValidAddress(address) ?
                                                <Button style={{textTransform:'none', width: 197 }} className={button2Disabled ? classes.btn_disabled : classes.btn} onClick={(!registered || !loggedIn) && !loading ? () => unlock('unlock', address, chainId, network, Web3, registered, dispatch) : null} variant="outlined" color="primary" disabled={button2Disabled}>
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
