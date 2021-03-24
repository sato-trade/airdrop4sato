import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Typography, Grid, Button, Card, CardContent,
    List, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import useWindowDimensions from '../../utils/WindowDimensions'

import { walletActions } from '../../redux/actions/walletActions';
import { useDispatch, useSelector } from 'react-redux';
import { roundingDown } from '../../utils/RoundingDown'
import { getIcons } from "../../utils/Common";

function Wallet({t, navBarHeight}) {
    const { height, width } = useWindowDimensions();
    const useStyles = makeStyles((theme) => ({
        root: {
            ...theme.typography.button,
            backgroundColor: '#010846',
            padding: theme.spacing(1),
            flexGrow: 1,
            height: height - navBarHeight,
            textAlign: 'center'
        },
        walletBox: {
            width: 441,
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
        }
    }));
    const classes = useStyles();

    const { token, loggedIn } = useSelector(state => state.auth)
    const { userCapitals, tokenIcons } = useSelector(state => state.wallet)
    const dispatch = useDispatch();

    useEffect(() => {
        if (loggedIn) {
            dispatch(walletActions.getUserCapital(token))
            dispatch(walletActions.getAllTokenStatus(token))
        }
        return() => {
            console.log('clear initialization')
        }
    }, [])

    return (
        <div className={classes.root}>
            <Card className={classes.walletBox}>
                <CardContent className={classes.walletContent}>
                    <Grid container spacing={2} >
                        <Grid item xs={12} >
                            <Typography className={classes.wrapper} color="textSecondary" gutterBottom>
                                {t('walletTitle')}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Link to='/wallet/deposit'>
                                <Button style={{ width: 100 }}  className={classes.btn} disabled={!loggedIn}>
                                    {t('deposit')}
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={8}>
                            <Link to='/wallet/withdraw'>
                                <Button style={{ width: 180 }}  className={classes.btn} disabled={!loggedIn}>
                                    {t('withdraw')}
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <div style={{ height: 1, marginTop: 20, marginBottom: 20, backgroundColor: '#2435AC' }} />
                    <Grid container spacing={2} >
                        <Grid item xs={12} >
                            <Typography className={classes.wrapper} color="textSecondary" gutterBottom>
                                {t('capitalTitle')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <div className={classes.wrapper}>
                                {userCapitals === undefined || userCapitals.length <= 0 ?
                                    <Typography style={{ fontSize: 13 }}>{t('noCapitals')}</Typography> :
                                    <List className={classes.capitalList}>
                                        {
                                            userCapitals.map(item => (
                                                <ListItem key={item.id} button>
                                                    <ListItemAvatar>
                                                        <Avatar alt="Travis Howard" src={getIcons(item.token, tokenIcons, true)} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={item.token} />
                                                    <ListItemSecondaryAction>
                                                        <Typography>{roundingDown(item.free, 4)}</Typography>
                                                    </ListItemSecondaryAction>

                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                }
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default withTranslation()(Wallet);
