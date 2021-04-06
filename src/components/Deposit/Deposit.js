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
    Backdrop, Fade, Modal
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import useWindowDimensions from '../../utils/WindowDimensions'
import './Deposit.css';
import CustomTextField from '../CommonElements/CustomTextField'
import { walletActions } from '../../redux/actions/walletActions';
import { useDispatch, useSelector } from 'react-redux';
import { roundingDown } from '../../utils/RoundingDown'
import { getIcons, formDateString } from "../../utils/Common";
import backArrow from '../../images/backArrow.png'
import { history } from '../../utils/History';
import { isNumeric, getChain } from "../../utils/Common";
import { wallet } from "../../redux/reducers/wallet";
import { unlock, isMetaMaskConnected, onClickInstall, onClickConnect, onBoard, isMetaMaskInstalled } from '../../utils/Sign'
import { isValidAddress } from "ethereumjs-util";
import CustomDropBox from '../CommonElements/CustomDropBox';
import CustomButton from '../CommonElements/CustomButton';
const Web3 = require("web3");
let web3 = new Web3(window.ethereum)

function Deposit({ t, navBarHeight, address, chainId, network,
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
            borderRadius: 36,
            height: 72,
            fontWeight: 600,
            minWidth: "100%",
            textTransform:"none"
        },
        btn_disabled: {
            backgroundColor: '#83ACF4',
            color: '#010846',
            borderColor: 'transparent',
            borderRadius: 25,
            height: 45,
            fontWeight: 600,
            opacity: 0.2,
            textTransform:"none"

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
            height: 20,
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
            // color: 'red'
        },
        allIn: {
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

    const [depositAmount, setDepositAmount] = useState('')
    const [coin, setCoin] = React.useState('SAP');
    const [capital, setCapital] = React.useState({ free: 0 })
    const [warning, setWarning] = React.useState(' ')
    const [cantDeposit, setCantDeposit] = React.useState(true)
    const [coins, setCoins] = React.useState([])


    const { token, loggedIn, registered, loading } = useSelector(state => state.auth)
    const { tokenList, tokenIcons, l1Capital, depositFinished, depositSucceed, message, depositHash, depositReceipt } = useSelector(state => state.wallet)
    const dispatch = useDispatch();
    const location = useLocation();
    const inputRef = React.useRef();

    const [openCallback, setOpenCallback] = useState(false)
    const [time, setTime] = useState('')



    const allIn = () => {
        handleAmountChange(roundingDown(capital.free, 4))
    }

    const handleOpenCallback = () => {
        setOpenCallback(true);
    };

    const handleCloseCallback = () => {
        setOpenCallback(false);
    };

    const handleAmountChange = (amount) => {
        setDepositAmount(amount);
        if (isNumeric(amount) && amount>0) {
            if (parseFloat(amount) <= capital.free) {
                setWarning(' ')
                setCantDeposit(false)
            } else {
                setWarning(t('balanceLow'))
                setCantDeposit(true)
            }
        } else {
            if (amount === '') {
                setWarning(' ')
            } else {
                setWarning(t('invalidInput'))
            }
            setCantDeposit(true)
        }

    };

    const handleCoinChange = (event) => {
        setCoin(event.target.value);
        handleAmountChange('')
    };

    const confirmDeposit = async () => {
        let payload = {
            l1Address: address,
            l2Address: address,
            amount: depositAmount,
            coin: coin,
        }
        try {
            if (depositFinished) {
                dispatch(walletActions.deposit(payload))
            }
        } catch (err) {
            console.log('deposit request failed: ', err)
        }
    }

    useEffect(() => {
        if (loggedIn) {
            // dispatch(walletActions.getUserCapital(token))
            dispatch(walletActions.getAllTokenStatus(token))
            dispatch(walletActions.getL1Capital(address))
        }
        return () => {
        }
    }, [])

    useEffect(() => {
        if (loggedIn) {
            // dispatch(walletActions.getUserCapital(token))
            dispatch(walletActions.getAllTokenStatus(token))
            dispatch(walletActions.getL1Capital(address))
        }
        return () => {
        }
    }, [loggedIn, address])

    useEffect(() => {
        let _coins = []
        for (let i = 0; i < tokenList.length; i++) {
            if (tokenList[i].contractDepositIsOn) {
                if (tokenList[i].token === 'USDT_ERC20') {
                    if (_coins.find(item => item.label === 'USDT') === undefined) {
                        _coins.push({
                            label: 'USDT',
                            value: 'USDT'
                        })
                    }
                } else if (tokenList[i].token.includes('_' + getChain(network, chainId))) {
                    let token = tokenList[i].token.substr(0, tokenList[i].token.indexOf('_'))
                    if (_coins.find(item => item.label === token) === undefined) {
                        _coins.push({
                            label: token,
                            value: token
                        })
                    }
                } else if (!tokenList[i].token.includes('_ETH')) {
                    _coins.push({
                        label: tokenList[i].token,
                        value: tokenList[i].token
                    })
                }

            }
        }

        setCoins(_coins)
        return () => {
        }

    }, [tokenList, address, loggedIn, network, chainId])


    useEffect(() => {
        let _capital = l1Capital.find(item => item.token === coin)
        if (_capital === undefined) {
            _capital = {
                free: 0,
                token: coin
            }
        }
        setCapital(_capital)
        return () => {
        }

    }, [coin, address, l1Capital])

    useEffect(() => {
        if (depositHash.length > 0 && !depositFinished) {
            setTime(formDateString(new Date().getTime()))
            handleOpenCallback()
            return () => {
            }
        }
    }, [depositHash, depositFinished])

    return (
        <div className={classes.root}>
            <div className="deposit__container">
                <div className="deposit__wrapper">
                    <Button style={{ left: -24 }} onClick={() => {
                        history.back()
                    }} >
                        <Avatar alt="Travis Howard" src={backArrow} className={classes.backArrow} />
                    </Button>
                    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Typography style={{ textTransform:'none',fontSize: 24, fontWeight: '600', color: 'white' }} gutterBottom>
                            {t('deposit')}
                        </Typography>
                 
                        <Typography style={{ textTransform: 'none', fontSize: 12, textAlign: 'left', fontWeight: 'bold', color: '#8FB9E1' }} color="textSecondary" gutterBottom>
                            {t('depositContent')}
                        </Typography>
            
                    </div>
                    <div style={{ height: 1, marginTop: 40, marginBottom: 20, backgroundColor: '#2134A7' }} />

                    {/*
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        <CustomTextField label="充值金额" helperText="ccc"
                            style={{ width: '70%' }}
                        >

                        </CustomTextField>

                        <TextField
                            id="outlined-basic"
                            variant="filled"
                            select
                            style={{ width: '25%', height: '70%', backgroundColor: '#1DF0A9', borderRadius: 24 }}
                            label="选择币种"
                            InputProps={{ disableUnderline: true }}
                            root={{ backgroundColor: 'blue' }}
                        >

                        </TextField>



                    </div> */}

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        <CustomTextField
                            label={t('depositAmount')}
                            disabled={!loggedIn}
                            style={{ width: '70%', textTransform: 'none' }}
                            inputRef={inputRef}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            value={depositAmount}
                            helperText={warning}
                            error={warning !== ''}
                            rightbuttonlabel={ capital.free > 0.0001 ?  t('all') : null}
                            onRightButtonClick={allIn}
                            
                        >

                        </CustomTextField>

                        <div style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'start', marginTop: -12 }}>
                            <Typography style={{ textTransform: 'none', color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 12 }}>

                                {t('availableCapital')} {loggedIn ? roundingDown(capital.free, 4) : '--'} {capital.token}
                            </Typography>
                            <CustomDropBox
                                // label={`${t('availableCapital')} ${roundingDown(capital.free, 4)} ${capital.token}`}
                                label={t('selectCoin')}
                                value={coin}
                                onChange={handleCoinChange}
                                disabled={!loggedIn}
                            >
                                {coins.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Grid container >
                                            <Grid item xs={3} >
                                                <Avatar alt="Coin Icon" style={{ width:20, height: 20 }} src={getIcons(option.label, tokenIcons, true)} />
                                            </Grid>
                                            <Grid item xs={9} >
                                                {option.label}
                                            </Grid>
                                        </Grid>
                                    </MenuItem>
                                ))}
                            </CustomDropBox>
                        </div>
                    </div>



                    <Grid container spacing={2} className={classes.fieldWrapper}>
                        {/* <Grid item xs={6} >
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
                                onBlur={() => { setWarning('') }}
                                variant="standard"
                                value={depositAmount}
                                helperText={warning}
                                FormHelperTextProps={{
                                    className: classes.helperText
                                }}
                                error={warning !== ''}
                            />
                        </Grid> */}

                        {/* <Grid item xs={6} >
                            <TextField
                                select
                                label={`${t('availableCapital')} ${loggedIn ? roundingDown(capital.free, 4) : '--'} ${capital.token}`}
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
                                                <Avatar alt="Travis Howard" style={{ width: 20, height: 20 }} src={getIcons(option.label, tokenIcons, true)} />                            </Grid>
                                            <Grid item xs={6} >
                                                {option.label}
                                            </Grid>
                                        </Grid>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid> */}
                        <Grid item xs={12} style={{ marginTop: 24 }}>
                            {
                                address.length < 42 || !isValidAddress(address) ?
                                    <CustomButton style={{ width: '100%' }} buttonStyle="connectStyle" onClick={!isMetaMaskInstalled() ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : onClickConnect}
                                    >
                                        {button1}
                                    </CustomButton> : null
                            }
                            {
                                address.length === 42 && isValidAddress(address) ?
                                    loggedIn ?
                                        <CustomButton  style={{ width: '100%' }}  onClick={confirmDeposit} disabled={cantDeposit}>
                                            {t('confirm')}
                                        </CustomButton> :
                                        <CustomButton buttonStyle="unlockStyle" style={{ width: '100%' }} onClick={() => loading ? null : unlock('unlock', address, chainId, network, Web3, registered, dispatch)} disabled={button2Disabled}>
                                            {t('unlock')}
                                        </CustomButton> : null
                            }
                        </Grid>

                        {/* <CustomButton style={{width:'100%'}} onClick={!isMetaMaskInstalled() ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : onClickConnect}
                        >
                            {button1}
                        </CustomButton> */}
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
                        <h2 id="server-modal-title">{depositSucceed && depositFinished ? t('depositSucceed') : t('confirming')}</h2>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('depositAmount')}: ${depositAmount}`}</p>

                            </Grid>
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('time')}: ${time}`}</p>
                            </Grid>
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('action')}: ${t('depositAction')}`}</p>
                            </Grid>
                            <Grid item xs={12} >
                                <p id="server-modal-description">{`${t('status')}: ${depositFinished && depositSucceed ? t('depositSucceed') : t('loading')}`}</p>
                            </Grid>
                            {
                                Object.keys(depositReceipt).length > 0 ?
                                    <Grid item xs={12} >
                                        <p id="server-modal-description">{`${t('confirmedBlock')}: ${depositReceipt.blockNumber}`}</p>
                                    </Grid> : null

                            }
                            {
                                depositHash.length > 1 ?
                                    <Grid item xs={12} >
                                        <Button target="_blank" href={"https://ropsten.etherscan.io/tx/" + depositHash} style={{ width: 180 }} className={classes.btn} >
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

export default withTranslation()(Deposit);
