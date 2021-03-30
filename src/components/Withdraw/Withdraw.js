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
import { isNumeric, getChain } from "../../utils/Common";
import {wallet} from "../../redux/reducers/wallet";
import { unlock, isMetaMaskConnected, onClickInstall, onClickConnect, onBoard, isMetaMaskInstalled } from '../../utils/Sign'
import {isValidAddress} from "ethereumjs-util";
import CancelIcon from '@material-ui/icons/Cancel';
import {authActions} from "../../redux/actions";
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
            fontSize: 15,
            backgroundColor: '#101B66'
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
        feeContentLeft: {
            color: 'white',
            fontSize: 15,
            textAlign: 'left'
        },
        feeContentRight: {
            color: 'white',
            fontSize: 15,
            textAlign: 'right'
        }
    }));
    const classes = useStyles();

    const [withdrawTo, setWithdrawTo] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [addrWarning, setAddrWarning] = React.useState('')
    const [coin, setCoin] = React.useState();
    const [capital, setCapital] = React.useState({free: 0})
    const [warning, setWarning] = React.useState('')
    const [validAddress, setValidAddress] = React.useState(false)
    const [validAmount, setValidAmount] = React.useState(false)
    const [coins, setCoins] = React.useState([])


    const { token, loggedIn, registered } = useSelector(state => state.auth)
    const { tokenList, tokenIcons, userCapitals, withdrawFinished, withdrawSucceed, withdrawMsg, withdrawFeeObj } = useSelector(state => state.wallet)
    const dispatch = useDispatch();
    const location = useLocation();
    const inputRef = React.useRef();

    const [openCallback, setOpenCallback] = useState(false)
    const [time, setTime] = useState('')
    const [receivingAmount, setReceivingAmount] = useState('--')
    const [receivingBase, setReceivingBase] = useState('')
    const [coinWithdrawInfo, setCoinWithdrawInfo] = useState({})
    const [chain, setChain] = useState('')

    const allIn = () => {
        handleAmountChange(roundingDown(capital.free, 4))
    }

    const fillAddress = () => {
        handleAddressChange(address)
    }

    const handleOpenCallback = () => {
        setOpenCallback(true);
    };

    const handleCloseCallback = () => {
        setOpenCallback(false);
    };

    const handleAddressChange = (addr) => {
        setWithdrawTo( addr );
        if (isValidAddress(addr)) {
            setAddrWarning('')
            setValidAddress(true)
        } else {
            if (addr === '') {
                setAddrWarning('')
            } else {
                setAddrWarning('Invalid Address')
            }
            setValidAddress(false)
        }
    };

    const handleAmountChange = (amount) => {
        setWithdrawAmount( amount );
    };

    const handleCoinChange = (event) => {
        console.log('coin: ', event.target.value)
        setCoin(event.target.value);
        let coinInfo = coins.find(item => item.label === event.target.value)
        let _coinWithdrawInfo = tokenList.find(item => item.token === event.target.value + '_' + getChain(network, chainId))
        setCoinWithdrawInfo(_coinWithdrawInfo)
        handleAmountChange('')
        dispatch(walletActions.getFee({token, amount: '1', action: coinInfo.contractWithdrawKey}))

    };

    const confirmWithdraw = async () => {
        try {
            let msg = 'Withdraw Request'
            const from = address
            const _msg = Web3.utils.soliditySha3(msg);

            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [_msg, from],
            })
            let payload = {
                personalSign: {
                    data: msg,
                    sig: sign,
                    pubKeyAddress: address,
                    chainId: Web3.utils.hexToNumber(chainId),
                    networkId: Number(network),
                },
                currency: coin,
                chain: chain,
                amount: withdrawAmount,
                address: withdrawTo,
                token: token
            }
            dispatch(walletActions.withdraw(payload))
        } catch (err) {
            console.error(err)
        }
    }

    const clear = () => {
        setWithdrawTo('')
    }

    const handleFinish = (changedAmount) => {
        setAddrWarning('')
        let coinInfo = coins.find(item => item.label === coin)
        if (changedAmount) {
            if (validAmount) {
                dispatch(walletActions.getFee({token, amount: withdrawAmount, action: coinInfo.contractWithdrawKey}))
            }
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
        let _capital = userCapitals.find(item => item.token === coin)
        if (_capital === undefined) {
            _capital = {
                free: 0,
                token: coin
            }
        }
        setCapital(_capital)

        for (let i = 0; i < userCapitals.length; i ++) {
            let token = tokenList.find(item => item.token === userCapitals[i].token)
            if (token === undefined) {
                token = {
                    token: userCapitals[i].token,
                    contractWithdrawIsOn: false
                }
            }
            if (token.contractWithdrawIsOn) {
                let chain = getChain(Number(network), Web3.utils.toDecimal(chainId))
                _coins.push({
                    label: token.token,
                    value: token.token,
                    contractWithdrawKey: token.token + '_' + chain + '_CONTRACT_WITHDRAW_FEE'
                })
                setChain(chain)
            }
        }

        setCoins(_coins)

        return() => {
            console.log('clear capital check')
        }

    },[coin, address, userCapitals, tokenList, chainId, network])

    useEffect(() => {
        if (!withdrawFinished) {
            setTime(formDateString(new Date().getTime()))
            handleOpenCallback()
            return () => {
                console.log('clear pop modal')
            }
        }
    },[withdrawFinished])

    useEffect(() => {
        if (validAmount) {
            console.log('kept calling')
            setAddrWarning('')
            let coinInfo = coins.find(item => item.label === coin)
            if (coinInfo) {
                dispatch(walletActions.getFee({token, amount: withdrawAmount, action: coinInfo.contractWithdrawKey}))
            }
        } else {
            setReceivingAmount('--')
            setReceivingBase('')
        }
        return () => {
            console.log('clear check fee')
        }
    }, [validAmount])

    useEffect(() => {
        if (withdrawFeeObj !== null && Object.keys(withdrawFeeObj).length > 0 && withdrawFeeObj.base !== '') {
            setReceivingAmount(roundingDown(parseFloat(withdrawAmount) - withdrawFeeObj.amount, 4))
            setReceivingBase(withdrawFeeObj.base)
            let feeCapital = userCapitals.find(item => item.token === withdrawFeeObj.base)
            let coinInfo = coins.find(item => item.label === coin)

            if (withdrawAmount === "") {
                setValidAmount(false)
                setWarning('')
            }
            else if (!Number(withdrawAmount)) {
                setValidAmount(false)
                setWarning('invalid input')
            }
            else if (withdrawAmount <= capital.free) {
                if (receivingBase === coin) {
                    if (withdrawAmount > withdrawFeeObj.amount) {
                        dispatch(walletActions.getFee({token, amount: withdrawAmount, action: coinInfo.contractWithdrawKey}))
                        setValidAmount(true)
                    } else {
                        setValidAmount(false)
                        setWarning('profits.withdraw.enterAmountHigherThanFee')
                    }
                } else {
                    if (feeCapital.free > withdrawFeeObj.amount) {
                        dispatch(walletActions.getFee({token, amount: withdrawAmount, action: coinInfo.contractWithdrawKey}))
                        setValidAmount(true)
                    } else {
                        setValidAmount(false)
                        setWarning(('profits.withdraw.insufficient_fee') + ' ' + withdrawFeeObj.base + ' ' + t('profits.withdraw.insufficient_fund'))
                    }
                }
            }
            else if (withdrawAmount > capital.free) {
                setValidAmount(false)
                setWarning('profits.withdraw.insufficient_fund')
            }
        }

        return () => {
            console.log('clear amount change')
        }
    },[withdrawAmount])

    useEffect(() => {
        if (withdrawFeeObj !== null && Object.keys(withdrawFeeObj).length > 0 && withdrawFeeObj.base !== '') {
            setReceivingAmount(withdrawFeeObj.amount)
            setReceivingBase(withdrawFeeObj.base)
        }

    },[withdrawFeeObj])



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
                                type="text"
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
                                        <CancelIcon onClick={clear} />
                                    </InputAdornment>
                                }}
                                onChange={(e) => handleAddressChange(e.target.value)}
                                onBlur={() => handleFinish(false)}
                                variant="standard"
                                value={withdrawTo}
                                helperText={addrWarning}
                                FormHelperTextProps={{
                                    className: classes.helperText
                                }}
                                error={addrWarning !== ''}
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
                                onBlur={() => handleFinish(true)}
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
                                label={`${t('l2Amount')} ${capital.token !== undefined ? roundingDown(capital.free, 4) : '--'} ${capital.token === undefined ? '' : capital.token}`}
                                InputLabelProps={{
                                    shrink: true,
                                    style: {
                                        color: 'white',
                                        borderBottom: 'white',
                                        width: 'max-content'
                                    },
                                }}
                                value={coin ? coin : ''}
                                onChange={handleCoinChange}
                                InputProps={{
                                    style: {
                                        color: 'white',
                                        backgroundColor: 'transparent',
                                        borderBottom: 'transparent'
                                    },
                                }}
                                defaultValue={'--'}
                            >
                                {coins.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Grid container >
                                            <Grid item xs={3} >
                                                <Avatar alt="Travis Howard" style={{ width:20, height: 20 }} src={getIcons(option.label, tokenIcons, true)} />
                                            </Grid>
                                            <Grid item xs={9} >
                                                {option.label}
                                            </Grid>
                                        </Grid>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid className={classes.feeContentLeft} item xs={6} >
                            <p>{t('fee')}</p>
                        </Grid>
                        <Grid className={classes.feeContentRight} item xs={6} >
                            <p>{`${!withdrawFeeObj || Object.keys(withdrawFeeObj).length === 0 || !validAmount ? '--' : roundingDown(withdrawFeeObj.amount, 4)} ${!withdrawFeeObj || Object.keys(withdrawFeeObj).length === 0 || !validAmount ? '' : withdrawFeeObj.base}`}</p>
                        </Grid>
                        <Grid className={classes.feeContentLeft} item xs={6} >
                            <p>{t('amountReceiving')}</p>
                        </Grid>
                        <Grid className={classes.feeContentRight} item xs={6} >
                            <p>{`${receivingAmount} ${receivingBase}`}</p>
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
                                        <Button style={{ width: 180 }}  className={classes.btn} onClick={confirmWithdraw} disabled={!validAmount || !validAddress}>
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
                            <Grid item xs={12} >
                                <Button style={{ width: 180 }}  className={classes.btn} >
                                    {withdrawMsg}
                                </Button>
                            </Grid>
                            {/*{*/}
                            {/*    Object.keys(withdrawReceipt).length > 0 ?*/}
                            {/*        <Grid item xs={12} >*/}
                            {/*            <p id="server-modal-description">{`${t('confirmedBlock')}: ${withdrawReceipt.blockNumber}`}</p>*/}
                            {/*        </Grid> : null*/}

                            {/*}*/}
                            {/*{*/}
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default withTranslation()(Withdraw);
