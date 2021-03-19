import React, { useState, useEffect } from 'react';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { Typography, Grid, Button, Card, CardContent, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import MetaMaskOnboarding from '@metamask/onboarding'
import { isValidAddress } from 'ethereumjs-util'
import useWindowDimensions from '../../utils/WindowDimensions'

import { walletActions } from '../../redux/actions/walletActions';
import { useDispatch, useSelector } from 'react-redux';

const Web3 = require("web3");
const { isMetaMaskInstalled } = MetaMaskOnboarding

function Withdraw(){
    return(
        <div>
            Withdraw
        </div>
    )
}

export default withTranslation()(Withdraw);
