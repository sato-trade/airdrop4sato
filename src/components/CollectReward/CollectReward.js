import React, {useEffect, useRef, useState} from 'react';
import './CollectReward.css';
import {makeStyles} from '@material-ui/core/styles';
import useWindowDimensions from '../../utils/WindowDimensions'
import logo from '../../images/rewardHeadImage.png'
import {Link} from 'react-router-dom';

import {withTranslation} from 'react-i18next';
import {Backdrop, Fade, Grid, Modal, Typography} from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {walletActions} from "../../redux/actions/walletActions";
import {isValidAddress} from "ethereumjs-util";
import {onClickConnect, onClickInstall, unlock} from "../../utils/Sign";
import {FormatNumber} from "../../utils/Common";
import CustomButton from '../CommonElements/CustomButton';
import i18n from '../../i18n';

const Web3 = require("web3");
function CollectReward({ t, navBarHeight, address, network, chainId,
    sendBackButton1, sendBackButton1Disabled, button1, button1Disabled,
    sendBackButton2, sendBackButton2Disabled, button2, button2Disabled }) {

    const { height, width } = useWindowDimensions();
    const useStyles = makeStyles((theme) => ({
        root: {
            ...theme.typography.button,
            backgroundColor: "#010746",
            padding: theme.spacing(1),
            flexGrow: 1,
            height: '100%',
            textAlign: 'center',
            justifyContent: 'center',
        },
        card: {
            width: 441,
            borderRadius: 24,
            backgroundColor: 'yellow',
            marginTop: 100,
            paddingTop: 30,
            paddingBottom: 30,
            alignItems: 'center'

        },
        cardHeader: {
            backgroundColor: 'blue',
            width: 100,
            height: 100,

        },
        cardContent: {
            width: "100%",
            alignItems: 'flex-start',
            backgroundColor: 'red',
            direction: 'column'

        },
        cardImage: {
            height: 40,
            top: 100
        },
        btn: {
            backgroundColor: '#1DF0A9',
            height: 82,
            // display: 'flex',
            marginLeft: 24,
            marginRight: 24,
            marginTop: 60,
            marginBottom: 32,
            borderRadius: 36,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 'bold',
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
    const prevMessageRef = useRef();
    const prevAuthMsgRef = useRef();

    const dispatch = useDispatch();
    const { token, loggedIn, registered, loading, authMsg } = useSelector(state => state.auth)
    const { amplRewardsInfo, rewardMessage, walletLoading } = useSelector(state => state.wallet)

    const [openFailedModal, setOpenFailedModal] = useState(false)

    const handleOpenFailedModal = () => {
        setOpenFailedModal(true);
    };

    const handleCloseFailedModal = () => {
        setOpenFailedModal(false);
    };

    const [openSucceedModal, setOpenSucceedModal] = useState(false)

    const handleOpenSucceedModal = () => {
        setOpenSucceedModal(true);
    };

    const handleCloseSucceedModal = () => {
        setOpenSucceedModal(false);
    };

    const confirmRegister = () => {
        dispatch(walletActions.registerAmplRewards(token))
    }


    useEffect(() => {
        dispatch(walletActions.getAmplRewards(token))
        return () => {
        }
    }, [])

    useEffect(() => {
        dispatch(walletActions.getAmplRewards(token))
        return () => {
        }
    }, [loggedIn])

    useEffect(() => {
        if (prevMessageRef.current === '' && (rewardMessage === 'NotEligibleError' || rewardMessage === 'NotAvailable')) {
            handleOpenFailedModal()
        }
        if ((walletLoading === false && rewardMessage === 'RegisterSuccess')) {
            handleOpenSucceedModal()
            dispatch(walletActions.getAmplRewards(token))
        }
        if (prevAuthMsgRef.current === '' && authMsg === 'wrongNetwork') {
            handleOpenFailedModal()
        }
        prevMessageRef.current = rewardMessage;
        prevAuthMsgRef.current = authMsg;
        return () => {
        }
    }, [rewardMessage, walletLoading, authMsg])


    return (
        <div className={classes.root}>
            <div className='cards__container'>
                <img
                    className='cards__item__img'
                    // alt='Travel Image'
                    src={logo}
                />
                <div className='cards__wrapper'>


                    <div className='cards__item__info'>
                        <Typography className='cards__item__text' style={{ fontSize: 32, fontWeight: 'bold' }}>{t('inviteReward')}</Typography>
                        <Typography className='cards__content__text' style={{ fontSize: 12, fontWeight: 'bold' }}>
                            {t('rewardContent')}
                        </Typography>
                        <Typography className='cards__content__text' style={{ marginTop:5, fontSize: 12, fontWeight: 'bold' }}>
                            {t('rewardContent2')}
                        </Typography>
                        <Typography className='cards__content__text' style={{ marginTop:5, fontSize: 12, fontWeight: 'bold' }}>
                            {t('rewardContent3')}
                        </Typography>
                    </div>

                    <div className='cards__cell__wrapper'>
                        <div className='cards__small__cell'>
                            <Typography className='cards__cell__title' style={{ fontSize: 10, fontWeight: 'bold' }}>
                                {t('registeredUser')}
                            </Typography>
                            <Typography className='cards__cell__value' style={{ fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>
                                {FormatNumber(amplRewardsInfo.registeredUsers)}
                            </Typography>

                        </div>
                        <div className='cards__small__cell'>
                            <Typography className='cards__cell__title' style={{ fontSize: 10, fontWeight: 'bold' }}>
                                {t('releasedReward')}
                            </Typography>
                            <Typography className='cards__cell__value__large' style={{ fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>
                                {FormatNumber(amplRewardsInfo.totalRewards)}
                            </Typography>

                        </div>

                        <div className='cards__small__cell'>
                            <Typography className='cards__cell__title' style={{ fontSize: 10, fontWeight: 'bold' }}>
                                {t('expectedRewardPerPerson')}(SATO)
                            </Typography>
                            <Typography className='cards__cell__value' style={{ fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>
                                {`${FormatNumber(amplRewardsInfo.rewardsPerUser)} `}
                            </Typography>
                        </div>
                    </div>
                    <div style={{ marginTop: 24 }}>
                        {
                            address.length < 42 || !isValidAddress(address) ?
                                <CustomButton buttonstyle="connectStyle" style={{ width: '100%' }}  onClick={!window.ethereum ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : () => onClickConnect(network, chainId, address, dispatch)}>
                                    {button1}
                                </CustomButton> : null
                        }
                        {
                            address.length === 42 && isValidAddress(address) ?
                                loggedIn ?
                                    amplRewardsInfo.hasClaimed ?
                                        <CustomButton style={{ width: '100%'  ,marginBottom:28}} disabled={amplRewardsInfo.hasClaimed}>
                                            {t('claimed')}
                                        </CustomButton> :
                                        <CustomButton style={{ width: '100%'  ,marginBottom:28}} onClick={confirmRegister} >
                                            {t('registerReward')}
                                        </CustomButton> :
                                    <CustomButton buttonstyle="unlockStyle" style={{ width: '100%',marginBottom:28 }} onClick={(!registered || !loggedIn) && !loading ? () => unlock(address, chainId, network, Web3, registered, dispatch) : null} disabled={button2Disabled}>
                                        {t('unlock')}
                                    </CustomButton> : null
                        }
                    </div>
                </div>
            </div>
            <Modal
                disablePortal
                disableEnforceFocus
                disableAutoFocus
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
                className={classes.modal}
                open={openSucceedModal}
                onClose={handleCloseSucceedModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openSucceedModal}>
                    <div className={classes.paper}>
                        <h2 id="server-modal-title">{t('registerRewardSucceed')}</h2>
                    </div>
                </Fade>
            </Modal>
            <Modal
                disablePortal
                disableEnforceFocus
                disableAutoFocus
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
                className={classes.modal}
                open={openFailedModal}
                onClose={handleCloseFailedModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openFailedModal}>
                    <div className={classes.paper}>
                        <h2 id="server-modal-title">{authMsg !== '' ? t(authMsg) : t('registerRewardFailed')}</h2>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <p id="server-modal-description">{authMsg !== '' ? authMsg === 'wrongNetwork' ? t('wrongNetworkContent') : null : rewardMessage === "NotEligibleError" ? t('registerRewardFailedContent') : t(rewardMessage)}</p>
                            </Grid>
                        </Grid>
                    </div>
                </Fade>
            </Modal>

        </div>
    )
}

export default withTranslation()(CollectReward);
