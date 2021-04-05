import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { withTranslation } from 'react-i18next';
import { NavLink, useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, List, ListItem, ListItemText, AppBar, Button, Toolbar, Container, Modal, Fade, Backdrop } from '@material-ui/core';
import logo from '../../images/logo.png'
import i18n from '../../i18n';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../redux/actions";
import MetaMaskOnboarding from "@metamask/onboarding";
import { onClickConnect, onClickInstall } from "../../utils/Sign";
import CustomButton from "../CommonElements/CustomButton";
const { isMetaMaskInstalled } = MetaMaskOnboarding

let tempHeight = null;

function Navbar({ t, sendBackHeight, sendBackAddr, sendBackChainId, sendBackNetworkId, button1, sendBackButton1, sendBackButton1Disabled }) {
    const useStyles = makeStyles((theme) => ({
        bar: {
            background: '#010846'
        },
        navbarDisplayFlex: {
            display: `flex`,
            justifyContent: `space-between`
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
            textTransform: `uppercase`,
            color: `green`,
            alignSelf: 'center'
        },
        logo: {
            height: 40
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
            color: 'white'
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

    const [chainId, setChainId] = useState(0)
    const [network, setNetwork] = useState('')
    const [addr, setAddr] = useState('')
    const [startWatch, setStartWatch] = useState(false)

    const { loggedIn, registered } = useSelector(state => state.auth)
    const history = useHistory();
    const dispatch = useDispatch();

    const changeLanguage = (e) => {
        let newLang = i18n.language === 'en' ? 'cn' : 'en'
        window.location.reload();

        i18n.changeLanguage(newLang);
        localStorage.setItem('lng', newLang)

    }


    const navLinks = [
        { title: loggedIn ? t('wallet') : t('home'), path: loggedIn ? `/wallet` : `/` },
        // { title: t('swap'), path: `/swap` },
        //
        // { title: t('pool'), path: `/pool` },
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
        if (isMetaMaskInstalled()) {
            try {
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
            console.log('clear initialization')
        }
    }, [])

    useEffect(() => {
        if (barRef.current && tempHeight === null) {
            tempHeight = barRef.current.getBoundingClientRect().height;
            sendBackHeight(tempHeight)
        }
    }, [])


    return (
        <div ref={barRef}>
            <AppBar className={classes.bar} position="static">
                <Toolbar>
                    <Container maxWidth="md" className={classes.navbarDisplayFlex}>
                        <IconButton edge="start" color="inherit" aria-label="home">
                            <img className={classes.logo} src={logo} />
                        </IconButton>
                        <List
                            component="nav"
                            aria-labelledby="main navigation"
                            className={classes.navDisplayFlex}
                        >
                            {navLinks.map(({ title, path }) => (
                                <NavLink to={path} key={title} className={classes.linkText}
                                    activeClassName={classes.selected}
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
                                    <ListItem button>
                                        <ListItemText primary={title} />
                                    </ListItem>
                                </NavLink>
                            ))}
                            <Button className={classes.langBtn} onClick={changeLanguage} variant="contained" >{t('lang')}</Button>
                            <Button className={classes.addrBtn} onClick={!isMetaMaskInstalled() ? () => onClickInstall(sendBackButton1, sendBackButton1Disabled) : window.ethereum && registered ? handleOpen : onClickConnect} variant="contained">
                                {`${addr.slice(0, 5)} ... ${addr.slice(addr.length - 3)}`}
                            </Button>
                        </List>
                    </Container>
                </Toolbar>
            </AppBar>
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
        </div>
    )
}

export default withTranslation()(Navbar);
