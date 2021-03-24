import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar'
import {BrowserRouter as Router, Switch, Route, Link, Redirect, useLocation} from "react-router-dom";
import Home from './components/Home/Home';
import CollectReward from './components/CollectReward/CollectReward';

import Wallet from './components/Home/Wallet';
import Pool from './components/Pool/Pool'
import Swap from './components/Swap/Swap'
import Withdraw from './components/Withdraw/Withdraw'
import Deposit from './components/Deposit/Deposit'
import Footer from './components/Footer/Footer';
import {useDispatch, useSelector} from "react-redux";
import {withTranslation} from "react-i18next";
import {isMetaMaskConnected, isMetaMaskInstalled, onBoard} from "./utils/Sign";
import {isValidAddress} from "ethereumjs-util";
import {authActions} from "./redux/actions";

function App({t}){
    const [navBarHeight, setNavBarHeight] = useState(0)
    const [ address, setAddress ] = useState('')
    const [ chainId, setChainId ] = useState(0)
    const [ network, setNetwork ] = useState('')
    const [ button1, setButton1 ] = useState('')
    const [ button1Disabled, setButton1Disabled ] = useState(true)
    const [ button2, setButton2] = useState(t('unlock'))
    const [ button2Disabled, setButton2Disabled] = useState(true)

    const sendBackButton1 = (msg) => {
        setButton1(msg)
    }

    const sendBackButton1Disabled = (status) => {
        setButton1Disabled(status)
    }

    const sendBackButton2 = (msg) => {
        setButton2(msg)
    }

    const sendBackButton2Disabled = (status) => {
        setButton2Disabled(status)
    }

    const sendBackHeight = (height) => {
        setNavBarHeight(height)
    }

    const sendBackAddr = (addr) => {
        setAddress(addr)
    }

    const sendBackChainId = (chainId) => {
        setChainId(chainId)
    }

    const sendBackNetworkId = (networkId) => {
        setNetwork(networkId)
    }

    const { registered, loggedIn, loggingIn, loading } = useSelector(state => state.auth)
    const dispatch = useDispatch();

    const withLoggedInState = Component => {
        return function NewComponent({ isLoggedIn, ...props }) {
            return (
                <div>
                    {!isLoggedIn && <Redirect to='/' />}
                    <Component {...props} />
                </div>
            )
        }
    }

    const updateButtons = () => {
        const accountButtonsDisabled = !isMetaMaskInstalled() || !isMetaMaskConnected()
        if (accountButtonsDisabled) {
            setButton2Disabled(true)
        } else {
            setButton2Disabled(false)
        }
        if (!isMetaMaskInstalled()) {
            setButton1('Click here to install MetaMask!')
            setButton1Disabled(false)
        } else if (isMetaMaskConnected()) {
            setButton1(t('connected'))
            setButton1Disabled(true)
            if (onBoard) {
                onBoard.stopOnboarding()
            }
        } else {
            setButton1('Connect')
            setButton1Disabled(false)
        }
    }


    useEffect(() => {
        if (address.length === 42 && isValidAddress(address)) {
            dispatch(authActions.checkUser(address))
        }
        return() => {
            console.log('clear check')
        }
    }, [address, network, chainId])

    useEffect(() => {
        if (loggingIn) {
            setButton2(t('loggingIn'))
        } else {
            if (registered) {
                if (loggedIn) {
                    setButton2(t('loggedIn'))
                    setButton2Disabled(true)
                }
            } else {
                setButton2(t('unlock'))
            }
        }
        return() => {
            console.log('clear registration')
        }
    }, [registered, loggedIn, loggingIn, loading])

    useEffect(() => {
        updateButtons()
        return() => {
            console.log('clear button')
        }
    }, [button1Disabled, button2Disabled, button1, address ])


    const LoggedInRoute = withLoggedInState(Route)

    return (
        <Router>
            <Navbar sendBackAddr={sendBackAddr} sendBackChainId={sendBackChainId} sendBackNetworkId={sendBackNetworkId} sendBackHeight={sendBackHeight} />
            <Switch>
                <Route exact path='/' >
                    <Home sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}
                          sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}
                          address={address}  network={network} chainId={chainId} navBarHeight={navBarHeight} />
                </Route>
                <Route  path='/wallet' render={({ match: { url } }) => (
                    <>
                        <Route path={`${url}/`} exact >
                            <Wallet  sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}
                                   sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}
                                     address={address}  network={network} chainId={chainId}  navBarHeight={navBarHeight} />
                        </Route>
                        <Route path={`${url}/withdraw`} >
                            <Withdraw  sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}
                                   sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}
                                     address={address}  network={network} chainId={chainId}  navBarHeight={navBarHeight} />
                        </Route>
                        <Route path={`${url}/deposit`} >
                            <Deposit  sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}
                                   sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}
                                     address={address}  network={network} chainId={chainId}  navBarHeight={navBarHeight} />
                        </Route>
                    </>
                )} />
                <Route isLoggedIn={loggedIn} path='/pool' >
                    <Pool navBarHeight={navBarHeight} />
                </Route>
                <Route isLoggedIn={loggedIn} path='/swap' component = {Swap} >
                    <Swap navBarHeight={navBarHeight} />
                </Route>
            </Switch>
            <Footer />
        </Router>
    )
}

export default withTranslation()(App);
