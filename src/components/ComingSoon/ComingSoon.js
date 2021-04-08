import React from 'react';
import {Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {withTranslation} from 'react-i18next';
import useWindowDimensions from '../../utils/WindowDimensions'
import './ComingSoon.css';

const Web3 = require("web3");

function ComingSoon({ t }) {
    const { height, width } = useWindowDimensions();
    const useStyles = makeStyles((theme) => ({
        root: {
            ...theme.typography.button,
            backgroundColor: '#010846',
            padding: theme.spacing(1),
            flexGrow: 1,
            textAlign: 'center',
            height:900
        },
        walletBox: {
            maxWidth: 441,
            borderRadius: 24,
            backgroundColor: '#101B66',
            justifyContent: 'center',
            display: 'inline-flex',
            marginTop: 100,
            paddingTop: 30,
            paddingBottom: 30
        },
        walletContent: {
            width: 300,
            alignItems: 'flex-start',
        },
        wrapper: {
            color: 'white',
            alignItems: 'flex-start',
            display: 'flex'
        },
        textLarge: {
            color: 'white',
            fontSize: 34,
            fontWeight: '600',
        },

        textMid: {
            color: 'white',
            fontSize: 20,
            fontWeight: '600'
        },

        textSmall: {
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            textTransform:"none"
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
        }
    }));
    const classes = useStyles();

    console.log('comingSoon: ', t('comingSoon'))

    return (
        <div className={classes.root}>
            <div className='comingSoon__container '>
                <div className='comingSoon__wrapper'>
                    <div className='comingSoon__title__wrapper' style={{ justifyContent: 'center' }}>
                        <Typography className={classes.textLarge} style={{textTransform:'none'}}>
                            {t('comingSoon')}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(ComingSoon);
