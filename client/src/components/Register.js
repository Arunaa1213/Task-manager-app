import { useState } from 'react';
import validate from './steroid';
import Googlelogin from './GoogleLogin';
import { Link } from 'react-router-dom';

export default function Register() {
    const [formState, setFormState] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmpassword: '',
        firstnameError: '',
        lastnameError: '',
        emailError: '',
        passwordError: '',
        confirmpasswordError: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
            [`${name}Error`]: ''
        }));
    };

    async function register(ev) {
        ev.preventDefault();
        const result = validate(formState);

        setFormState(prevState => ({
            ...prevState,
            firstnameError: result.firstname,
            lastnameError: result.lastname,
            emailError: result.email,
            passwordError: result.password,
            confirmpasswordError: result.confirmpassword
        }));

        if (result.firstname === 'True' && result.lastname === 'True' && result.email === 'True' && result.password === 'True' && result.confirmpassword === 'True') {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
                method: 'POST',
                body: JSON.stringify({
                    firstname: formState.firstname,
                    lastname: formState.lastname,
                    email: formState.email,
                    password: formState.password
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status !== 200) {
                alert('Registration failed');
            } else {
                alert('Registration successful');
            }
        }
    }

    return (
        <div className="relative flex items-start justify-center bg-gradient-to-r from-indigo-200 to-yellow-100">
            <div className="flex justify-center my-12">
                <div className="container">
                    <form className="flex flex-col justify-center items-center" onSubmit={register}>
                        <div className="space-y-8 w-6/12 p-12 bg-white/20 backdrop-blur-sm border border-indigo-300 rounded-md">
                            <div>
                                <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">First Name</label>
                                <div className="mt-2">
                                    <input id="firstname" name="firstname" type="text"
                                        value={formState.firstname}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                                {formState.firstnameError !== 'True' && <div id='firstnameError' className="text-red-600 font-medium text-sm mt-2">{formState.firstnameError}</div>}
                            </div>
                            <div>
                                <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
                                <div className="mt-2">
                                    <input id="lastname" name="lastname" type="text"
                                        value={formState.lastname}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                                {formState.lastnameError !== 'True' && <div id='lastnameError' className="text-red-600 font-medium text-sm mt-2">{formState.lastnameError}</div>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                                <div className="mt-2">
                                    <input id="email" name="email" type="email" autoComplete="email"
                                        value={formState.email}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focuc:border focus:border-purple-300 sm:text-sm sm:leading-6" />
                                </div>
                                {formState.emailError !== 'True' && <div id='emailError' className="text-red-600 font-medium text-sm mt-2">{formState.emailError}</div>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <div className="mt-2">
                                    <input id="password" name="password" type="password" autoComplete="password"
                                        value={formState.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                                {formState.passwordError !== 'True' && <div id='passwordError' className="text-red-600 font-medium text-sm mt-2">{formState.passwordError}</div>}
                            </div>
                            <div>
                                <label htmlFor="confirmpassword" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                                <div className="mt-2">
                                    <input id="confirmpassword" name="confirmpassword" type="password" autoComplete="confirmpassword"
                                        value={formState.confirmpassword}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                                {formState.confirmpasswordError !== 'True' && <div id='confirmpasswordError' className="text-red-600 font-medium text-sm mt-2">{formState.confirmpasswordError}</div>}
                            </div>
                            <div className="flex justify-center items-center flex-col">
                                <button type="submit" className="w-full mb-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                                <div className='mb-2'>
                                    <p>Don't have an account? <Link to='/login' className='text-blue-500'>Login</Link></p>
                                </div>
                                <Googlelogin />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
