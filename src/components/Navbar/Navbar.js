import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { withTranslation } from 'react-i18next';
import { NavLink, useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {
    ListItem,
    Button,
    Modal,
    Fade,
    Backdrop,
    Grid,
    Typography, IconButton
} from '@material-ui/core';
import logo from '../../images/swapAllIconWithL.png'
import i18n from '../../i18n';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../redux/actions";
import { onClickConnect, onClickInstall } from "../../utils/Sign";
import useWindowDimensions from "../../utils/WindowDimensions";
import mataLogo from '../../images/mataLogo.png'
import downButton from '../../images/downButton.png'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import satoShapLogo from '../../images/satoShapLogo.png'
import MoreVertIcon from '@material-ui/icons/MoreVert';
let tempHeight = null;


function Navbar({ width, t, sendBackHeight, sendBackAddr, sendBackChainId, sendBackNetworkId, button1, sendBackButton1, sendBackButton1Disabled }) {
    const useStyles = makeStyles((theme) => ({
        bar: {
            background: 'yellow'
        },
        navbarDisplayFlex: {
            display: `flex`,
            justifyContent: `space-between`,
            backgroundColor: 'blue',
            width: '100%'
        },
        navDisplayFlex: {
            display: `flex`,
            justifyContent: `space-between`,
        },
        linkText: {
            textDecoration: `none`,
            textTransform: `uppercase`,
            color: `white`,
            alignSelf: 'center'
        },
        selected: {
            textDecoration: `none`,
            color: `green`,
            alignSelf: 'center'

        },
        logo: {
            width: width > 1000 ? 200 : width * 0.2,
        },
        langBtn: {
            height: 30,
            alignSelf: 'center',
            background: 'transparent',
            color: 'white'
        },
        addrBtn: {
            height: 30,
            alignSelf: 'center',
            background: '#2435AC',
            color: 'white',
            fontSize: width > 350 ? 15 : '0.5rem'
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

    const [open, setOpen] = useState(false)
    const [openMore, setOpenMore] = React.useState(false);

    const [chainId, setChainId] = useState(0)
    const [network, setNetwork] = useState('')
    const [addr, setAddr] = useState('')
    const [startWatch, setStartWatch] = useState(false)

    const { loggedIn, registered, message } = useSelector(state => state.auth)
    const prevNavMessageRef = useRef();
    const history = useHistory();
    const dispatch = useDispatch();

    const [openMsgModal, setOpenMsgModal] = useState(false)

    const handleOpenMsgModal = () => {
        setOpenMsgModal(true);
    };

    const handleCloseMsgModal = () => {
        setOpenMsgModal(false);
        dispatch(authActions.checkUser(addr))
    };

    const changeLanguage = (e) => {
        let newLang = i18n.language === 'en' ? 'cn' : 'en'
        i18n.changeLanguage(newLang);
        localStorage.setItem('lng', newLang)
    }


    const navLinks = [
        { title: loggedIn ? t('wallet') : t('home'), path: loggedIn ? `/wallet` : `/` },
        // { title: t('swap'), path: `/swap` },
        // { title: t('pool'), path: `/pool` },
        // { title: loggedIn ? t('wallet') : t('home'), path: `/comingSoon` },
        { title: t('swap'), path: `/comingSoon` },
        { title: t('pool'), path: `/comingSoon` },
        { title: t('collectReward'), path: `/collectReward` },
    ]

    const barRef = React.useRef(null);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const switchAccount = async () => {
        await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{
                eth_accounts: {},
            }]
        }).then(res => {
            handleClose()
        })
    };


    function handleNewChain(chainId) {
        setChainId(chainId)
        sendBackChainId(chainId)
    }

    function handleNewNetwork(networkId) {
        setNetwork(networkId)
        sendBackNetworkId(networkId)
    }

    function handleNewAccounts(addr) {
        let address = addr === undefined || addr.length < 1 ? '' : addr[0]
        setAddr(address)
        sendBackAddr(address)
    }

    const initialize = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.enable();
                const newAccounts = await window.ethereum.request({
                    method: 'eth_accounts',
                })
                const chainId = await window.ethereum.request({
                    method: 'eth_chainId',
                })

                const networkId = await window.ethereum.request({
                    method: 'net_version',
                })
                handleNewChain(chainId)
                handleNewNetwork(networkId)
                handleNewAccounts(newAccounts)
            } catch (err) {
                console.error('Error on init when getting accounts', err)
            }
            window.ethereum.autoRefreshOnNetworkChange = false
            window.ethereum.on('chainChanged', handleNewChain)
            window.ethereum.on('networkChanged', handleNewNetwork)
            window.ethereum.on('accountsChanged', handleNewAccounts)
            setStartWatch(true)
        }
    }

    useEffect(() => {
        if (startWatch) {
            dispatch(authActions.logOut())
        }
    }, [chainId, network, addr])



    useEffect(() => {
        initialize()
        return () => {
        }
    }, [])

    useEffect(() => {
        if (barRef.current && tempHeight === null) {
            tempHeight = barRef.current.getBoundingClientRect().height;
            sendBackHeight(tempHeight)
        }
        return () => {
        }
    }, [])

    useEffect(() => {
        /**
         * imToken DApp browser
         */
        if (!!window.imToken) {
            setAddr(window.ethereum.selectedAddress)
            sendBackAddr(window.ethereum.selectedAddress)
            setChainId(window.ethereum.chainId)
            sendBackChainId(window.ethereum.chainId)
            setNetwork(window.ethereum.networkVersion)
            sendBackNetworkId(window.ethereum.networkVersion)
        }
        return () => {
        }

    }, window.imToken)

    useEffect(() => {
        if (prevNavMessageRef.current === '' && (message === 'Wrong network id.')) {
            handleOpenMsgModal()
        }

        prevNavMessageRef.current = message;
        return () => {
        }

    }, [message, width])

    const anchorRef = React.useRef(null);
    const handleToggle = () => {
        setOpenMore((prevOpen) => !prevOpen);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenMore(false);
        }
    }

    const handleCloseMore = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpenMore(false);
    };

    return (
        <div ref={barRef}>
            {/*<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, backgroundColor: '#000C75' }}>*/}
            {/*    <Typography style={{ color: 'white', fontSize: 16, fontWeight: "bold" }}>metamask iconmetamask iconmetamask iconmetamask icon</Typography>*/}
            {/*    <Button style={{ alignItems: 'center', justifyContent: 'center' }} aria-label="home">*/}
            {/*        <Typography style={{ color: '#1DF0A9', fontSize: 16, fontWeight: "bold" }}>链接钱包</Typography>*/}

            {/*        <img style={{ width: 13, height: 12, marginLeft: 4 }} src={toArrow} />*/}
            {/*    </Button>*/}
            {/*</div>*/}
            <div style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: 80 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Button aria-label="home" style={{ height: '100%' }}>
                        <img style={{ height: 61 * 0.8, width: 53 * 0.8, marginLeft: 24, marginRight: 24 }} src={logo} />
                    </Button>
                    <div style={{ width: 1, height: '80%', backgroundColor: '#EAEAEA' }} />
                    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                        {
                            width > 900 ?
                                navLinks.map(({ title, path }) => (
                                    <NavLink to={path} key={title} style={{
                                        height: '100%', textDecoration: `none`
                                    }}
                                             InputProps={{ disableUnderline: true }}
                                        // activeClassName={classes.selected}
                                             isActive={(match, location) => {
                                                 if (location.pathname === path) {
                                                     return true
                                                 } else if (location.pathname.includes('wallet') && path === '/wallet') {
                                                     return true
                                                 } else {
                                                     return false
                                                 }
                                             }}
                                    >
                                        <ListItem button style={{ height: '100%' }}>
                                            <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                {title}
                                            </Typography>

                                        </ListItem>
                                    </NavLink>
                                )) : null
                        }

                        <div style={{ alignItems: 'center', justifyContent: 'center', }}>
                            { width > 900 ?
                                <Button style={{backgroundColor: 'none', height: '100%'}}
                                        ref={anchorRef}
                                        aria-controls={openMore ? 'menu-list-grow' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleToggle}
                                >
                                    <Typography style={{
                                        fontSize: 16,
                                        color: '#010846',
                                        fontWeight: 'bold',
                                        marginLeft: 16,
                                        marginRight: 16,
                                        textTransform: 'capitalize'
                                    }}>
                                        {t('more')}
                                    </Typography>
                                    <img style={{width: 13, height: 7.5, marginLeft: -8, marginRight: 8}}
                                         src={downButton}/>
                                </Button> :
                                <Button style={{ backgroundColor: 'none', height: '100%' }}
                                        ref={anchorRef}
                                        aria-controls={openMore ? 'menu-list-grow' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleToggle}
                                >
                                    <label htmlFor="icon-button-file">
                                        <IconButton color="primary" aria-label="upload picture" component="span">
                                            <MoreVertIcon />
                                        </IconButton>
                                    </label>
                                </Button>
                            }
                            <Popper open={openMore} anchorEl={anchorRef.current} role={undefined} transition>
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleCloseMore}>
                                                <MenuList style={{ zIndex: 999 }} autoFocusItem={openMore} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                    {
                                                        width <= 900 ?
                                                            navLinks.map(({ title, path }) => (
                                                                <NavLink to={path} key={title} style={{
                                                                    height: '100%', textDecoration: `none`
                                                                }}
                                                                         InputProps={{ disableUnderline: true }}
                                                                    // activeClassName={classes.selected}
                                                                         isActive={(match, location) => {
                                                                             if (location.pathname === path) {
                                                                                 return true
                                                                             } else if (location.pathname.includes('wallet') && path === '/wallet') {
                                                                                 return true
                                                                             } else {
                                                                                 return false
                                                                             }
                                                                         }}
                                                                >
                                                                    <ListItem button style={{ height: '100%' }}>
                                                                        <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                                            {title}
                                                                        </Typography>

                                                                    </ListItem>
                                                                </NavLink>
                                                            )) : null
                                                    }
                                                    <MenuItem onClick={() => {
                                                        i18n.language.includes('zh') ?
                                                            window.open('https://docs.sato.trade/v/cn/social-media', '_blank')
                                                            :
                                                            window.open('https://docs.sato.trade/contact-us', '_blank')
                                                    }}>
                                                        <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                            {t('aboutSATO')}
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => {window.open("https://swapall.io/download", '_blank')}}>
                                                        <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                            {t('downloadAndroid')}
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => {
                                                        i18n.language.includes('zh') ?
                                                            window.open('https://swapall.io/download', '_blank')
                                                            :
                                                            window.open('https://apps.apple.com/app/swapall/id1532973986?l=en', '_blank')
                                                    }}>
                                                        <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                            {t('downloadIOS')}
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => {window.open('https://t.me/SwapAll_announcement', '_blank')}}>
                                                        <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                            {t('telegram')}
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => {window.open('https://twitter.com/SwapAll_', '_blank')}}>
                                                        <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                            {t('twitter')}
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => {window.open('https://discord.com/invite/TSjdAE4Ksu', '_blank')}}>
                                                        <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                            {t('discord')}
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => {window.open('https://medium.com/swapall', '_blank')}}>
                                                        <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                            {t('medium')}
                                                        </Typography>
                                                    </MenuItem>
                                                    {/* <MenuItem
                                                onClick={changeLanguage}

                                            >

                                                <img style={{ height: 61 * 0.8, width: 53 * 0.8, marginLeft: 24, marginRight: 4, }} src={satoShapLogo} />

                                                <Typography style={{ fontSize: 16, color: '#010846', fontWeight: 'bold', textTransform: 'none', marginLeft: 16, marginRight: 16 }}>
                                                    {t('lang')}
                                                </Typography>
                                            </MenuItem> */}

                                                    {/* <Button className={classes.langBtn} onClick={changeLanguage} variant="contained" >{t('lang')}</Button> */}
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>
                    </div>
                </div>
                <Button style={{ marginRight: 0, borderRadius: 0, backgroundColor: '#1DF0A9' }}
                        onClick={!window.ethereum ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : () => onClickConnect(network, chainId, addr, dispatch)}
                        variant="contained">
                    <img style={{ width: 37, height: 34, marginLeft: 4 }} src={mataLogo} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', marginLeft: 12, marginRight: 24 }}>
                        <Typography style={{ fontSize: 16, color: '#000F93', fontWeight: 'bold' }}>
                            {button1}
                        </Typography>
                        <Typography style={{ fontSize: 12, color: '#111111', fontWeight: '600', marginTop: -8 }}>
                            {`${addr.slice(0, 8)}...${addr.slice(addr.length - 3)}`}
                        </Typography>
                    </div>
                </Button>
            </div>
            <Modal
                disablePortal
                disableEnforceFocus
                disableAutoFocus
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">{loggedIn ? t('metamaskConnected') : t('metamaskLogin')}</h2>
                        <p id="transition-modal-description">{addr}</p>
                        <Button className={classes.addrBtn} onClick={switchAccount} variant="contained">
                            {t('switch')}
                        </Button>
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
                open={openMsgModal}
                onClose={handleCloseMsgModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openMsgModal}>
                    <div className={classes.paper}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">{t('wrongNetwork')}</h2>
                        </div>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <p id="transition-modal-description">{t('wrongNetworkContent')}</p>
                            </Grid>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default withTranslation()(Navbar);
