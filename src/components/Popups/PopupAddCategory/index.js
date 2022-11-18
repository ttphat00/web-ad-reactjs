import styles from './PopupAddCategory.module.css';
import { FaWindowClose } from "react-icons/fa";
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { apiURL } from '../../../config';
import ErrorNotification from '../../Notification/ErrorNotification';

function PopupAddCategory({ handleShowPopupAddCategory, handleShowSuccessNotification }) {
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [ title, setTitle ] = useState('');
    const [image, setImage] = useState('');
    const [urlFile, setUrlFile] = useState('');

    useEffect(() => {
        return () => {
            urlFile && URL.revokeObjectURL(urlFile);
        }
    }, [urlFile])

    const handleImages = (e) => {
        setImage(e.target.files[0]);
        setUrlFile(URL.createObjectURL(e.target.files[0]));
    }

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            
            const uploadData = new FormData();

            uploadData.append("file", image);
            uploadData.append("title", title);

            axios.post(`${apiURL}categories`, uploadData)
                .then(res => {
                    console.log(res.data);
                    
                    handleShowPopupAddCategory(false);
                    
                    handleShowSuccessNotification(true);

                    setTimeout(() => {
                        handleShowSuccessNotification(false);
                    }, 5000);
                })
                .catch(err => {
                    console.log(err);

                    setShowErrorNotification(true);

                    setTimeout(() => {
                        setShowErrorNotification(false);
                    }, 5000);
                });
        }
    };

    return ( 
        <div onClick={() => handleShowPopupAddCategory(false)} className={styles.wrapper}>
            {showErrorNotification && <ErrorNotification />}
            <div onClick={(e) => e.stopPropagation()} className={styles.inner}>
                <div 
                onClick={() => handleShowPopupAddCategory(false)}
                className='absolute top-[-15px] right-[-10px] cursor-pointer'
                >
                    <FaWindowClose className='text-white text-xl rounded-full' />
                </div>
                <div className={styles.title}>
                    <div 
                    className={clsx(styles.signin)}>
                        THÊM DANH MỤC
                    </div>
                </div>
                <div className='text-sm'>
                    <form onSubmit={handleSubmit} className="bg-white px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Tên danh mục
                            </label>
                            <input onChange={handleChangeTitle} value={title} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                Hình ảnh
                            </label>
                            <input className="form-control
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
                            m-0
                            focus:text-gray-700 focus:bg-white focus:outline-none" onChange={handleImages} id="image" type="file" required />
                            <div className='flex'>
                                {
                                    urlFile && <img className='w-[100px] h-[100px] object-contain mt-2' src={urlFile} alt='' />
                                }
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline m-auto" type="submit">
                                Thêm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PopupAddCategory;