import { useState } from "react";
import validate from "./steroid";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailerror, setEmailerror] = useState('');
    const [passworderror, setPassworderror] = useState('');
    // const [redirect, setRedirect] = useState(false);

    async function register(ev) {
        ev.preventDefault();
        const result = await validate(email, password);
        console.log('Register clickedd', result);
        if(result.email !== 'True')
            setEmailerror(result.email);
        if(result.password !== 'True')
            setPassworderror(result.password);
        if(result.email && result.password){
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: {'Content-Type': 'application/json'},
            })
            if(response.status !== 200){
                alert('Registeration failed');
            } else {
                alert('Registration successful');
            }
        }
    }
    return(
        <div className="relative flex items-start justify-center h-screen bg-gradient-to-r from-indigo-200 to-yellow-100">
            <div className="flex justify-center my-12">
                <div className="container">
                    <form className="flex flex-col justify-center items-center" onSubmit={register}>
                        <div className="space-y-8 w-6/12 p-12 bg-white/20 backdrop-blur-sm border border-indigo-300 rounded-md">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                                <div className="mt-2">
                                    <input id="email" name="email" type="email" autoComplete="email" 
                                    value={email}
                                    onChange={ev => {setEmail(ev.target.value);
                                        setEmailerror('');
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focuc:border focus:border-purple-300 sm:text-sm sm:leading-6" />
                                </div>
                                <div id='emailError' className="text-red-600 font-medium text-sm mt-2">{emailerror}</div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">password</label>
                                <div className="mt-2">
                                    <input id="password" name="password" type="password" autoComplete="password" 
                                    value={password}
                                    onChange={ev => {setPassword(ev.target.value);
                                        setPassworderror('');
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                                <div id='passwordError' className="text-red-600 font-medium text-sm mt-2">{passworderror}</div>
                            </div>
                            <div className="flex justify-center items-center">
                                <button type="submit" className="w-full sm:w-4/12 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}