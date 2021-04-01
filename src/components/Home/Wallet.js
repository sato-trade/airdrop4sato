import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Typography, Grid, Button, Card, CardContent,
    List, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Home.css';
import { withTranslation } from 'react-i18next';
import useWindowDimensions from '../../utils/WindowDimensions'

import { walletActions } from '../../redux/actions/walletActions';
import { useDispatch, useSelector } from 'react-redux';
import { roundingDown } from '../../utils/RoundingDown'
import { getIcons } from "../../utils/Common";
import {history} from "../../utils/History";
import backArrow from "../../images/backArrow.png";
import {isValidAddress} from "ethereumjs-util";
import {isMetaMaskInstalled, onClickConnect, onClickInstall, unlock} from "../../utils/Sign";

function Wallet({t, navBarHeight}) {
    const { height, width } = useWindowDimensions();
    const useStyles = makeStyles((theme) => ({
        root: {
            ...theme.typography.button,
            backgroundColor: '#010846',
            padding: theme.spacing(1),
            flexGrow: 1,
            minHeight: height - navBarHeight,
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
        },
        capitalList: {
            width: '100%',
            backgroundColor: 'transparent',
        },
        recordWrapper: {
            backgroundColor: 'transparent',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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
            fontWeight: '600'
        },
    }));
    const classes = useStyles();

    const { token, loggedIn } = useSelector(state => state.auth)
    const { userCapitals, tokenIcons } = useSelector(state => state.wallet)
    const dispatch = useDispatch();

    useEffect(() => {
        if (loggedIn) {
            dispatch(walletActions.getUserCapital(token))
            dispatch(walletActions.getAllTokenStatus(token))
        }
        return() => {
        }
    }, [])

    return (
        <div className={classes.root}>
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
                            <div className={classes.wrapper}>
                                {userCapitals === undefined || userCapitals.length <= 0 ?
                                    <Typography style={{ fontSize: 13 }}>{t('noCapitals')}</Typography> :
                                    <List className={classes.capitalList}>
                                        {
                                            userCapitals.map(item => (
                                                <ListItem key={item.id} button>
                                                    <ListItemAvatar>
                                                        <Avatar alt="Travis Howard" src={getIcons(item.token, tokenIcons, true)} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={item.token} />
                                                    <ListItemSecondaryAction>
                                                        <Typography>{roundingDown(item.free, 4)}</Typography>
                                                    </ListItemSecondaryAction>

                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                }
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>

        </div>
    );
}

export default withTranslation()(Wallet);
