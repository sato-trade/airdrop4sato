import React, { useState, useEffect } from 'react';
import { useLocation, Link, Redirect } from 'react-router-dom';
import {
    Typography,
    Grid,
    Button,
    Card,
    CardContent,
    Modal,
    List,
    ListItem,
    ListItemAvatar,
    Avatar, ListItemText, ListItemSecondaryAction
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import MetaMaskOnboarding from '@metamask/onboarding'
import { isValidAddress } from 'ethereumjs-util'
import { walletActions } from '../../redux/actions/walletActions';
import { useDispatch, useSelector } from 'react-redux';
import useWindowDimensions from '../../utils/WindowDimensions'
import { getIcons, convertTimeString } from "../../utils/Common";
import {roundingDown} from "../../utils/RoundingDown";
import {history} from "../../utils/History";
import backArrow from "../../images/backArrow.png";

const Web3 = require("web3");
const { isMetaMaskInstalled } = MetaMaskOnboarding

function Records({t, navBarHeight}){
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
            paddingBottom: 30,

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
            maxWidth: 360,
            backgroundColor: 'transparent',
            maxHeight: 400,
            overflow: 'scroll',
        },
        backBtn: {
            float: 'left'
        },
        backArrow: {
            width: 20,
            height: 20
        },
    }));
    const classes = useStyles();
    const dispatch = useDispatch()
    const location = useLocation();

    const { token, loggedIn, registered } = useSelector(state => state.auth)
    const { tokenIcons, transactionRecords } = useSelector(state => state.wallet)

    const transactionType = {
        1: { name: t('stacks.deposit'), sign: '+' },
        2: { name: t('stacks.withdraw'), sign: '-' },
        3: { name: t('financials.add'), sign: '-' },
        4: { name: t('financials.remove'), sign: '+' },
        5: {
            name: {
                From: t('tabs.swap'),
                To: t('swap.swapReward')
            }, sign1: '+', sign2: '-'
        },
        6: { name: t('transactionHistory.collectReward'), sign: '+' }
    }
    const status = {
        0: t('submitted'),
        1: t('submitted'),
        2: t('processing'),
        3: t('succeed'),
        4: t('failed')
    }
    const depositStatus = {
        0: t('submitted'),
        1: t('submitted'),
        2: t('closed'),
        3: t('succeed'),
        4: t('failed')
    }
    const color = {
        0: '#ffd700',
        1: '#ffd700',
        2: '#76a26f',
        3: '#0f9d58',
        4: '#ff0040',
        5: '#3460B7',
        6: '#0f9d58',
    }

    useEffect(() => {
        if (loggedIn) {
            dispatch(walletActions.getTransactionRecords(token))
        }

        return() => {
            console.log('clear initialization')
        }
    }, [])

    return(
        <div className={classes.root}>
            <Card className={classes.walletBox}>
                <CardContent className={classes.walletContent}>
                    <Button className={classes.backBtn} onClick={() => {
                        history.back()
                    }} >
                        <Avatar alt="Travis Howard" src={backArrow} className={classes.backArrow} />
                    </Button>
                    <Grid container spacing={2} >
                        <Grid item xs={12} >
                            <Typography className={classes.wrapper} color="textSecondary" gutterBottom>
                                {t('capitalTitle')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <div className={classes.wrapper}>
                                {transactionRecords === undefined || transactionRecords.length <= 0 ?
                                    <Typography style={{ fontSize: 13 }}>{t('noCapitals')}</Typography> :
                                    <List className={classes.capitalList}>
                                        {
                                            transactionRecords.map(item => (
                                                <ListItem key={item.id} button>
                                                    <ListItemText  secondaryTypographyProps={{ style: {color: 'white'} }}  primary={item.type === 1 ? `${t('depositAction')} ${item.token}`
                                                        : `t('withdrawAction') ${item.token} `} secondary={convertTimeString(item.createdAt)} />
                                                    <ListItemText style={{ color: color[item.status] }}>{item.type === 1 ? depositStatus[item.status] : status[item.status]}</ListItemText>
                                                    <ListItemText>{transactionType[item.type].sign + roundingDown(item.amount, 4)}</ListItemText>
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
                </CardContent>
            </Card>
        </div>
    )
}

export default withTranslation()(Records);
