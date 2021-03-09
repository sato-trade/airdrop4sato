import React, { useState, useEffect } from 'react';
import './App.css';


import Navbar from './components/Navbar/Navbar'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";import Home from './components/Home/Home';
import Pool from './components/Pool/Pool'
import Swap from './components/Swap/Swap'
import Footer from './components/Footer/Footer';

function App(){
    const [navBarHeight, setNavBarHeight] = useState(0)
    const sendBackHeight = (height) => {
        setNavBarHeight(height)
    }


    return(
        <Router>
            <Navbar sendBackHeight={sendBackHeight} />
            <Switch>
                <Route exact path='/' >
                    <Home navBarHeight={navBarHeight} />
                </Route>
                <Route path='/pool' >
                    <Pool navBarHeight={navBarHeight} />
                </Route>
                <Route path='/swap' component = {Swap} >
                    <Swap navBarHeight={navBarHeight} />
                </Route>
            </Switch>
            <Footer />
        </Router>
    )
}

export default App
