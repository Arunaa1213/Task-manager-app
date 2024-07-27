import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { useContext, useEffect, useState } from "react";
import { gapi } from "gapi-script"; 
import { UserContext } from '../userContext';

export default function Frontpage() {
    const { setUserInfo } = useContext(UserContext);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const navigate = useNavigate();
    const clientid = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: {clientid},
                scope: '',
            });
        }
        gapi.load('client:auth2', start);
    }, [clientid]);

    const onSuccess = async (res) => {
        // const profile = res.profileObj;
        try {
            const response = await fetch('http://localhost:4000/google-login', {
                method: 'POST',
                body: JSON.stringify({ tokenId: res.tokenId }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (response.status === 200) {
                const userInfo = await response.json();
                setUserInfo(userInfo);
                setIsSignedIn(true); 
                navigate('/profile');
            } else {
                console.log('Google login failed');
            }
        } catch (error) {
            console.error('Error during Google login', error);
        }
    };

    const onFailure = (res) => {
        console.log("Login failed", res);
    };

    const onLogoutSuccess = () => {
        setUserInfo(null);
        setIsSignedIn(false); 
        console.log('Successfully logged out');
    }

    return(
        <div className="relative flex items-center justify-center h-screen bg-gradient-to-r from-indigo-200 to-yellow-100">
            <div className="text-center space-y-6">
                <Link to='/register' className="bg-indigo-600 text-white px-6 py-3 rounded-md m-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300">
                    Register
                </Link>
                <Link to='/login' className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow-lg m-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300">
                    Login
                </Link>
                <div id='googlesignin'>
                    {!isSignedIn && (
                        <GoogleLogin
                            clientId= {clientid}
                            buttonText='Login'
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    )}
                </div>
                <div id='googlelogout'>
                    {isSignedIn && (
                        <GoogleLogout
                            clientId= {clientid}
                            buttonText="Logout"
                            onLogoutSuccess={onLogoutSuccess}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
