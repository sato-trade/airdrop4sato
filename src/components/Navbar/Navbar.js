import React from 'react';
import './Navbar.css';
import { withTranslation } from 'react-i18next';
import {Link} from 'react-router-dom'
import i18n from '../../i18n';

function Navbar({t}){
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }
    return(
        <nav className="Nav">
            <ul>
                <li>
                    <Link to="/">{t('Home')}</Link>
                </li>
                <li>
                    <Link to="/pool">{t('Pool')}</Link>
                </li>
                <li>
                    <Link to="/swap">{t('Swap')}</Link>
                </li>
                <li>
                    <button onClick={() => changeLanguage('cn')}>cn</button>
                    <button onClick={() => changeLanguage('en')}>en</button>
                </li>
            </ul>
        </nav>
    )
}

export default withTranslation()(Navbar);
