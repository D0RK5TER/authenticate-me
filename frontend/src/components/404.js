import React from 'react';
import { NavLink } from 'react-router-dom';
import ProfileButton from '../components/Navigation/ProfileButton';
import logo from '../assets/logo.jpg';
import quest from '../assets/quest.jpg'

function Failure() {

    return (
        <>
            <div style={{ Top: '30em' }}>
                asdasd
                <div style={{ padding: '10em', top: '10em', zIndex: 1 }} >
                    <p>
                        asdsadasd</p>
                </div>
                asdasdas
                <div>
                    <div style={{ marginTop: '10em', top: '10em' }}>

                        asdasd

                    </div>

                    å                </div>
                Click the home button to get a fresh start!
                SORRY! we could not find what you were looking for!
                Status Code: 404

                <img src={quest} />
            </div>
        </>

    );
}

export default Failure;