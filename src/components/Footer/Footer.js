import React from 'react';
import './Footer.css';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import { Button, Paper, Typography } from '@material-ui/core';
import cnLogo from '../../images/cnLogo.png'
import enLogo from '../../images/enLogo.png'
import i18n from '../../i18n';

function Footer({ t }) {
    const useStyles = makeStyles({
        footer: {
            // position: 'absolute',
            bottom: 0,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#010846'
        },
        footerText: {
            color: 'white',
            display: 'flex',
            justifyContent: 'center'
        }
    });

    const classes = useStyles();

    const changeLanguage = (e) => {
        let newLang = i18n.language === 'en' ? 'cn' : 'en'
        i18n.changeLanguage(newLang);
        localStorage.setItem('lng', newLang)
    }
    return (
        <div style={{ height: 72, width: '100%', backgroundColor: 'white', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>

            <Button onClick={() => {window.open('mailto:support@swapall.io')}} style={{ marginRight: 0, borderRadius: 0,  height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 16, marginRight: 16 }}>
                    <Typography style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'none' }}>{t('contactUs')}</Typography>
                </div>
            </Button>
            <Button  onClick={() => {window.open('https://swapall.io/privacy', '_blank')}} style={{ marginRight: 0, borderRadius: 0, height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 16, marginRight: 16 }}>
                    <Typography style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'none' }}>{t('privacy')}</Typography>

                </div>
            </Button>

            <Button onClick={changeLanguage} style={{ marginRight: 0, borderRadius: 0,  height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 16, marginRight: 16 }}>
                    <Typography style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'none' }}>{t('lang')}</Typography>
                    <img style={{ width: 24, height: 24, marginLeft: 8 }} src={i18n.language === 'en' ? cnLogo : enLogo} />
                </div>
            </Button>

        </div >

    )
}



export default withTranslation()(Footer);
