import styles from './PopupExtend.module.css';
import { FaWindowClose } from "react-icons/fa";
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { apiURL, authorization } from '../../../config';
import ErrorNotification from '../../Notification/ErrorNotification';
import { useNavigate } from 'react-router-dom';

function PopupExtend({ handleShowPopupExtend, idAd }) {
    let navigate = useNavigate();
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [ user, setUser ] = useState({});
    const [ durations, setDurations ] = useState(() => {
        const arr = [];
        for(let i=1; i<=90; i++){
            arr.push(i);
        }
        return arr;
    });
    const [ duration, setDuration ] = useState(1);
    const [ ad, setAd ] = useState({});

    useEffect(() => {
        axios.get(`${apiURL}ads/${idAd}`)
            .then(res => setAd(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}customers/profile`, authorization(localStorage.getItem('token')))
            .then(res => {
                // console.log(res.data);
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    const handleChangeDuration = (e) => {
        setDuration(e.target.value);
    }

    const handleExtend = () => {
        const today = new Date();
        const expireDate = new Date(ad.expireDate);
        
        today.setHours(today.getHours() + 7);
        expireDate.setDate(expireDate.getDate() + parseInt(duration));

        // if((parseInt(user.accountBalance) - parseInt(duration)*10000) >= 0){
            // axios.put(`${apiURL}customers/update-my-info`, {
            //     accountBalance: (parseInt(user.accountBalance) - parseInt(duration)*10000)
            // }, authorization(localStorage.getItem('token')))
            //     .then(res => {
            //         console.log("Tru tien");
            //         return axios.put(`${apiURL}ads/extend/${idAd}`, {
            //              display: true,
            //              expireDate: expireDate,
            //              numberOfExtensionDays: parseInt(duration),
            //          })
            //     })
                axios.put(`${apiURL}ads/extend/${idAd}`, {
                    display: true,
                    expireDate: expireDate,
                    numberOfExtensionDays: parseInt(duration),
                })
                    .then(res => {
                        console.log('Cap nhat thoi han tin quang cao')
                        return axios.post(`${apiURL}orders`, {
                            totalCost: parseInt(duration)*10000,
                            idAd: idAd,
                            cost: parseInt(duration)*10000,
                            orderDate: today,
                            status: 'Gia hạn tin',
                        }, authorization(localStorage.getItem('token')))
                    })
                    .then(res => {
                        console.log('Tao order moi');
                        navigate(`/gia-han/${res.data._id}`);
                    })
                    .catch(err => {
                        console.log(err);
            
                        setShowErrorNotification(true);

                        setTimeout(() => {
                            setShowErrorNotification(false);
                        }, 5000);
                    })
        // }else{
        //     window.alert('Số dư tài khoản của bạn không đủ để thực hiện giao dịch này!');
        // }
    }

    return ( 
        <div onClick={() => handleShowPopupExtend(false)} className={styles.wrapper}>
            {showErrorNotification && <ErrorNotification />}
            <div onClick={(e) => e.stopPropagation()} className={styles.inner}>
                <div 
                onClick={() => handleShowPopupExtend(false)}
                className='absolute top-[-15px] right-[-10px] cursor-pointer'
                >
                    <FaWindowClose className='text-white text-xl rounded-full' />
                </div>
                <div className={styles.title}>
                    <div 
                    className={clsx(styles.signin)}>
                        GIA HẠN TIN
                    </div>
                </div>
                <div>
                    <form className="bg-white px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                                Thêm thời hạn
                                <span className='font-normal italic'> (10.000 VNĐ/ngày)</span>
                            </label>
                            <div className='flex'>
                                <div className="mb-3 w-[25%]">
                                    <select className="form-select
                                    block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding bg-no-repeat
                                    border border-solid border-gray-300
                                    rounded
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:outline-none"
                                    onChange={handleChangeDuration}>
                                        {durations.map(number => {
                                            return <option key={number} value={number}>{number}</option>
                                        })}
                                    </select>
                                </div>
                                <div className='h-max mt-2 text-sm ml-2 text-gray-500'>Ngày</div>
                            </div>
                        </div>
                        <div className="flex justify-between bg-[#FFF7F4] px-4 py-2 mb-6">
                            <div className='font-bold flex items-center'>Tổng thanh toán:</div>
                            <div className='font-bold text-lg text-teal-500'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(duration*10000)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button onClick={handleExtend} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                                Gia hạn
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PopupExtend;