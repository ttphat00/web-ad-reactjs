import { Link } from 'react-router-dom';
import styles from './PopupLogin.module.css';
import { FaWindowClose } from "react-icons/fa";
import { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { apiURL } from '../../../config';
import SuccessNotification from '../../Notification/SuccessNotification';
import ErrorNotification from '../../Notification/ErrorNotification';

function PopupLogin({ handleShowLogin, handleLogedIn }) {
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [form, setForm] = useState('signin');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleShowSignIn = () => {
        setForm('signin');
        setEmail('');
        setPassword('');
    }

    const handleShowSignUp = () => {
        setForm('signup');
        setEmail('');
        setPassword('');
        setName('');
    }

    const handleChangeName = (e) => {
        setName(e.target.value);
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSignUp = async () => {
        try {
            const res = await axios.post(`${apiURL}auth/register`, {
                name,
                email,
                password
            });

            console.log(res.data);

            setShowSuccessNotification(true);

            setForm('signin');
            setEmail('');
            setPassword('');

            setTimeout(() => {
                setShowSuccessNotification(false);
            }, 5000);

        } catch (error) {

            console.log(error);

            setShowErrorNotification(true);

            setTimeout(() => {
                setShowErrorNotification(false);
            }, 5000);
        }
    }

    const handleSignIn = async () => {
        try {
            const res = await axios.post(`${apiURL}auth/customer-login`, {
                email,
                password
            });

            console.log(res.data);

            setShowSuccessNotification(true);

            handleShowLogin();

            localStorage.setItem('token', res.data.accessToken);

            handleLogedIn(true);

            setTimeout(() => {
                setShowSuccessNotification(false);
            }, 5000);

        } catch (error) {

            console.log(error);

            setShowErrorNotification(true);

            setTimeout(() => {
                setShowErrorNotification(false);
            }, 5000);
        }
    }

    return ( 
        <div onClick={() => handleShowLogin()} className={styles.wrapper}>
            {showSuccessNotification && <SuccessNotification />}
            {showErrorNotification && <ErrorNotification />}
            <div onClick={(e) => e.stopPropagation()} className={styles.inner}>
                <div 
                onClick={() => handleShowLogin()}
                className='absolute top-[-15px] right-[-10px] cursor-pointer'
                >
                    <FaWindowClose className='text-white text-xl rounded-full' />
                </div>
                <div className={styles.title}>
                    <div 
                    onClick={handleShowSignIn} 
                    className={clsx(styles.signin, {
                        'text-gray-500': form !== 'signin',
                        'border-none': form !== 'signin',
                    })}>
                        Đăng nhập
                    </div>
                    <div 
                    onClick={handleShowSignUp} 
                    className={clsx(styles.signup, {
                        'text-teal-500': form === 'signup',
                        'border-b-2': form === 'signup',
                        'border-solid': form === 'signup',
                        'border-teal-500': form === 'signup',
                    })}
                    >
                        Đăng ký
                    </div>
                </div>
                {form === 'signup'
                ?
                <div>
                    <form className="bg-white px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Tên liên hệ
                            </label>
                            <input value={name} onChange={handleChangeName} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Tên liên hệ" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input value={email} onChange={handleChangeEmail} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Mật khẩu
                            </label>
                            <input value={password} onChange={handleChangePassword} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Mật khẩu" required />
                        </div>
                        <div className="flex items-center justify-between">
                            <button onClick={handleSignUp} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                                Đăng ký
                            </button>
                        </div>
                    </form>
                </div>
                : 
                <div>
                    <div className={styles.form}>
                        <form className="bg-white px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input value={email} onChange={handleChangeEmail} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Mật khẩu
                                </label>
                                <input value={password} onChange={handleChangePassword} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Mật khẩu" required />
                            </div>
                            <div className="flex items-center justify-between">
                                <button onClick={handleSignIn} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[60%]" type="button">
                                    Đăng nhập
                                </button>
                                <Link className="inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800" to="">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </form>
                    </div>
                    <div>
                        <div className='text-center text-sm text-gray-500 mb-3'>Đăng nhập với</div>
                        <div className={styles.google}>
                            <img className='w-[40px] h-full object-contain' src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' alt='' />
                            <div className='flex-1 flex items-center justify-center translate-x-[-20px] font-medium text-blue-500'>Google</div>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    );
}

export default PopupLogin;