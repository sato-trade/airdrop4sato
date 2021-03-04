import React from 'react';
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
    return(
        <Router>
            <Navbar/>
            <Switch>
                <Route path='/' exact component = {Home} />
                <Route path='/pool' component = {Pool} />
                <Route path='/swap' component = {Swap} />
            </Switch>
            <Footer/>
        </Router>
    )
}

export default App
