import React from 'react';
import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from '../../assets/logo.jpg';


function Navigation() {
    return (
        <div className='topbar'>
            <NavLink exact to="/" className={'homebutt'} >
                <img src={logo} style={{ paddingRight: '15px' }} />
                earthRnR
            </NavLink>
            <ProfileButton />
        </div>
    );
}

export default Navigation;