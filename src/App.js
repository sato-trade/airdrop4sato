import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar'
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Home from './components/Home/Home';
import Wallet from './components/Home/Wallet';
import Pool from './components/Pool/Pool'
import Swap from './components/Swap/Swap'
import Withdraw from './components/Withdraw/Withdraw'
import Deposit from './components/Deposit/Deposit'
import Footer from './components/Footer/Footer';
import {useSelector} from "react-redux";

function App(){
    const [navBarHeight, setNavBarHeight] = useState(0)
    const [ address, setAddress ] = useState('')
    const [ chainId, setChainId ] = useState(0)
    const [ network, setNetwork ] = useState('')
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

    const { loggedIn } = useSelector(state => state.auth)

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

    const LoggedInRoute = withLoggedInState(Route)

    return(
        <Router>
            <Navbar sendBackAddr={sendBackAddr} sendBackChainId={sendBackChainId} sendBackNetworkId={sendBackNetworkId} sendBackHeight={sendBackHeight} />
            <Switch>
                <Route exact path='/' >
                    <Home address={address}  network={network} chainId={chainId} navBarHeight={navBarHeight} />
                </Route>
                    <Route isLoggedIn={loggedIn} path='/wallet' render={({ match: { url } }) => (
                        <>
                            <Route isLoggedIn={loggedIn} path={`${url}/`} exact >
                                <Wallet  address={address}  network={network} chainId={chainId}  navBarHeight={navBarHeight} />
                            </Route>
                            <Route isLoggedIn={loggedIn} path={`${url}/withdraw`} >
                                <Withdraw  address={address}  network={network} chainId={chainId}  navBarHeight={navBarHeight} />
                            </Route>
                            <Route isLoggedIn={loggedIn} path={`${url}/deposit`} >
                                <Deposit  address={address}  network={network} chainId={chainId}  navBarHeight={navBarHeight} />
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

export default App
