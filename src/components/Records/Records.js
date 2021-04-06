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
    Avatar, ListItemText, ListItemSecondaryAction, Backdrop, Fade
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import MetaMaskOnboarding from '@metamask/onboarding'
import { isValidAddress } from 'ethereumjs-util'
import { walletActions } from '../../redux/actions/walletActions';
import { useDispatch, useSelector } from 'react-redux';
import useWindowDimensions from '../../utils/WindowDimensions'
import { getIcons, convertTimeString } from "../../utils/Common";
import { roundingDown } from "../../utils/RoundingDown";
import { history } from "../../utils/History";
import backArrow from "../../images/backArrow.png";
import CustomButton from "../CommonElements/CustomButton";
import { isMetaMaskInstalled, onClickConnect, onClickInstall, unlock } from "../../utils/Sign";
import './Record.css';
const Web3 = require("web3");

function Records({ t, navBarHeight, address, chainId, network,
    sendBackButton1, sendBackButton1Disabled, button1, button1Disabled,
    sendBackButton2, sendBackButton2Disabled, button2, button2Disabled }) {
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
        wrapper: {
            color: 'white',
            alignItems: 'flex-start',
        },
        capitalList: {
            width: '100%',
            backgroundColor: 'transparent',
            maxHeight: 400,
            overflow: 'auto',
        },
        backBtn: {
            float: 'left'
        },
        backArrow: {
            width: 20,
            height: 20
        },
        textMid: {
            color: 'white',
            fontSize: 20,
            fontWeight: '600'
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // width: width * 0.5,
            // height: height * 0.5
        },
        paper: {
            backgroundColor: 'white',
            border: 'transparent',
            // boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            borderRadius: 20,
            textAlign: 'center'
        },
    }));
    const classes = useStyles();
    const dispatch = useDispatch()
    const location = useLocation();

    const { token, loggedIn, registered } = useSelector(state => state.auth)
    const { tokenIcons, transactionRecords } = useSelector(state => state.wallet)

    const [time, setTime] = useState('')
    const [amount, setAmount] = useState(0)
    const [type, setType] = useState(0)
    const [state, setState] = useState('')
    const [hash, setHash] = useState('')
    const [openRecordDetail, setOpenRecordDetail] = useState(false)
    const [coin, setCoin] = useState('')

    const handleOpenRecordDetail= (item) => {
        setOpenRecordDetail(true);
        setTime(convertTimeString(item.createdAt))
        setAmount(item.amount)
        setType(item.type)
        setState(item.status)
        setHash(item.txId)
        setCoin(item.token)
    };

    const handleCloseRecordDetail= () => {
        setOpenRecordDetail(false);
    };

    const transactionType = {
        1: { name: t('depositAction'), sign: '+' },
        2: { name: t('withdrawAction'), sign: '-' },
        3: { name: 'add', sign: '-' },
        4: { name: 'remove', sign: '+' },
        5: {
            name: {
                From: t('tabs.swap'),
                To: t('swap.swapReward')
            }, sign1: '+', sign2: '-'
        },
        6: { name: t('transactionHistory.collectReward'), sign: '+' },
        0: { name: '', sign: '' }
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

        return () => {
            console.log('clear initialization')
        }
    }, [])

    useEffect(() => {
        if (loggedIn) {
            dispatch(walletActions.getTransactionRecords(token))
        }

        return () => {
            console.log('clear login')
        }
    }, [loggedIn])

    return (
        <div className={classes.root}>
            <div className='deposit__container'>
                <div className='deposit__wrapper'>
                    <Button style={{ left: -24 }} onClick={() => {
                        history.back()
                    }} >
                        <Avatar alt="Travis Howard" src={backArrow} className={classes.backArrow} />
                    </Button>
                    <Grid container spacing={2} >

                        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            <Typography style={{ textTransform: 'none', fontSize: 24, fontWeight: '600', color: 'white' }} gutterBottom>
                                {t('records')}
                            </Typography>
                        </div>


                        <Grid item xs={12} >
                            <div className={classes.wrapper}>
                                {!loggedIn ? null : transactionRecords === undefined || transactionRecords.length <= 0 ?
                                    <Typography style={{ fontSize: 13 }}>{t('noRecords')}</Typography> :
                                    <List className={classes.capitalList}>
                                        {
                                            transactionRecords.map(item => (
                                                <ListItem key={item.id} button onClick={() => handleOpenRecordDetail(item)}>
                                                    <ListItemText  secondaryTypographyProps={{ style: {color: 'white'} }}  primary={`${transactionType[item.type].name} ${item.token}`} secondary={convertTimeString(item.createdAt)} />
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
                            <Grid item xs={12}>
                                {
                                    address.length < 42 || !isValidAddress(address) ?
                                        <CustomButton style={{ width: '100%' }} onClick={!isMetaMaskInstalled()  ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : onClickConnect}
                                        >
                                            {button1}
                                        </CustomButton> : null
                                }
                                {
                                    address.length === 42 && isValidAddress(address) ?
                                        loggedIn ?
                                            null :
                                            <CustomButton style={{ width: '100%' }} onClick={() => unlock('unlock', address, chainId, network, Web3, registered, dispatch)} disabled={button2Disabled}>
                                                {t('unlock')}
                                            </CustomButton> : null
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Modal
                disablePortal
                disableEnforceFocus
                disableAutoFocus
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
                className={classes.modal}
                open={openRecordDetail}
                onClose={handleCloseRecordDetail}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openRecordDetail}>
                    <div className={classes.paper}>
                        <h2 id="server-modal-title">{t('transactionDetails')}</h2>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('time')}: ${time}`}</p>
                            </Grid>
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('action')}: ${t(transactionType[type].name)} ${amount} ${coin}`}</p>
                            </Grid>
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('status')}: ${type === 1 ? t(depositStatus[state]) : t(status[state])}`}</p>
                            </Grid>
                            {
                                hash > 1 ?
                                    <Grid item xs={12} >
                                        <Button target="_blank" href={"https://ropsten.etherscan.io/tx/" + hash} style={{ width: 180 }} className={classes.btn} >
                                            {t('checkEtherscan')}
                                        </Button>
                                    </Grid> : null
                            }
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default withTranslation()(Records);
