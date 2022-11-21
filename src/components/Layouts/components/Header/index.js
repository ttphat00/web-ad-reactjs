import PopupLogin from '../../../Popups/PopupLogin';
import styles from './Header.module.css';
import logo from '../../../../logo.png';
import { FaUserCircle } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL, authorization } from '../../../../config';
import clsx from 'clsx';

function Header({ changeAvatar, handleSetUser }) {
    let navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [logedIn, setLogedIn] = useState(false);
    const [user, setUser] = useState({});
    const [keyWord, setKeyWord] = useState('');
    const [ads, setAds] = useState([]);
    const filteredItems = ads.filter(item => item.title && item.title.toLowerCase().includes(keyWord.toLowerCase()));

    const handleChangeKeyWord = (e) => {
        setKeyWord(e.target.value); 
    }

    const handleSearch = () => {
        if(keyWord){
            navigate(`/tim-kiem/${keyWord}`);
            setKeyWord('');
        }
    }

    const handleShowLogin = () => {
        setShow(!show); 
    }

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setLogedIn(false);
    }

    const handlePost = () => {
        if(localStorage.getItem('token')){
            navigate('/dang-tin');
        }else{
            handleShowLogin();
        }
    }

    useEffect(() => {
        if(localStorage.getItem('token')){
            setLogedIn(true);
        }
    }, [])

    useEffect(() => {
        if(localStorage.getItem('token')){
            axios.get(`${apiURL}customers/profile`, authorization(localStorage.getItem('token')))
                .then(res => {
                    // console.log(res.data);
                    setUser(res.data);
                    if(handleSetUser){
                        handleSetUser(res.data);
                    }
                })
                .catch(err => console.log(err))
        }
    }, [logedIn, changeAvatar])

    useEffect(() => {
        axios.get(`${apiURL}ads`)
            .then(res => {
                // console.log(res.data);
                const arr = [...res.data].reverse();
                setAds(arr);
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <header className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.logo}>
                    <Link to='/'><img className='w-full h-full object-contain' src={logo} alt='' /></Link>
                </div>
                <div className={styles.search}>
                    <div className={`flex basis-full ${logedIn ? 'justify-evenly' : 'justify-center'}`}>
                        <div className="xl:w-3/4 relative">
                            <div className="input-group relative flex flex-wrap items-stretch w-full">
                                <input onChange={handleChangeKeyWord} value={keyWord} type="search" className="form-control relative flex-auto min-w-0 block w-full pl-3 pr-16 py-1.5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none" placeholder="Nhập từ khóa cần tìm kiếm..." aria-label="Search" aria-describedby="button-addon2" />
                                <button onClick={handleSearch} className="absolute top-0 right-0 bottom-0 btn inline-block px-5 py-1.5 bg-teal-500 text-white text-xs leading-tight rounded-full shadow-md hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg transition duration-150 ease-in-out flex items-center" type="button" id="button-addon2">
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className={clsx('absolute top-[34px] left-0 w-full shadow bg-white', {
                                'hidden': !keyWord
                            })}>
                                <ul>
                                    {filteredItems.map(ad => {
                                        return ad.display && <li key={ad._id} onClick={() => {navigate(`/chi-tiet/${ad.title}`); setKeyWord('');}} className='hover:bg-gray-100 px-4 py-1 border-b-[1px] cursor-pointer'>{ad.title}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        {logedIn && 
                        <div className="flex items-center bg-gray-100 rounded-full px-2">
                            <FaBell className='text-teal-500 text-lg cursor-pointer'/>
                        </div>
                        }
                    </div>
                </div>
                <div className={styles.login}>
                    {logedIn
                    ?
                    <div 
                    className={`${styles.user} flex cursor-pointer items-center relative h-full`}
                    >
                        <img src={user.avatar} alt='' className='w-[30px] h-[30px] rounded-full object-cover'/>
                        <div className='h-max ml-1'>{user.name && `${user.name.slice(0, 7)}...`}</div>
                        <FaCaretDown className='ml-1'/>
                        <div className={`${styles.dropdown} w-max shadow bg-white absolute top-[55px] right-0 px-4 py-2 hidden`}>
                            <ul>
                                <li className='py-1'><Link to='/user/tai-khoan' className='hover:text-teal-500'>Thông tin tài khoản</Link></li>
                                <li className='py-1'><Link to='/user/quan-ly-tin' className='hover:text-teal-500'>Quản lý tin đăng</Link></li>
                                <li className='py-1'><Link to='/user/lich-su-giao-dich' className='hover:text-teal-500'>Lịch sử giao dịch</Link></li>
                                <li className='py-1'><Link to='/user/tin-da-luu' className='hover:text-teal-500'>Tin đã lưu</Link></li>
                                <li className='py-1'>
                                    <div onClick={handleSignOut} className='hover:text-teal-500'>
                                        <FaSignOutAlt className='inline text-sm'/> 
                                        Đăng xuất
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    :
                    <div 
                    onClick={handleShowLogin} 
                    className='flex hover:text-[#333] cursor-pointer'
                    >
                        <FaUserCircle className='text-2xl'/>
                        <div className='h-max ml-1'>Đăng nhập</div>
                    </div>
                    }
                </div>
                <div className={styles.post}>
                    <button onClick={handlePost} className="bg-teal-500 hover:bg-teal-700 text-white font-medium py-1 px-4 rounded">
                        <FaRegEdit className='inline mr-1'/>
                        Đăng tin
                    </button>
                </div>
            </div>
            {show ? <PopupLogin handleLogedIn={setLogedIn} handleShowLogin={handleShowLogin}/> : null}
        </header>
    )
}

export default Header;