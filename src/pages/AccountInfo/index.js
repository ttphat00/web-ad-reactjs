import axios from "axios";
import { useEffect, useState } from "react";
import { apiURL, authorization } from "../../config";
import SuccessNotification from "../../components/Notification/SuccessNotification";
import ErrorNotification from "../../components/Notification/ErrorNotification";

function AccountInfo({ handleSetPage, changeAvatar }) {
    const [ user, setUser ] = useState({});
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);

    useEffect(() => {
        handleSetPage('Thông tin tài khoản');
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}customers/profile`, authorization(localStorage.getItem('token')))
            .then(res => setUser(res.data))
            .catch(err => console.log(err))
    }, [])

    const formatTime = (time) => {
        const createdDate = new Date(time);
        createdDate.setHours(createdDate.getHours() - 7);
        
        let date = createdDate.getDate();
        if(date < 10){
            date = `0${date}`;
        }

        let month = createdDate.getMonth() + 1;
        if(month < 10){
            month = `0${month}`;
        }

        const year = createdDate.getFullYear();

        return `${date}-${month}-${year}`;
    }

    const handleChangeAvatar = (e) => {
        const uploadData = new FormData();

        uploadData.append("file", e.target.files[0]);
        
        axios.put(`${apiURL}customers/update-my-avatar`, uploadData, authorization(localStorage.getItem('token')))
            .then(res => {
                console.log(res.data);

                setShowSuccessNotification(true);

                document.getElementById('image').value = '';

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
                <div className='w-[50%] text-gray-700 font-medium'>Tên liên hệ:</div>
                <div className="w-[50%]">{user.name}</div>
            </div>
            <div className='flex py-2 border-b-[1px] border-gray-200'>
                <div className='w-[50%] text-gray-700 font-medium'>Giới tính:</div>
                <div className="w-[50%]">{user.gender}</div>
            </div>
            <div className='flex py-2 border-b-[1px] border-gray-200'>
                <div className='w-[50%] text-gray-700 font-medium'>Email:</div>
                <div className="w-[50%]">{user.email}</div>
            </div>
            <div className='flex py-2 border-b-[1px] border-gray-200'>
                <div className='w-[50%] text-gray-700 font-medium'>Ngày tham gia:</div>
                <div className="w-[50%]">{formatTime(user.createdAt)}</div>
            </div>
            <div className='flex py-2 border-b-[1px] border-gray-200'>
                <div className='w-[50%] text-gray-700 font-medium'>Địa chỉ:</div>
                <div className="w-[50%]">{user.address}</div>
            </div>
            <div className='flex py-2 border-b-[1px] border-gray-200'>
                <div className='w-[50%] text-gray-700 font-medium'>Điện thoại:</div>
                <div className="w-[50%]">{user.phone}</div>
            </div>
            <div className="py-4 border-b-[1px] border-gray-200">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
                    Ảnh đại diện
                </label>
                <input className="form-control
                w-[100%]
                block
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-auto
                focus:text-gray-700 focus:bg-white focus:outline-none" onChange={handleChangeAvatar} id="image" type="file" />
            </div>
            <div className="mt-4 text-right cursor-pointer text-red-500 font-medium">Xóa tài khoản</div>
        </div>
    );
}

export default AccountInfo;