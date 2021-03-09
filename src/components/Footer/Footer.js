import React from 'react';
import './Footer.css';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Typography } from '@material-ui/core';

function Footer({t}){
    const classes = useStyles();
    return(
        <div className={classes.footer}>
           <Typography className={classes.footerText}>Footer</Typography>
        </div>
    )
}

const useStyles = makeStyles({
    footer: {
        position: 'absolute',
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

export default withTranslation()(Footer);
