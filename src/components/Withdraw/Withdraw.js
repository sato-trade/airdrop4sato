import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Avatar, Backdrop, Button, Fade, Grid, MenuItem, Modal, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {withTranslation} from 'react-i18next';
import useWindowDimensions from '../../utils/WindowDimensions'
import CustomTextField from '../CommonElements/CustomTextField'

import {walletActions} from '../../redux/actions/walletActions';
import {useDispatch, useSelector} from 'react-redux';
import {roundingDown} from '../../utils/RoundingDown'
import {countDecimals, formDateString, getChain, getIcons} from "../../utils/Common";
import backArrow from '../../images/backArrow.png'
import {history} from '../../utils/History';
import {onClickConnect, onClickInstall, unlock} from '../../utils/Sign'
import {isValidAddress} from "ethereumjs-util";
import CustomButton from '../CommonElements/CustomButton';
import CustomDropBox from '../CommonElements/CustomDropBox';

const Web3 = require("web3");
let web3 = new Web3(window.ethereum)

function Withdraw({ t, navBarHeight, address, chainId, network,
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

    const [withdrawTo, setWithdrawTo] = useState(address)
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [addrWarning, setAddrWarning] = React.useState('')
    const [coin, setCoin] = React.useState('');
    const [capital, setCapital] = React.useState({ free: 0 })
    const [warning, setWarning] = React.useState('')
    const [validAddress, setValidAddress] = React.useState(false)
    const [validAmount, setValidAmount] = React.useState(false)
    const [coins, setCoins] = React.useState([])


    const { token, loggedIn, registered, loading } = useSelector(state => state.auth)
    const { tokenList, tokenIcons, userCapitals, withdrawFinished, withdrawSucceed, withdrawMsg, withdrawFeeObj, walletSigning, walletMsg } = useSelector(state => state.wallet)
    const dispatch = useDispatch();
    const location = useLocation();
    const inputRef = React.useRef();

    const [openNote, setOpenNote] = useState(false)
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

    const handleOpenNote = () => {
        setOpenNote(true);
    };

    const handleCloseNote = () => {
        setOpenNote(false);
    };

    const handleAddressChange = (addr) => {
        setWithdrawTo(addr);
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
        if (parseFloat(amount) >= 0) {
            if (countDecimals(parseFloat(amount)) <= 8) {
                setWithdrawAmount(amount)
            } else {
                setWithdrawAmount(roundingDown(parseFloat(amount), 8).toString())
            }
        } else {
            setWithdrawAmount('')
        }

    };

    const handleCoinChange = (event) => {
        setCoin(event.target.value);
        let coinInfo = coins.find(item => item.label === event.target.value)
        let _coinWithdrawInfo = tokenList.find(item => item.token === event.target.value + '_' + getChain(network, chainId))
        setCoinWithdrawInfo(_coinWithdrawInfo)
        handleAmountChange('')
        dispatch(walletActions.getFee({ token, amount: '1', action: coinInfo.contractWithdrawKey }))

    };

    const confirmWithdraw = async () => {
        try {
            let msg = 'Withdraw Request'
            const from = address
            const _msg = Web3.utils.soliditySha3(msg);
            dispatch(walletActions.walletSigning())
            if (!walletSigning) {
                setTime(formDateString(new Date().getTime()))
                handleOpenNote()

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
            }

        } catch (err) {
            console.error('withdraw request cancelled: ', err)
            dispatch(walletActions.walletSigningCancelled())

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
                dispatch(walletActions.getFee({ token, amount: withdrawAmount, action: coinInfo.contractWithdrawKey }))
            }
        }
    }

    useEffect(() => {
        if (loggedIn) {
            dispatch(walletActions.getUserCapital(token))
            dispatch(walletActions.getAllTokenStatus(token))

        }

        return () => {
        }
    }, [])

    useEffect(() => {
        if (loggedIn) {
            dispatch(walletActions.getUserCapital(token))
            dispatch(walletActions.getAllTokenStatus(token))
            setWithdrawTo(address)
            setValidAddress(true)
        }
        return () => {
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

        for (let i = 0; i < userCapitals.length; i++) {
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
        return () => {
        }

    }, [coin, address, userCapitals, tokenList, chainId, network])

    useEffect(() => {
        if (validAmount) {
            setAddrWarning('')
            let coinInfo = coins.find(item => item.label === coin)
            if (coinInfo) {
                dispatch(walletActions.getFee({ token, amount: withdrawAmount, action: coinInfo.contractWithdrawKey }))
            }
        } else {
            setReceivingAmount('--')
            setReceivingBase('')
        }
        return () => {
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
            else if (!parseFloat(withdrawAmount)) {
                setValidAmount(false)
                setWarning(t('invalidInput'))
            }
            else if (withdrawAmount <= capital.free) {
                if (receivingBase === coin) {
                    if (withdrawAmount > withdrawFeeObj.amount) {
                        dispatch(walletActions.getFee({ token, amount: withdrawAmount, action: coinInfo.contractWithdrawKey }))
                        setValidAmount(true)
                        setWarning('')
                    } else {
                        setValidAmount(false)
                        setWarning(t('enterAmountHigherThanFee'))
                    }
                } else {
                    if (feeCapital.free > withdrawFeeObj.amount) {
                        dispatch(walletActions.getFee({ token, amount: withdrawAmount, action: coinInfo.contractWithdrawKey }))
                        setValidAmount(true)
                        setWarning('')
                    } else {
                        setValidAmount(false)
                        setWarning(t('insufficient_fee') + ' ' + withdrawFeeObj.base + ' ' + t('insufficient_fund'))
                    }
                }
            } else if (withdrawAmount > capital.free) {
                setValidAmount(false)
                setWarning(t('insufficient_fund'))
            } else {
                setValidAmount(false)
                setWarning(t('insufficient_fee') + ' ' + withdrawFeeObj.base + ' ' + t('insufficient_fund'))
            }
        }

        return () => {
        }
    }, [withdrawAmount])

    useEffect(() => {
        if (withdrawFeeObj !== null && Object.keys(withdrawFeeObj).length > 0 && withdrawFeeObj.base !== '') {
            if (withdrawAmount === '') {
                setReceivingAmount('--')
            } else {
                setReceivingAmount(roundingDown(parseFloat(withdrawAmount) - withdrawFeeObj.amount, 4))
            }
            setReceivingBase(withdrawFeeObj.base)
        }
        if (withdrawFeeObj === null) {
            setValidAmount(false)
            setWarning(`${coin} ${t('withdrawNotAvailable')}`)
        }
    }, [withdrawFeeObj])

    return (
        <div className={classes.root}>
            <div className="deposit__container">
                <div className="deposit__wrapper">
                    <Button style={{ left: -24, alignSelf: 'flex-start' }} onClick={() => {
                        history.back()
                    }} >
                        <Avatar alt="Travis Howard" src={backArrow} className={classes.backArrow} />
                    </Button>
                    {/* <Grid container spacing={2} >
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
                    </Grid> */}

                    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Typography style={{ textTransform: 'none', fontSize: 24, fontWeight: '600', color: 'white' }} gutterBottom>
                            {t('withdraw')}
                        </Typography>

                        <Typography style={{ textTransform: 'none', fontSize: 12, textAlign: 'left', fontWeight: 'bold', color: '#8FB9E1' }} color="textSecondary" gutterBottom>
                            {t('withdrawContent')}
                        </Typography>

                    </div>
                    <div style={{ height: 1, marginTop: 20, marginBottom: 20, backgroundColor: '#2435AC' }} />
                    <Grid container spacing={2} className={classes.fieldWrapper}>
                        {/* <Grid item xs={12} >
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
                        </Grid> */}



                        {/* <Grid item xs={8} >
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
                                disabled={!loggedIn || coin === ''}
                            />
                        </Grid> */}
                        {/* <Grid item xs={4} >
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
                                disabled={!loggedIn}
                            >
                                {coins.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Grid container >
                                            <Grid item xs={3} >
                                                <Avatar alt="Coin Icon" style={{ width: 20, height: 20 }} src={getIcons(option.label, tokenIcons, true)} />
                                            </Grid>
                                            <Grid item xs={9} >
                                                {option.label}
                                            </Grid>
                                        </Grid>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid> */}
                        {/* <Grid className={classes.feeContentLeft} item xs={6} >
                            <p>{t('fee')}</p>
                        </Grid>
                        <Grid className={classes.feeContentRight} item xs={6} >
                            <p>{`${!withdrawFeeObj || Object.keys(withdrawFeeObj).length === 0 || coin === '' ? '--' : roundingDown(withdrawFeeObj.amount, 4)} ${!withdrawFeeObj || Object.keys(withdrawFeeObj).length === 0 || coin === '' ? '' : withdrawFeeObj.base}`}</p>
                        </Grid>
                        <Grid className={classes.feeContentLeft} item xs={6} >
                            <p>{t('amountReceiving')}</p>
                        </Grid>
                        <Grid className={classes.feeContentRight} item xs={6} >
                            <p>{`${receivingAmount} ${receivingBase}`}</p>
                        </Grid> */}


                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <CustomTextField
                                inputRef={inputRef}
                                label={t('withdrawAddress')}
                                type="text"
                                style={{ width: '80%', textTransform: 'none' }}

                                helperText={warning}
                                error={warning !== ''}
                                showCancelButton={true}
                                clear={clear}
                                onChange={(e) => handleAddressChange(e.target.value)}
                                onBlur={() => handleFinish(false)}
                                // variant="standard"
                                value={withdrawTo}
                                helperText={addrWarning}

                                error={addrWarning !== ''}
                            >


                            </CustomTextField>

                            <Button
                                style={{ backgroundColor: '#1DF0A9', height: 60, bottom: 10, borderRadius: 16, width: '18%' }}
                                onClick={fillAddress}
                            >
                                <Typography style={{ fontSize: 14, fontWeight: 'bold', color: '#010746' }}>
                                    {t('l1Wallet')}
                                </Typography>
                            </Button>
                        </div>


                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>

                            <CustomTextField
                                label={t('withdrawAmount')}
                                disabled={!loggedIn || coin === ''}
                                style={{ width: '70%', textTransform: 'none' }}
                                inputRef={inputRef}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                onBlur={() => handleFinish(true)}
                                value={withdrawAmount}
                                helperText={warning}

                                error={warning !== ''}
                                rightbuttonlabel={t(capital.free > 0.0001 ?'all' :null)}
                                onRightButtonClick={allIn}

                            >

                            </CustomTextField>

                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'start', marginTop: 12 }}>
                                <Typography style={{ textTransform: 'none', color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 12 }}>

                                    {`${t('l2Amount')} ${capital.token !== undefined ? roundingDown(capital.free, 4) : '--'} ${capital.token === undefined ? '' : capital.token}`}                                </Typography>
                                <CustomDropBox
                                    label={t('selectCoin')}
                                    onChange={handleCoinChange}

                                    value={coin}
                                    disabled={!loggedIn}
                                >
                                    {coins.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            <Grid container >
                                                <Grid item xs={3} >
                                                    <Avatar alt="Coin Icon" style={{ width: 20, height: 20 }} src={getIcons(option.label, tokenIcons, true)} />
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

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', marginTop: 20, marginBottom: 40 }}>
                            <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                <Typography style={{ fontSize: 14, color: '#8FB9E1', fontWeight: '600', marginRight: 8 }}>{t('fee')}</Typography>
                                <Typography style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>{`${!withdrawFeeObj || Object.keys(withdrawFeeObj).length === 0 || !validAmount ? '--' : roundingDown(withdrawFeeObj.amount, 4)} ${!withdrawFeeObj || Object.keys(withdrawFeeObj).length === 0 || !validAmount ? '' : withdrawFeeObj.base}`}</Typography>
                            </div>

                            <div style={{ display: 'flex', width: '100%', marginTop: 0, alignItems: 'center' }}>

                                <Typography style={{ fontSize: 14, color: '#8FB9E1', fontWeight: '600', marginRight: 8 }}>{t('amountReceiving')}</Typography>
                                <Typography style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>{`${receivingAmount} ${receivingBase}`}</Typography>
                            </div>

                        </div>



                        <Grid item xs={12}>
                            {
                                address.length < 42 || !isValidAddress(address) ?
                                    <CustomButton buttonStyle="connectStyle" style={{ width: '100%' }}  onClick={!window.ethereum ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : () => onClickConnect(network, chainId, address, dispatch)}>
                                        {button1}
                                    </CustomButton> : null
                            }
                            {
                                address.length === 42 && isValidAddress(address) ?
                                    loggedIn ?
                                        <CustomButton style={{ width: '100%' }} onClick={confirmWithdraw} disabled={!validAmount || !validAddress}>
                                            {t('confirm')}
                                        </CustomButton> :
                                        <CustomButton buttonStyle="unlockStyle" style={{ width: '100%' }} onClick={(!registered || !loggedIn) && !loading ? () => unlock('unlock', address, chainId, network, Web3, registered, dispatch) : null} disabled={button2Disabled}>
                                            {t('unlock')}
                                        </CustomButton> : null
                            }
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
                open={openNote}
                onClose={handleCloseNote}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openNote}>
                    <div className={classes.paper}>
                        <h2 id="server-modal-title">{walletSigning ? t('confirming') : withdrawSucceed?  t(withdrawMsg) : t(walletMsg) }</h2>
                        {
                            walletSigning ?
                                <Grid container spacing={2} >
                                    <Grid item xs={12} >
                                        <p id="server-modal-description">{`${t('withdrawAmount')}: ${withdrawAmount}`}</p>

                                    </Grid>
                                    <Grid item xs={12} >
                                        <p id="server-modal-description">{`${t('withdrawAddress')}: ${withdrawTo}`}</p>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <p id="server-modal-description">{`${t('action')}: ${t('withdrawAction')}`}</p>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <p id="server-modal-description">{`${t('status')}: ${walletSigning ? t('loading') : withdrawSucceed ? t(withdrawMsg) : t(walletMsg)}`}</p>
                                    </Grid>
                                </Grid> : null

                        }
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default withTranslation()(Withdraw);
