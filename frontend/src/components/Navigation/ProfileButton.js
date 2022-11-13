import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import outline from '../../assets/outline.png';
import SignUpFormModal from '../SignUpFormModal';
import LoginFormModal from '../LoginFormModal';

function ProfileButton() {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const user = useSelector(state => state.session.user);

    const openMenu = () => {
        if (showMenu) setShowMenu(false);
        else setShowMenu(true);
    };

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };
    let sessionLinks;
    if (!user) {
        sessionLinks = (
            <>
                {showMenu && (
                    <ul className="profile-dropdown" style={{ translate: '-2em', textAlign: 'center' }}>
                        <li>

                            <LoginFormModal />
                        </li>
                        <li>

                            <SignUpFormModal />
                        </li>


                    </ul>

                )}
            </>
        );
    } else {
        sessionLinks = (
            <>
                {showMenu && (
                    <ul className="profile-dropdown" style={{ translate: '-2em', textAlign: 'center' }}>
                        <li >{user.username}</li>
                        <li >{user.email}</li>
                        <li>
                            <button onClick={logout}>Log Out</button>
                        </li>
                        {/* <li>

                            <SignUpFormModal />
                        </li> */}

                    </ul>

                )}
            </>
        );
    }


    return (

        <div className='dropbar'>


            <div>
                <button onClick={openMenu} className='profilebutt'>
                    <img src={outline} className='profileshape' />
                </button>
                {sessionLinks}

            </div>
            <>
            </>
        </div>

    );
}

export default ProfileButton;
// {showMenu && (
//     <ul className="profile-dropdown" style={{ translate: '-2em', textAlign: 'center' }}>
//         <li >{user.username}</li>
//         <li >{user.email}</li>
//         <li>
//             <button onClick={logout}>Log Out</button>
//         </li>
//         {/* <li>

//                 <SignUpFormModal />
//             </li> */}

//     </ul>

// )}