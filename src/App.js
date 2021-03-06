import React, {useEffect, useState} from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Home from './components/Home/Home';
import CollectReward from './components/CollectReward/CollectReward';
import Footer from './components/Footer/Footer';
import ComingSoon from './components/ComingSoon/ComingSoon';
import Wallet from './components/Home/Wallet';
import Pool from './components/Pool/Pool';
import Swap from './components/Swap/Swap';
import Withdraw from './components/Withdraw/Withdraw';
import Deposit from './components/Deposit/Deposit';
import Records from './components/Records/Records';
import {useDispatch, useSelector} from "react-redux";
import {withTranslation} from "react-i18next";
import {isMetaMaskConnected, onBoard} from "./utils/Sign";
import {isValidAddress} from "ethereumjs-util";
import {authActions} from "./redux/actions";
import i18n from './i18n';
import useWindowDimensions from "./utils/WindowDimensions";

function App({t}){
    const [navBarHeight, setNavBarHeight] = useState(0)
    const [ address, setAddress ] = useState('')
    const [ chainId, setChainId ] = useState(0)
    const [ network, setNetwork ] = useState('')
    const [ button1, setButton1 ] = useState('')
    const [ button1Disabled, setButton1Disabled ] = useState(true)
    const [ button2, setButton2] = useState('')
    const [ button2Disabled, setButton2Disabled] = useState(true)

    const { height, width } = useWindowDimensions();

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
        const accountButtonsDisabled = window.ethereum === undefined
        if (accountButtonsDisabled) {
            setButton2Disabled(true)
        } else {
            setButton2Disabled(false)
        }
        if (window.ethereum === undefined) {
            setButton1(t('noWallet'))
            setButton1Disabled(false)
        } else if (address.length === 42 && isValidAddress(address)) {
            setButton1(t('connected'))
            setButton1Disabled(true)
            if (onBoard) {
                onBoard.stopOnboarding()
            }
        } else {
            setButton1(t('connect'))
            setButton1Disabled(false)
        }
    }


    useEffect(() => {
        if (address.length === 42 && isValidAddress(address)) {
            dispatch(authActions.checkUser(address))
        }
        return() => {
        }
    }, [address, network, chainId])

    useEffect(() => {
        if (loggingIn) {
            setButton2(t('loggingIn'))
        } if (!registered)  {
            setButton2(t('registered'))
        } if (registered && !loggedIn) {
            setButton2(t('unlock'))
        } if (registered && loggedIn) {
            setButton2(t('loggedIn'))
            setButton2Disabled(true)
        }
        updateButtons()
        return() => {
        }
    }, [i18n.language, registered, loggedIn, loggingIn, loading])

    useEffect(() => {
        updateButtons()
        return() => {
        }
    }, [button1Disabled, button2Disabled, button1, address ])


    const LoggedInRoute = withLoggedInState(Route)

    return (
        <Router>
            <Navbar width={width} button1={button1} sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled}
                    sendBackAddr={sendBackAddr} sendBackChainId={sendBackChainId} sendBackNetworkId={sendBackNetworkId} sendBackHeight={sendBackHeight} />
            <Switch>
                {/*<Route exact path='/' >*/}
                {/*    <Home sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}*/}
                {/*          sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}*/}
                {/*          address={address}  network={network} chainId={chainId} navBarHeight={navBarHeight} />*/}
                {/*</Route>*/}
                <Route exact path='/' component={CollectReward} >
                    <CollectReward sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}
                                   sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}
                                   address={address}  network={network} chainId={chainId} navBarHeight={navBarHeight}   navBarHeight={navBarHeight} />
                </Route>
                <Route  path='/wallet' render={({ match: { url } }) => (
                    <>
                        {/*<Route path={`${url}/`} exact >*/}
                        {/*    <Wallet  sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}*/}
                        {/*             sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}*/}
                        {/*             address={address}  network={network} chainId={chainId}  navBarHeight={navBarHeight} />*/}
                        {/*</Route>*/}
                        <Route path={`${url}/`} exact >
                            <ComingSoon sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}
                                        sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}
                                        address={address}  network={network} chainId={chainId} navBarHeight={navBarHeight}   navBarHeight={navBarHeight} />
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
                        <Route path={`${url}/records`} >
                            <Records  sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}
                                      sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}
                                      address={address}  network={network} chainId={chainId}  navBarHeight={navBarHeight} />
                        </Route>
                    </>
                )} />
                <Route path='/pool' >
                    <Pool navBarHeight={navBarHeight} />
                </Route>
                <Route path='/swap' component={Swap} >
                    <Swap navBarHeight={navBarHeight} />
                </Route>
                <Route path='/collectReward' component={CollectReward} >
                    <CollectReward sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}
                                   sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}
                                   address={address}  network={network} chainId={chainId} navBarHeight={navBarHeight}   navBarHeight={navBarHeight} />
                </Route>
                <Route path='/comingSoon' component = {ComingSoon}>
                    <ComingSoon sendBackButton1={sendBackButton1} sendBackButton1Disabled={sendBackButton1Disabled} button1={button1} button1Disabled={button1Disabled}
                                sendBackButton2={sendBackButton2} sendBackButton2Disabled={sendBackButton2Disabled} button2={button2} button2Disabled={button2Disabled}
                                address={address}  network={network} chainId={chainId} navBarHeight={navBarHeight}   navBarHeight={navBarHeight} />
                </Route>
            </Switch>
            <Footer />
        </Router>
    )
}

export default withTranslation()(App);
