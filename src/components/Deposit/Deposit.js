import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Typography, Grid, Button, Card, CardContent, Avatar, TextField, InputAdornment, IconButton, MenuItem, FormHelperText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import useWindowDimensions from '../../utils/WindowDimensions'

import { walletActions } from '../../redux/actions/walletActions';
import { useDispatch, useSelector } from 'react-redux';
import { roundingDown } from '../../utils/RoundingDown'
import { getIcons } from "../../utils/Common";
import backArrow from '../../images/backArrow.png'
import { history } from '../../utils/History';
import { isNumeric } from "../../utils/Common";
import {wallet} from "../../redux/reducers/wallet";
import { unlock, isMetaMaskConnected, onClickInstall, onClickConnect, onBoard, isMetaMaskInstalled } from '../../utils/Sign'
import {isValidAddress} from "ethereumjs-util";
const Web3 = require("web3");

function Deposit({t, navBarHeight, address, chainId, network,
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
        depositBox: {
            width: 600,
            borderRadius: 24,
            backgroundColor: '#101B66',
            justifyContent: 'center',
            display: 'inline-flex',
            marginTop: 100,
            paddingTop: 30,
            paddingBottom: 30
        },
        depositContent: {
            width: 500,
            alignItems: 'flex-start',
        },
        wrapper: {
            color: 'white',
            alignItems: 'flex-start',
            display: 'flex',
            fontSize: 25
        },
        fieldWrapper: {
            justifyContent: 'baseline'
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
        capitalList: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: 'transparent',
        },
        backBtn: {
            float: 'left'
        },
        backArrow: {
            width: 20,
            height: 20
        },
        contentWrapper: {
            fontSize: 15,
            color: 'white'
        },
        inputField: {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%',
            color: 'red'
        },
        allIn: {
            color: 'white',
            fontSize: 15
        },
        helperText: {
            color: '#ff3434'
        }
    }));
    const classes = useStyles();

    const [depositAmount, setDepositAmount] = useState('')
    const [coin, setCoin] = React.useState('SAP');
    const [capital, setCapital] = React.useState({free: 0})
    const [warning, setWarning] = React.useState('')
    const [canDeposit, setCanDeposit] = React.useState(false)
    const [coins, setCoins] = React.useState([])


    const { token, loggedIn, registered } = useSelector(state => state.auth)
    const { userCapitals, tokenList, tokenIcons } = useSelector(state => state.wallet)
    const dispatch = useDispatch();
    const location = useLocation();
    const inputRef = React.useRef();

    const allIn = () => {
        handleAmountChange(roundingDown(capital.free, 4))
    }

    const handleAmountChange = (amount) => {
        console.log('amount: ', amount)
        setDepositAmount( amount );
        if (isNumeric(amount)) {
            if ( parseFloat(amount) <= capital) {
                setWarning('')
                setCanDeposit(true)
            } else {
                setWarning('not enough capitals')
                setCanDeposit(false)
            }
        } else {
            if (amount === '') {
                setWarning('')
            } else {
                setWarning('invalid input')
            }
            setCanDeposit(false)
        }

    };

    const handleCoinChange = (event) => {
        setCoin(event.target.value);
    };

    const confirmDeposit = async () => {
        let payload = {
            l1Address: address,
            l2Address: address,
            amount: depositAmount,
            coin: coin,
        }
        try {
            dispatch(walletActions.deposit(payload))

        } catch(err) {
            console.log('deposit failed: ', err)
        }
    }

    useEffect(() => {
        if (loggedIn) {
            dispatch(walletActions.getUserCapital(token))
            dispatch(walletActions.getAllTokenStatus(token))
        }
        return() => {
            console.log('clear initialization')
        }
    }, [])

    useEffect(() => {
        if (loggedIn) {
            dispatch(walletActions.getUserCapital(token))
            dispatch(walletActions.getAllTokenStatus(token))
        }
        return() => {
            console.log('clear login')
        }
    }, [loggedIn])

    useEffect(() => {
        let _coins = []
        for (let i = 0; i < tokenList.length; i ++) {
            if (tokenList[i].depositIsOn) {
                _coins.push({
                    label: tokenList[i].token,
                    value: tokenList[i].token
                })
            }
        }

        setCoins(_coins)
        return() => {
            console.log('clear set coins')
        }

    }, [tokenList])


    useEffect(() => {
        let _capital = userCapitals.find(item => item.token === coin)
        if (_capital === undefined) {
            _capital = {
                free: 0,
                token: coin
            }
        }
        setCapital(_capital)
        return() => {
            console.log('clear capital check')
        }

    },[coin])

    return (
        <div className={classes.root}>
            <Card className={classes.depositBox}>
                <CardContent className={classes.depositContent}>
                    <Button className={classes.backBtn} onClick={() => {
                        history.back()
                    }} >
                        <Avatar alt="Travis Howard" src={backArrow} className={classes.backArrow} />
                    </Button>
                    <Grid container spacing={2} >
                        <Grid item xs={12} >
                            <Typography className={classes.wrapper} color="textSecondary" gutterBottom>
                                {t('deposit')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <Typography className={classes.contentWrapper} color="textSecondary" gutterBottom>
                                {t('depositContent')}
                            </Typography>
                        </Grid>
                    </Grid>
                    <div style={{ height: 1, marginTop: 20, marginBottom: 20, backgroundColor: '#2435AC' }} />
                    <Grid container spacing={2} className={classes.fieldWrapper }>
                        <Grid item xs={6} >
                            <TextField
                                inputRef={inputRef}
                                label={t('depositAmount')}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                    style: {
                                        color: 'white',
                                        borderBottom: 'white',
                                    },
                                }}
                                InputProps={{
                                    style: {
                                        color: 'white',
                                        backgroundColor: 'transparent',
                                        borderBottom: 'transparent'
                                    },
                                    endAdornment: <InputAdornment position="end"><IconButton className={classes.allIn} onClick={allIn} position="end">{t('all')}</IconButton></InputAdornment>
                                }}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                onBlur={() => {setWarning('')}}
                                variant="standard"
                                value={depositAmount}
                                helperText={warning}
                                FormHelperTextProps={{
                                    className: classes.helperText
                                }}
                                error={warning !== ''}
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                select
                                label={`${t('availableCapital')} ${roundingDown(capital.free, 4)} ${capital.token}`}
                                InputLabelProps={{
                                    shrink: true,
                                    style: {
                                        color: 'white',
                                        borderBottom: 'white',
                                        width: 'max-content'
                                    },
                                }}
                                value={coin}
                                onChange={handleCoinChange}
                                InputProps={{
                                    style: {
                                        color: 'white',
                                        backgroundColor: 'transparent',
                                        borderBottom: 'transparent'
                                    },
                                }}
                            >
                                {coins.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Grid container >
                                            <Grid item xs={6} >
                                                <Avatar alt="Travis Howard" style={{ width:20, height: 20 }} src={getIcons(option.label, tokenIcons, true)} />
                                            </Grid>
                                            <Grid item xs={6} >
                                                {option.label}
                                            </Grid>
                                        </Grid>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            {
                                address.length < 42 || !isValidAddress(address) ?
                                    <Button className={classes.btn} onClick={!isMetaMaskInstalled() ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : onClickConnect}
                                    >
                                        {button1}
                                    </Button> : null
                            }
                            {
                                address.length === 42 && isValidAddress(address) ?
                                    loggedIn ?
                                    <Button style={{ width: 180 }}  className={classes.btn} disabled={!loggedIn} onClick={confirmDeposit} disabled={false}>
                                        {t('deposit')}
                                    </Button> :
                                    <Button style={{ width: 180 }}  className={classes.btn}  onClick={() => unlock('unlock', address, chainId, network, Web3, registered, dispatch )} disabled={button2Disabled}>
                                        {t('unlock')}
                                    </Button> : null
                            }
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default withTranslation()(Deposit);
