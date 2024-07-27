import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import {UserContext} from '../userContext';

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function Header() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            method: 'POST',
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Profile data:', data);
            setUserInfo(data);
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
    }, [setUserInfo]);

    
    
    function logout() {
        fetch('http://localhost:4000/logout', {
            method: 'POST',
            credentials: 'include',
        })
        .then(() => {
            setUserInfo(null);
            navigate('/');
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    }
    
    const userEmail = userInfo?.email;

    return (
        <header className='flex justify-center'>
            <div className='container flex flex-row'>
            <Link to='/' className='logo text-2xl font-bold'>Task Manager</Link>
            <nav className='flex flex-row ml-auto gap-4'>
                {userEmail ? (
                    <>
                        <p>{userEmail}</p>
                        <a onClick={logout}>Logout</a>
                    </>
                ) : (
                    <>
                        <Link to='/login' className='text-xl'>Login</Link>
                        <Link to='/register' className='text-xl'>Register</Link>
                    </>
                )}
            </nav>
            </div>
        </header>
    )
}