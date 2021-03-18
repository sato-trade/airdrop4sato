import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {IconButton, List, ListItem, ListItemText, AppBar, Button, Toolbar, Container, Modal, Fade, Backdrop} from '@material-ui/core';
import logo from '../../images/logo.png'
import i18n from '../../i18n';

let tempHeight = null;

function Navbar({t, sendBackHeight, address}){
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
    const changeLanguage = (e) => {
        let newLang = i18n.language === 'en' ? 'cn' : 'en'
        i18n.changeLanguage(newLang);
        localStorage.setItem('lng', newLang)
    }

    const [open, setOpen] = useState(false)

    const navLinks = [
        { title: t('wallet'), path: `/` },
        { title: t('swap'), path: `/swap` },
        { title: t('pool'), path: `/pool` },
    ]

    const barRef = React.useRef(null);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const disconnect = async () => {
        await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{
                eth_accounts: {},
            }]
        });
    };

    useEffect(() => {
        if (barRef.current && tempHeight === null) {
            tempHeight = barRef.current.getBoundingClientRect().height;
            sendBackHeight(tempHeight)
        }
    }, [])

    console.log('addr: ', address)

    return(
        <div ref={barRef}>
            <AppBar className={classes.bar} position="static">
                <Toolbar>
                    <Container maxWidth="md" className={classes.navbarDisplayFlex}>
                        <IconButton edge="start" color="inherit" aria-label="home">
                            <img className={classes.logo} src={logo}/>
                        </IconButton>
                        <List
                            component="nav"
                            aria-labelledby="main navigation"
                            className={classes.navDisplayFlex}
                        >
                            {navLinks.map(({ title, path }) => (
                                <a href={path} key={title} className={classes.linkText}>
                                    <ListItem button>
                                        <ListItemText primary={title} />
                                    </ListItem>
                                </a>
                            ))}
                            <Button className={classes.langBtn} onClick={changeLanguage} variant="contained" >{t('lang')}</Button>
                            <Button className={classes.addrBtn} onClick={handleOpen} variant="contained">
                                {`${address.slice(0,5)} ... ${address.slice(address.length - 3)}`}
                            </Button>
                        </List>
                    </Container>
                </Toolbar>
            </AppBar>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
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
                        <h2 id="transition-modal-title">{t('metamaskConnected')}</h2>
                        <p id="transition-modal-description">{address}</p>
                        {
                            window.ethereum ?
                                <Button className={classes.addrBtn} onClick={disconnect} variant="contained">
                                    {t('switch')}
                                </Button> : null
                        }

                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default withTranslation()(Navbar);
