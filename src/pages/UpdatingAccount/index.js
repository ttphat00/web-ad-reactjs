import axios from "axios";
import { useEffect, useState } from "react";
import { apiURL, authorization } from "../../config";
import SuccessNotification from "../../components/Notification/SuccessNotification";
import ErrorNotification from "../../components/Notification/ErrorNotification";

function UpdatingAccount({ handleSetPage, changeAvatar }) {
    const [ name, setName ] = useState('');
    const [ gender, setGender ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);

    useEffect(() => {
        handleSetPage('Cập nhật tài khoản');
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}customers/profile`, authorization(localStorage.getItem('token')))
            .then(res => {
                setName(res.data.name);
                setAddress(res.data.address);
                setGender(res.data.gender);
                setPhone(res.data.phone);
            })
            .catch(err => console.log(err))
    }, [])

    const handleChangeName = (e) => {
        setName(e.target.value);
    }

    const handleChangeGender = (e) => {
        setGender(e.target.value);
    }

    const handleChangeAddress = (e) => {
        setAddress(e.target.value);
    }

    const handleChangePhone = (e) => {
        setPhone(e.target.value);
    }

    const handleUpdate = () => {
        axios.put(`${apiURL}customers/update-my-info`, {
            name,
            gender,
            address,
            phone
        }, authorization(localStorage.getItem('token')))
            .then(res => {
                console.log(res.data);

                setShowSuccessNotification(true);

                changeAvatar(prev => !prev);
    
                setTimeout(() => {
                    setShowSuccessNotification(false);
                }, 5000);
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
        <div className="px-10">
            {showErrorNotification && <ErrorNotification />}
            {showSuccessNotification && <SuccessNotification />}
            <div className='flex py-2 border-b-[1px] border-gray-200'>
                <div className='w-[50%] text-gray-700 font-medium flex items-center'>Tên liên hệ:</div>
                <input onChange={handleChangeName} value={name} className="appearance-none border rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" minLength='10' maxLength='100' />
            </div>
            <div className='flex py-2 border-b-[1px] border-gray-200'>
                <div className='w-[50%] text-gray-700 font-medium flex items-center'>Giới tính:</div>
                <select className="form-select
                block
                w-[20%]
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
                onChange={handleChangeGender} value={gender || 'Nam'}
                >
                    <option value='Nam'>Nam</option>
                    <option value='Nữ'>Nữ</option>
                    <option value='Khác'>Khác</option>
                </select>
            </div>
            <div className='flex py-2 border-b-[1px] border-gray-200'>
                <div className='w-[50%] text-gray-700 font-medium flex items-center'>Địa chỉ:</div>
                <textarea onChange={handleChangeAddress} value={address || ''} className="appearance-none border rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none" id="address" rows='3' />
            </div>
            <div className='flex py-2 border-b-[1px] border-gray-200'>
                <div className='w-[50%] text-gray-700 font-medium flex items-center'>Điện thoại:</div>
                <input onChange={handleChangePhone} value={phone} className="appearance-none border rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" />
            </div>
            <div className="mt-5 flex items-center justify-between">
                <button onClick={handleUpdate} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline m-auto" type="button">
                    Cập nhật
                </button>
            </div>
        </div>
    );
}

export default UpdatingAccount;