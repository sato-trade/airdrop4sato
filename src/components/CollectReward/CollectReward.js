import React, { useState, useEffect, useRef } from 'react';
import './CollectReward.css';
import { makeStyles } from '@material-ui/core/styles';
import useWindowDimensions from '../../utils/WindowDimensions'
import logo from '../../images/rewardHeadImage.png'
import { Link } from 'react-router-dom';

import { withTranslation } from 'react-i18next';
import {Typography, Grid, Button, Card, CardContent, Modal, CardHeader, Backdrop, Fade} from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {walletActions} from "../../redux/actions/walletActions";
import {isValidAddress} from "ethereumjs-util";
import {isMetaMaskInstalled, onClickConnect, onClickInstall, unlock} from "../../utils/Sign";
import { FormatNumber } from "../../utils/Common";

const Web3 = require("web3");
let web3 = new Web3(window.ethereum)

function CollectReward({t, navBarHeight, address, network, chainId,
                           sendBackButton1, sendBackButton1Disabled, button1, button1Disabled,
                           sendBackButton2, sendBackButton2Disabled, button2, button2Disabled}) {

    const { height, width } = useWindowDimensions();
    const useStyles = makeStyles((theme) => ({
        root: {
            ...theme.typography.button,
            backgroundColor: "#010746",
            padding: theme.spacing(1),
            flexGrow: 1,
            height: '100%',
            textAlign: 'center',
            justifyContent:'center',
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

    const dispatch = useDispatch();
    const { token, loggedIn, registered } = useSelector(state => state.auth)
    const { amplRewardsInfo, message } = useSelector(state => state.wallet)

    const [openFailedModal, setOpenFailedModal] = useState(false)

    const handleOpenFailedModal = () => {
        setOpenFailedModal(true);
    };

    const handleCloseFailedModal = () => {
        setOpenFailedModal(false);
    };

    const confirmRegister = () => {
        dispatch(walletActions.registerAmplRewards(token))
    }


    useEffect(() => {
        dispatch(walletActions.getAmplRewards(token))
        return() => {
            console.log('clear initialization')
        }
    }, [])

    useEffect(() => {
        dispatch(walletActions.getAmplRewards(token))
        return() => {
            console.log('clear loggedIn')
        }
    }, [loggedIn])

    useEffect(() => {
        if (prevMessageRef.current === '' && message === 'NotEligibleError') {
            handleOpenFailedModal()
        }
        prevMessageRef.current = message;
        return() => {
            console.log('clear message')
        }
    }, [message])


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
                        <h1 className='cards__item__text'>{t('inviteReward')}</h1>
                        <h1 className='cards__content__text'>
                            {t('rewardContent')}
                        </h1>

                    </div>

                    <div className='cards__cell__wrapper'>
                        <div className='cards__small__cell'>
                            <h5 className='cards__cell__title'>
                                {t('registeredUser')}
                                </h5>
                            <h5 className='cards__cell__value'>
                                {FormatNumber(amplRewardsInfo.registeredUsers)}
                                </h5>

                        </div>
                        <div className='cards__large__cell'>
                            <h5 className='cards__cell__title'>
                                {t('releasedReward')}
                                </h5>
                            <h5 className='cards__cell__value__large'>
                                {FormatNumber(amplRewardsInfo.totalRewards)}
                                </h5>

                        </div>

                        <div className='cards__small__cell'>
                            <h5 className='cards__cell__title'>
                                {t('expectedRewardPerPerson')}
                                </h5>
                            <h5 className='cards__cell__value'>
                                {`${FormatNumber(amplRewardsInfo.rewardsPerUser)} SATO`}
                                </h5>
                        </div>
                    </div>
                    <div>
                        {
                            address.length < 42 || !isValidAddress(address) ?
                                <Button className={classes.btn} style={{ width: 500 }} onClick={!isMetaMaskInstalled() ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : onClickConnect}
                                >
                                    {button1}
                                </Button> : null
                        }
                        {
                            address.length === 42 && isValidAddress(address) ?
                                loggedIn ?
                                    amplRewardsInfo.hasClaimed ?

                                        <Button style={{ width: 180 }}  className={classes.btn} style={{ width: 500 }} disabled={amplRewardsInfo.hasClaimed}>
                                            {t('claimed')}
                                        </Button> :
                                            <Button style={{ width: 180 }}  className={classes.btn} style={{ width: 500 }} onClick={confirmRegister} >
                                                {t('registerReward')}
                                            </Button> :
                                                <Button style={{ width: 180 }}  className={classes.btn} style={{ width: 500 }}  onClick={() => unlock('unlock', address, chainId, network, Web3, registered, dispatch )} disabled={button2Disabled}>
                                                    {t('unlock')}
                                                </Button> : null
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
                        <h2 id="server-modal-title">{t('registerRewardFailed')}</h2>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <p id="server-modal-description">{t('registerRewardFailedContent')}</p>
                            </Grid>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default withTranslation()(CollectReward);
