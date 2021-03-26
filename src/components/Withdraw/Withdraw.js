import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Typography,
    Grid,
    Button,
    Card,
    CardContent,
    Avatar,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem,
    FormHelperText,
    Backdrop, Fade, Modal, Input, InputBase, InputLabel, FormControl
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import useWindowDimensions from '../../utils/WindowDimensions'

import { walletActions } from '../../redux/actions/walletActions';
import { useDispatch, useSelector } from 'react-redux';
import { roundingDown } from '../../utils/RoundingDown'
import { getIcons, formDateString } from "../../utils/Common";
import backArrow from '../../images/backArrow.png'
import { history } from '../../utils/History';
import { isNumeric } from "../../utils/Common";
import {wallet} from "../../redux/reducers/wallet";
import { unlock, isMetaMaskConnected, onClickInstall, onClickConnect, onBoard, isMetaMaskInstalled } from '../../utils/Sign'
import {isValidAddress} from "ethereumjs-util";
import CancelIcon from '@material-ui/icons/Cancel';
const Web3 = require("web3");
let web3 = new Web3(window.ethereum)

function Withdraw({t, navBarHeight, address, chainId, network,
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
        fillAddress: {
            color: 'white',
            fontSize: 15
        },
        helperText: {
            color: '#ff3434'
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

    const [withdrawTo, setWithdrawTo] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [coin, setCoin] = React.useState('SAP');
    const [capital, setCapital] = React.useState({free: 0})
    const [warning, setWarning] = React.useState('')
    const [cantWithdraw, setCantWithdraw] = React.useState(true)
    const [coins, setCoins] = React.useState([])


    const { token, loggedIn, registered } = useSelector(state => state.auth)
    const { tokenList, tokenIcons, userCapitals, withdrawFinished, withdrawSucceed, message, hash, receipt, confirmationNumber } = useSelector(state => state.wallet)
    const dispatch = useDispatch();
    const location = useLocation();
    const inputRef = React.useRef();

    const [openCallback, setOpenCallback] = useState(false)
    const [time, setTime] = useState('')

    const allIn = () => {
        handleAmountChange(roundingDown(capital.free, 4))
    }

    const fillAddress = () => {
        handleAmountChange(roundingDown(capital.free, 4))
    }

    const handleOpenCallback = () => {
        setOpenCallback(true);
    };

    const handleCloseCallback = () => {
        setOpenCallback(false);
    };

    const handleAmountChange = (amount) => {
        console.log('amount: ', amount)
        setWithdrawAmount( amount );
        if (isNumeric(amount)) {
            if ( parseFloat(amount) <= capital.free) {
                setWarning('')
                setCantWithdraw(false)
            } else {
                setWarning('not enough capitals')
                setCantWithdraw(true)
            }
        } else {
            if (amount === '') {
                setWarning('')
            } else {
                setWarning('invalid input')
            }
            setCantWithdraw(true)
        }

    };

    const handleCoinChange = (event) => {
        setCoin(event.target.value);
    };

    const confirmWithdraw = async () => {
        let payload = {
            l1Address: address,
            l2Address: address,
            amount: withdrawAmount,
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
    }, [loggedIn, address])

    useEffect(() => {
        let _coins = []
        for (let i = 0; i < tokenList.length; i ++) {
            if (tokenList[i].withdrawIsOn) {
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

    },[coin, address, userCapitals])

    useEffect(() => {
        if (hash.length > 0 && !withdrawFinished) {
            setTime(formDateString(new Date().getTime()))
            handleOpenCallback()
            return () => {
                console.log('clear pop modal')
            }
        }
    },[hash, withdrawFinished])

console.log('userCapitals: ', userCapitals)

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
                                {t('withdraw')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <Typography className={classes.contentWrapper} color="textSecondary" gutterBottom>
                                {t('withdrawContent')}
                            </Typography>
                        </Grid>
                    </Grid>
                    <div style={{ height: 1, marginTop: 20, marginBottom: 20, backgroundColor: '#2435AC' }} />
                    <Grid container spacing={2} className={classes.fieldWrapper }>
                        <Grid item xs={12} >
                            <TextField
                                inputRef={inputRef}
                                label={t('withdrawAddress')}
                                type="number"
                                fullWidth
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
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton className={classes.fillAddress} onClick={fillAddress} position="end">{t('l1Wallet')}</IconButton>
                                        <CancelIcon />
                                    </InputAdornment>
                                }}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                onBlur={() => {setWarning('')}}
                                variant="standard"
                                value={withdrawAmount}
                                helperText={warning}
                                FormHelperTextProps={{
                                    className: classes.helperText
                                }}
                                error={warning !== ''}
                            />
                        </Grid>
                        <Grid item xs={8} >
                            <TextField
                                inputRef={inputRef}
                                label={t('withdrawAmount')}
                                type="number"
                                fullWidth
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
                                    endAdornment: <InputAdornment position="end"><IconButton className={classes.fillAddress} onClick={allIn} position="end">{t('all')}</IconButton></InputAdornment>
                                }}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                onBlur={() => {setWarning('')}}
                                variant="standard"
                                value={withdrawAmount}
                                helperText={warning}
                                FormHelperTextProps={{
                                    className: classes.helperText
                                }}
                                error={warning !== ''}
                            />
                        </Grid>
                        <Grid item xs={4} >
                            <TextField
                                select
                                fullWidth
                                label={`${t('l2Amount')} ${loggedIn ? roundingDown(capital.free, 4) : '--'} ${capital.token}`}
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
                                        <Button style={{ width: 180 }}  className={classes.btn} disabled={!loggedIn} onClick={confirmWithdraw} disabled={cantWithdraw}>
                                            {t('confirm')}
                                        </Button> :
                                        <Button style={{ width: 180 }}  className={classes.btn}  onClick={() => unlock('unlock', address, chainId, network, Web3, registered, dispatch )} disabled={button2Disabled}>
                                            {t('unlock')}
                                        </Button> : null
                            }
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Modal
                disablePortal
                disableEnforceFocus
                disableAutoFocus
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
                className={classes.modal}
                open={openCallback}
                onClose={handleCloseCallback}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openCallback}>
                    <div className={classes.paper}>
                        <h2 id="server-modal-title">{withdrawSucceed && withdrawFinished ? t('withdrawSucceed') : t('confirming')}</h2>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('withdrawAmount')}: ${withdrawAmount}`}</p>

                            </Grid>
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('time')}: ${time}`}</p>
                            </Grid>
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('action')}: ${t('depositAction')}`}</p>
                            </Grid>
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('status')}: ${withdrawFinished && withdrawSucceed ?  t('withdrawSucceed') : t('loading')}`}</p>
                            </Grid>
                            {
                                Object.keys(receipt).length > 0 ?
                                    <Grid item xs={12} >
                                        <p id="server-modal-description">{`${t('confirmedBlock')}: ${receipt.blockNumber}`}</p>
                                    </Grid> : null

                            }
                            {
                                hash.length > 1 ?
                                    <Grid item xs={12} >
                                        <Button target="_blank" href={"https://ropsten.etherscan.io/tx/" + hash} style={{ width: 180 }}  className={classes.btn} >
                                            {t('checkEtherscan')}
                                        </Button>
                                    </Grid> : null
                            }
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default withTranslation()(Withdraw);
