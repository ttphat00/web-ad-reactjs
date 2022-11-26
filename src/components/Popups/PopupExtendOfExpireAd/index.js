import styles from './PopupExtendOfExpireAd.module.css';
import { FaWindowClose } from "react-icons/fa";
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { apiURL, authorization } from '../../../config';
import ErrorNotification from '../../Notification/ErrorNotification';
import { useNavigate } from 'react-router-dom';
import PaypalCheckoutButton from '../../PaypalCheckoutButton';

function PopupExtendOfExpireAd({ handleShowPopupExtendOfExpireAd, idAd, idOrder }) {
    let navigate = useNavigate();
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [showPaypalButton, setShowPaypalButton] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
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

    const handleChangeDuration = (e) => {
        setDuration(e.target.value);
        setShowPaypalButton(false);
        setDisabledButton(false);
        
    }

    const handleExtend = (orderId) => {
        const today = new Date();
        const expireDate = new Date();
        
        today.setHours(today.getHours() + 7);
        expireDate.setHours(expireDate.getHours() + 7);
        expireDate.setDate(expireDate.getDate() + parseInt(duration));

        axios.put(`${apiURL}ads/extend/${idAd}`, {
            expireDate: expireDate,
            numberOfExtensionDays: parseInt(ad.numberOfExtensionDays) + parseInt(duration),
        })
            .then(res => {
                console.log('Cap nhat thoi han tin quang cao');
                return axios.put(`${apiURL}orders/${idOrder}`, {
                    status: 'Đang chờ xác nhận',
                })
            })
            .then(res => {
                console.log('Cap nhat thanh trang thai Dang cho xac nhan');
                return axios.post(`${apiURL}orders`, {
                    totalCost: parseInt(duration),
                    idAd: idAd,
                    cost: parseInt(duration),
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
    }

    return ( 
        <div onClick={() => handleShowPopupExtendOfExpireAd(false)} className={styles.wrapper}>
            {showErrorNotification && <ErrorNotification />}
            <div onClick={(e) => e.stopPropagation()} className={styles.inner}>
                <div 
                onClick={() => handleShowPopupExtendOfExpireAd(false)}
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
                    <form className="bg-white px-8 pt-6 pb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                                Chọn thời hạn
                                <span className='font-normal italic'> (1.00 USD/ngày)</span>
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
                            <div className='font-bold text-lg text-teal-500'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(duration)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button onClick={() => {setShowPaypalButton(true); setDisabledButton(true);}} className={clsx("bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full", {
                                'bg-gray-500': disabledButton,
                                'hover:bg-gray-500': disabledButton,
                            })} disabled={disabledButton} type="button">
                                Gia hạn
                            </button>
                        </div>
                    </form>
                    {showPaypalButton &&
                    <div className="flex items-center justify-center bg-white pb-6">
                        <span className='text-gray-500 text-sm mr-2'>Thanh toán với</span>
                        <PaypalCheckoutButton title={ad.title} totalCost={parseInt(duration)} handleApprove={handleExtend} />
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default PopupExtendOfExpireAd;