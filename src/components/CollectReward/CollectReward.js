import React from 'react';
import './CollectReward.css';
import { makeStyles } from '@material-ui/core/styles';
import useWindowDimensions from '../../utils/WindowDimensions'
import logo from '../../images/rewardHeadImage.png'
import { Link } from 'react-router-dom';

import { withTranslation } from 'react-i18next';
import { Typography, Grid, Button, Card, CardContent, Modal, CardHeader } from '@material-ui/core';

function CollectReward(t, navBarHeight) {

    const { height, width } = useWindowDimensions();
    const useStyles = makeStyles((theme) => ({
        root: {
            ...theme.typography.button,
            backgroundColor: "#010746",
            padding: theme.spacing(1),
            flexGrow: 1,
            height: height,
            textAlign: 'center',
            justifyContent:'center',
            height:1200
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

    }));
    const classes = useStyles();
    return (
        // 
        //     <Card className={classes.card}>
        //         <CardHeader className={classes.cardHeader}>
        //             <img className={classes.cardImage} src={logo} />
        //         </CardHeader>
        //         <CardContent className={classes.cardContent}>

        //             aaa

        //         </CardContent>
        //     </Card>


        // 
        <div className={classes.root}>
   
            <div className='cards__container'>
                <img
                    className='cards__item__img'
                    // alt='Travel Image'
                    src={logo}
                />
                <div className='cards__wrapper'>


                    <div className='cards__item__info'>
                        <h1 className='cards__item__text'>邀请奖励</h1>
                        <h1 className='cards__content__text'>领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励领取奖励</h1>

                    </div>

                    <div className='cards__cell__wrapper'>
                        <div className='cards__small__cell'>
                            <h5 className='cards__cell__title'>
                                以登记人数
                                </h5>
                            <h5 className='cards__cell__value'>
                                15,000
                                </h5>

                        </div>
                        <div className='cards__large__cell'>
                            <h5 className='cards__cell__title'>
                                SATO奖励发放总数
                                </h5>
                            <h5 className='cards__cell__value__large'>
                                300,000
                                </h5>

                        </div>

                        <div className='cards__small__cell'>
                            <h5 className='cards__cell__title'>
                                预计每人发放
                                </h5>
                            <h5 className='cards__cell__value'>
                                20 SATO
                                </h5>
                        </div>
                    </div>
                    <div className='cards__button__container'>
                        
                            一件登记
                    

                    </div>

                    {/* </li>
                        </ul> */}
                </div>
            </div>
        </div>
        // </div >
    )
}

export default withTranslation()(CollectReward);
