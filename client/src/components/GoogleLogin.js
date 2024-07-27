import { useContext, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import { GoogleLogin } from 'react-google-login';
import { gapi } from "gapi-script"; 

export default function Googlelogin() {
    const {setUserInfo} = useContext(UserContext);
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/google-login`, {
                method: 'POST',
                body: JSON.stringify({ tokenId: res.tokenId }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (response.status === 200) {
                const userInfo = await response.json();
                setUserInfo(userInfo);
                // setIsSignedIn(true); 
                navigate('/profile');
            } else {
                console.log('Google login failed');
                alert('Google login failed');
            }
        } catch (error) {
            console.error('Error during Google login', error);
            alert('Error during Google login', error);
        }
    };

    const onFailure = (res) => {
        console.log("Login failed", res);
        alert("Login failed", res);
    };

    return(
        <div id='googlesignin'>
            <GoogleLogin
                clientId= {clientid}
                buttonText='Login'
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}