import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import logo from '../../assets/logo.jpg';


function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <>
                <ProfileButton user={sessionUser}/>
            </>
        );
    } else {
        sessionLinks = (
            <>
                <LoginFormModal />
                {/* <NavLink to="/signup">Sign Up</NavLink> */}
            </>
        );
    }
    // eva.replace()
    return (
        <span className='topbar'>

            <NavLink exact to="/" className={'homebutt'} >
                <img src={logo} style={{ paddingRight: '15px' }} />
                earthRnR
            </NavLink>


            {sessionLinks}
        </span>

    );
}

export default Navigation;