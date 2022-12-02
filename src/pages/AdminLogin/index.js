import styles from './AdminLogin.module.css';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { apiURL } from '../../config';
import ErrorNotification from '../../components/Notification/ErrorNotification';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    let navigate = useNavigate();
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [toggle, setToggle] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleTogglePassword = () => {
        setToggle(!toggle);
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSignIn = async () => {
        try {
            const res = await axios.post(`${apiURL}auth/admin-login`, {
                email,
                password
            });

            console.log(res.data);

            localStorage.setItem('admin_token', res.data.accessToken);
            localStorage.setItem('admin_id', res.data.admin._id);

            navigate('/admin/quan-ly-nguoi-dung');

        } catch (error) {

            console.log(error);

            setShowErrorNotification(true);

            setTimeout(() => {
                setShowErrorNotification(false);
            }, 5000);
        }
    }

    return ( 
        <div className={styles.wrapper}>
            {showErrorNotification && <ErrorNotification />}
            <div className={styles.inner}>
                <div className={styles.title}>
                    <div 
                    className={clsx(styles.signin)}>
                        ĐĂNG NHẬP
                    </div>
                </div>
                <div>
                    <div className={styles.form}>
                        <form className="bg-white px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input value={email} onChange={handleChangeEmail} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" required />
                            </div>
                            <div className="mb-6 relative">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Mật khẩu
                                </label>
                                <input value={password} onChange={handleChangePassword} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type={toggle ? 'password' : 'text'} placeholder="Mật khẩu" required />
                                {toggle
                                ?
                                <FaEye onClick={handleTogglePassword} className='absolute right-[8px] bottom-[21px] text-lg text-teal-500 cursor-pointer'/>
                                :
                                <FaEyeSlash onClick={handleTogglePassword} className='absolute right-[8px] bottom-[21px] text-lg text-teal-500 cursor-pointer'/>
                                }
                            </div>
                            <div className="flex items-center justify-center">
                                <button onClick={handleSignIn} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[60%]" type="button">
                                    Đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;