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
    const [address, setAddress] = useState('')
    const sendBackHeight = (height) => {
        setNavBarHeight(height)
    }

    const sendBackAddr = (addr) => {
        setAddress(addr)
    }

    const { loggedIn } = useSelector(state => state.auth)

    const withLoggedInState = Component => {
        return function NewComponent({ isLoggedIn, ...props }) {
            console.log('isLoggedIn----------------------------------------------------: ', loggedIn)
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
            <Navbar address={address} sendBackHeight={sendBackHeight} />
            <Switch>
                <Route exact path='/' >
                    <Home sendBackAddr={sendBackAddr} navBarHeight={navBarHeight} />
                </Route>
                    <LoggedInRoute isLoggedIn={loggedIn} path='/wallet' render={({ match: { url } }) => (
                        <>
                            <LoggedInRoute isLoggedIn={loggedIn} path={`${url}/`} exact >
                                <Wallet sendBackAddr={sendBackAddr} navBarHeight={navBarHeight} />
                            </LoggedInRoute>
                            <LoggedInRoute isLoggedIn={loggedIn} path={`${url}/withdraw`} >
                                <Withdraw sendBackAddr={sendBackAddr} navBarHeight={navBarHeight} />
                            </LoggedInRoute>
                            <LoggedInRoute isLoggedIn={loggedIn} path={`${url}/deposit`} >
                                <Deposit sendBackAddr={sendBackAddr} navBarHeight={navBarHeight} />
                            </LoggedInRoute>
                        </>
                    )} />
                <LoggedInRoute isLoggedIn={loggedIn} path='/pool' >
                    <Pool navBarHeight={navBarHeight} />
                </LoggedInRoute>
                <LoggedInRoute isLoggedIn={loggedIn} path='/swap' component = {Swap} >
                    <Swap navBarHeight={navBarHeight} />
                </LoggedInRoute>
            </Switch>
            <Footer />
        </Router>
    )
}

export default App
