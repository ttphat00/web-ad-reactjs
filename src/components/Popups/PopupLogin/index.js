import { Link } from 'react-router-dom';
import styles from './PopupLogin.module.css';
import { FaWindowClose } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { apiURL } from '../../../config';
import SuccessNotification from '../../Notification/SuccessNotification';
import ErrorNotification from '../../Notification/ErrorNotification';
import emailjs from '@emailjs/browser';

function PopupLogin({ handleShowLogin, handleLogedIn }) {
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [form, setForm] = useState('signin');
    const [toggle, setToggle] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showCodeText, setShowCodeText] = useState(false);
    const [code, setCode] = useState('');
    const [codeText, setCodeText] = useState('');
    const [showError, setShowError] = useState(false);
    const [showErrorLogin, setShowErrorLogin] = useState(false);
    const [waitButton, setWaitButton] = useState(false);

    const handleShowSignIn = () => {
        setForm('signin');
        setEmail('');
        setPassword('');
        setToggle(true);
        setShowCodeText(false);
    }

    const handleShowSignUp = () => {
        setForm('signup');
        setEmail('');
        setPassword('');
        setName('');
        setToggle(true);
        setShowCodeText(false);
    }

    const handleTogglePassword = () => {
        setToggle(!toggle);
    }

    const handleChangeName = (e) => {
        setName(e.target.value);
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
        setShowErrorLogin(false);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
        setShowErrorLogin(false);
    }

    const handleChangeCodeText = (e) => {
        setCodeText(e.target.value);
        setShowError(false);
    }

    const handleGetCode = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        if (form.checkValidity()) {
            
            setShowCodeText(true);
    
            const randomCode = Math.round(Math.random()*1000000);
        
            emailjs.send(process.env.REACT_APP_EMAIL_SERVICE, process.env.REACT_APP_EMAIL_TEMPLATE_SIGN_UP, {
                to_email: email,
                code: randomCode,
            }, process.env.REACT_APP_EMAIL_PUBLIC_KEY)
                .then((result) => {
                    console.log(result);
                }, (error) => {
                    console.log(error);
                });
    
            setCode(randomCode);
        }
    }

    const handleSignUp = async () => {

        setTimeout(async () => {

            if(parseInt(codeText)===parseInt(code)){
                try {
                    const createdAt = new Date();
                    
                    createdAt.setHours(createdAt.getHours() + 7);
                    
                    const res = await axios.post(`${apiURL}auth/register`, {
                        name,
                        email,
                        password,
                        createdAt
                    });
        
                    console.log(res.data);
        
                    setShowSuccessNotification(true);
        
                    setForm('signin');
                    setEmail('');
                    setPassword('');
                    setShowCodeText(false);
        
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
            }else{
                setShowError(true);
            }

            setWaitButton(false);

        }, 5000);

        setWaitButton(true);
    }

    const handleSignIn = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        if (form.checkValidity()) {
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

                setShowErrorLogin(true);
    
                setShowErrorNotification(true);
    
                setTimeout(() => {
                    setShowErrorNotification(false);
                }, 5000);
            }
        }
    }

    return ( 
        <div onClick={() => handleShowLogin()} className={styles.wrapper}>
            {showSuccessNotification && <SuccessNotification />}
            {showErrorNotification && <ErrorNotification />}
            <div onClick={(e) => e.stopPropagation()} className={styles.inner}>
                <div 
                onClick={() => handleShowLogin()}
                className='absolute top-[-15px] right-[-10px] max-[739px]:right-[-15px] max-[739px]:top-[-23px] cursor-pointer'
                >
                    <FaWindowClose className='text-white text-xl max-[739px]:text-3xl rounded-full' />
                </div>
                <div className={styles.title}>
                    <div 
                    onClick={handleShowSignIn} 
                    className={clsx(styles.signin, {
                        'text-gray-500': form !== 'signin',
                        'border-none': form !== 'signin',
                    })}>
                        ????ng nh???p
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
                        ????ng k??
                    </div>
                </div>
                {form === 'signup' && !showCodeText &&
                <div>
                    <form className="bg-white px-8 pt-6 pb-8 mb-4" onSubmit={handleGetCode}>
                        <div className="mb-4 max-[739px]:mt-2">
                            <label className="max-[739px]:text-xl block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                T??n li??n h???
                            </label>
                            <input value={name} onChange={handleChangeName} className="max-[739px]:text-xl shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="T??n li??n h???" required />
                        </div>
                        <div className="mb-4 max-[739px]:mt-5">
                            <label className="max-[739px]:text-xl block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input value={email} onChange={handleChangeEmail} className="max-[739px]:text-xl shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" required />
                        </div>
                        <div className="mb-6 relative max-[739px]:mt-5">
                            <label className="max-[739px]:text-xl block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                M???t kh???u
                            </label>
                            <input value={password} onChange={handleChangePassword} className="max-[739px]:text-xl shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type={toggle ? 'password' : 'text'} placeholder="M???t kh???u" required />
                            {toggle
                            ?
                            <FaEye onClick={handleTogglePassword} className='max-[739px]:text-xl absolute right-[8px] bottom-[21px] text-lg text-teal-500 cursor-pointer'/>
                            :
                            <FaEyeSlash onClick={handleTogglePassword} className='max-[739px]:text-xl absolute right-[8px] bottom-[21px] text-lg text-teal-500 cursor-pointer'/>
                            }
                        </div>
                        <div className="flex items-center justify-between max-[739px]:mt-5">
                            <button className="bg-teal-500 hover:bg-teal-700 text-white max-[739px]:text-xl max-[739px]:py-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
                                ????ng k??
                            </button>
                        </div>
                        <div className='text-sm text-gray-500 mt-3 max-[739px]:text-sm'>Khi b???m ????ng k??, m?? x??c nh???n s??? ???????c g???i v??? Email c???a b???n.</div>
                    </form>
                </div>
                }   
                {form === 'signup' && showCodeText &&
                <div>
                    <form className="bg-white px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4 max-[739px]:mt-2">
                            <label className="max-[739px]:text-xl block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                                M?? x??c nh???n
                            </label>
                            <input value={codeText} onChange={handleChangeCodeText} className="max-[739px]:text-xl shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="code" type="text" placeholder="Nh???p m?? x??c nh???n" required />
                            {showError && <span className='text-sm text-red-500'>M?? x??c nh???n kh??ng ????ng.</span>}
                        </div>
                        <div className="flex items-center justify-between max-[739px]:mt-5">
                            <button onClick={handleSignUp} className={clsx("bg-teal-500 hover:bg-teal-700 text-white max-[739px]:text-xl max-[739px]:py-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full", {
                                'cursor-wait': waitButton,
                                'bg-gray-500': waitButton,
                                'hover:bg-gray-500': waitButton,
                            })} disabled={waitButton} type="button">
                                X??c nh???n
                            </button>
                        </div>
                    </form>
                </div>
                }   
                {form === 'signin' &&
                <div>
                    <div className={styles.form}>
                        <form className="bg-white px-8 pt-6 pb-8 mb-4" onSubmit={handleSignIn}>
                            <div className="mb-4 max-[739px]:mt-2">
                                <label className="max-[739px]:text-xl block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input value={email} onChange={handleChangeEmail} className="max-[739px]:text-xl shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" required />
                            </div>
                            {showErrorLogin && <div className='text-sm text-red-500 italic mb-4'>T??i kho???n ho???c m???t kh???u kh??ng ????ng</div>}
                            <div className="mb-6 relative max-[739px]:mt-5">
                                <label className="max-[739px]:text-xl block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    M???t kh???u
                                </label>
                                <input value={password} onChange={handleChangePassword} className="max-[739px]:text-xl shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type={toggle ? 'password' : 'text'} placeholder="M???t kh???u" required />
                                {toggle
                                ?
                                <FaEye onClick={handleTogglePassword} className='max-[739px]:text-xl absolute right-[8px] bottom-[21px] text-lg text-teal-500 cursor-pointer'/>
                                :
                                <FaEyeSlash onClick={handleTogglePassword} className='max-[739px]:text-xl absolute right-[8px] bottom-[21px] text-lg text-teal-500 cursor-pointer'/>
                                }
                            </div>
                            <div className="flex items-center justify-between max-[739px]:mt-5">
                                <button className="bg-teal-500 hover:bg-teal-700 text-white max-[739px]:text-xl max-[739px]:py-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[60%]" type="submit">
                                    ????ng nh???p
                                </button>
                                <Link className="max-[739px]:text-sm inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800" to="">
                                    Qu??n m???t kh???u?
                                </Link>
                            </div>
                        </form>
                    </div>
                    {/* <div>
                        <div className='max-[739px]:text-4xl max-[739px]:mt-8 text-center text-sm text-gray-500 mb-3'>????ng nh???p v???i</div>
                        <div className={styles.google}>
                            <img className='w-[40px] max-[739px]:w-[96px] h-full object-contain' src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' alt='' />
                            <div className='max-[739px]:text-5xl flex-1 flex items-center justify-center translate-x-[-20px] font-medium text-blue-500'>Google</div>
                        </div>
                    </div> */}
                </div>
                }
            </div>
        </div>
    );
}

export default PopupLogin;