import styles from './PopupUserInfo.module.css';
import { FaWindowClose } from "react-icons/fa";
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { apiURL } from '../../../config';

function PopupUserInfo({ handleShowPopupUserInfo, idUser }) {
    const [ user, setUser ] = useState({});

    useEffect(() => {
        axios.get(`${apiURL}customers/${idUser}`)
            .then(res => setUser(res.data))
            .catch(err => console.log(err))
    }, [])

    const formatTime = (time) => {
        const createdDate = new Date(time);
        createdDate.setHours(createdDate.getHours() - 7);
        
        let hour = createdDate.getHours();
        if(hour < 10){
            hour = `0${hour}`;
        }

        let minute = createdDate.getMinutes();
        if(minute < 10){
            minute = `0${minute}`;
        }

        let date = createdDate.getDate();
        if(date < 10){
            date = `0${date}`;
        }

        let month = createdDate.getMonth() + 1;
        if(month < 10){
            month = `0${month}`;
        }

        const year = createdDate.getFullYear();

        return `${year}-${month}-${date} - ${hour}:${minute}`;
    }

    return ( 
        <div onClick={() => handleShowPopupUserInfo(false)} className={styles.wrapper}>
            <div onClick={(e) => e.stopPropagation()} className={styles.inner}>
                <div 
                onClick={() => handleShowPopupUserInfo(false)}
                className='absolute top-[-15px] right-[-10px] cursor-pointer'
                >
                    <FaWindowClose className='text-white text-xl rounded-full' />
                </div>
                <div className={styles.title}>
                    <div 
                    className={clsx(styles.signin)}>
                        THÔNG TIN CHI TIẾT
                    </div>
                </div>
                <div className='text-sm'>
                    <div className="flex justify-between px-4 py-2 mt-2">
                        <div className='font-bold text-gray-500 flex items-center'>Tên liên hệ:</div>
                        <div className='max-w-[250px]'>{user.name}</div>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                        <div className='font-bold text-gray-500 flex items-center'>Giới tính:</div>
                        <div className='max-w-[250px]'>{user.gender}</div>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                        <div className='font-bold text-gray-500 flex items-center'>Email:</div>
                        <div className='max-w-[250px]'>{user.email}</div>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                        <div className='font-bold text-gray-500 flex items-center'>Điện thoại:</div>
                        <div className='max-w-[250px]'>{user.phone}</div>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                        <div className='font-bold text-gray-500 flex items-center'>Địa chỉ:</div>
                        <div className='max-w-[250px]'>{user.address}</div>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                        <div className='font-bold text-gray-500 flex items-center'>Ngày tạo:</div>
                        <div className='max-w-[250px]'>{formatTime(user.createdAt)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupUserInfo;