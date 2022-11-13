import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import outline from '../../assets/outline.png';
import SignUpFormModal from '../SignUpFormPage/SignUpForm';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };
    //person-outline
    ////////LOGO BELOW NEEDS STYLING https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
    return (
        <>


            <div className='dropbar'>
                <div>
                    <button onClick={openMenu} className='profilebutt'>
                        <img src={outline} className='profileshape' />
                    </button>
                </div>

                {showMenu && (
                    <>
                        <SignUpFormModal />
                        <ul className="profile-dropdown" style={{ translate: '-2em', textAlign: 'center' }}>
                            <li >{user.username}</li>
                            <li >{user.email}</li>
                            <li>
                                {/* <button onClick={logout}>Log Out</button> */}
                            </li>


                        </ul>
                    </>
                )}
            </div>
        </>
    );
}

export default ProfileButton;