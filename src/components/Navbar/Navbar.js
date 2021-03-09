import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, List, ListItem, ListItemText, AppBar, Button, Toolbar, Container } from '@material-ui/core';
import logo from '../../images/logo.png'
import i18n from '../../i18n';

let tempHeight = null;

function Navbar({t, sendBackHeight}){
    const useStyles = makeStyles({
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
        }
    });
    const classes = useStyles();
    const changeLanguage = (e) => {
        let newLang = i18n.language === 'en' ? 'cn' : 'en'
        i18n.changeLanguage(newLang);
        localStorage.setItem('lng', newLang)
    }

    const navLinks = [
        { title: t('wallet'), path: `/` },
        { title: t('swap'), path: `/swap` },
        { title: t('pool'), path: `/pool` },
    ]

    const barRef = React.useRef(null);

    useEffect(() => {
        if (barRef.current && tempHeight === null) {
            tempHeight = barRef.current.getBoundingClientRect().height;
            sendBackHeight(tempHeight)
        }
    }, [])

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
                        </List>
                    </Container>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default withTranslation()(Navbar);
