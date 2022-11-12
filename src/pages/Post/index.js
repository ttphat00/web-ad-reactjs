import { useEffect, useState } from 'react';
import styles from './Post.module.css';
import { FaRegEdit } from "react-icons/fa";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { apiURL, authorization } from '../../config';
import ErrorNotification from '../../components/Notification/ErrorNotification';
import { Link, useNavigate } from 'react-router-dom';

function Post() {
    let navigate = useNavigate();
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [ user, setUser ] = useState({});
    const [ categories, setCategories ] = useState([]);
    const [ cities, setCities ] = useState([]);
    const [ durations, setDurations ] = useState(() => {
        const arr = [];
        for(let i=1; i<=90; i++){
            arr.push(i);
        }
        return arr;
    });
    const [ price, setPrice ] = useState('');
    const [ otherPrice, setOtherPrice ] = useState('');
    const [ category, setCategory ] = useState('');
    const [ city, setCity ] = useState('');
    const [ duration, setDuration ] = useState(1);
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');
    const [images, setImages] = useState([]);
    const [urlFile, setUrlFile] = useState([]);

    useEffect(() => {
        axios.get(`${apiURL}customers/profile`, authorization(localStorage.getItem('token')))
            .then(res => {
                // console.log(res.data);
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}categories`)
            .then(res => {
                // console.log(res.data);
                setCategories(res.data);
                setCategory(res.data[0]._id);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}cities`)
            .then(res => {
                // console.log(res.data);
                setCities(res.data);
                setCity(res.data[0]._id);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        return () => {
            urlFile && urlFile.map(url => {
                URL.revokeObjectURL(url);
            })
        }
    }, [urlFile])

    const handleImages = (e) => {
        setImages(e.target.files);
        const urlArray = [];
        for(let i=0; i<e.target.files.length; i++){
            urlArray.push(URL.createObjectURL(e.target.files[i]));
        }
        setUrlFile(urlArray);
    }

    // const isNumberKey = (e) => {
    //     if (!/[0-9]/.test(e.key)) {
    //         e.preventDefault();
    //     }
    // }

    const handleChangePrice = (e) => {
        setPrice(parseInt(e.target.value) ? parseInt(e.target.value) : '');
        setOtherPrice('');
    }

    const handleChangeOtherPrice = (e) => {
        setOtherPrice(e.target.value);
        setPrice('');
    }

    const handleChangeCategory = (e) => {
        setCategory(e.target.value);
    }

    const handleChangeCity = (e) => {
        setCity(e.target.value);
    }

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleChangeDuration = (e) => {
        setDuration(e.target.value);
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            const today = new Date();
            const expireDate = new Date();
            
            today.setHours(today.getHours() + 7);
            expireDate.setDate(today.getDate() + parseInt(duration));
            expireDate.setHours(expireDate.getHours() + 7);
            
            const uploadData = new FormData();

            for(let i=0; i<images.length; i++){
                uploadData.append("file", images[i]);
            }
            uploadData.append("title", title);
            uploadData.append("content", content);
            uploadData.append("idCity", city);
            uploadData.append("idCategory", category);
            uploadData.append("expireDate", expireDate);
            uploadData.append("price", price || otherPrice);
            uploadData.append("createdAt", today);
            uploadData.append("duration", parseInt(duration));

            // if((parseInt(user.accountBalance) - parseInt(duration)*10000) >= 0){
                // axios.put(`${apiURL}customers/update-my-info`, {
                //     accountBalance: (parseInt(user.accountBalance) - parseInt(duration)*10000)
                // }, authorization(localStorage.getItem('token')))
                //     .then(res => {
                //         console.log("Tru tien");
                //         return axios.post(`${apiURL}ads`, uploadData, authorization(localStorage.getItem('token')))
                //     })
                    axios.post(`${apiURL}ads`, uploadData, authorization(localStorage.getItem('token')))
                    .then(res => {
                        console.log('Luu vao bang Ads');
                        return axios.post(`${apiURL}orders`, {
                            totalCost: parseInt(duration)*10000,
                            idAd: res.data._id,
                            cost: parseInt(duration)*10000,
                            orderDate: today,
                        }, authorization(localStorage.getItem('token')))
                    })
                    .then(res => {
                        console.log('Luu vao bang Orders');
                        navigate(`/thanh-toan/${res.data._id}`);
                    })
                    .catch(err => {
                        console.log(err);
    
                        setShowErrorNotification(true);
    
                        setTimeout(() => {
                            setShowErrorNotification(false);
                        }, 5000);
                    });
            // }else{
            //     window.alert('Số dư tài khoản của bạn không đủ để thực hiện giao dịch này!');
            // }
        }
    };

    return (
        <>
            {showErrorNotification && <ErrorNotification />}
            <div className='mt-[30px] w-[90%] m-auto'>
                <div className='border-b-[3px] border-teal-500'>
                    <h2 className='text-xl font-medium'>ĐĂNG TIN</h2>
                </div>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit} className="bg-white px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                Chọn danh mục
                            </label>
                            <div className="mb-3 w-[33%]">
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
                                onChange={handleChangeCategory}>
                                    {categories.map(category => {
                                        return <option key={category._id} value={category._id}>{category.title}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Tiêu đề
                            </label>
                            <input onChange={handleChangeTitle} value={title} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" minLength='10' maxLength='100' required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                Giá
                            </label>
                            <div className='flex'>
                                <input className="appearance-none border rounded w-[30%] py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="price" type="text" onChange={handleChangePrice} value={price} required={price==='' && otherPrice===''} />
                                <div className='h-max mt-2 text-sm ml-2 text-gray-500'>VNĐ</div>
                                <div className="flex justify-center h-max mt-1 ml-6">
                                    <div className="form-check form-check-inline">
                                        <input onChange={handleChangeOtherPrice} className="form-check-input form-check-input h-4 w-4 border border-gray-300 mt-1 align-top mr-2 cursor-pointer" type="radio" name="type-of-price" id="type-of-price1" value="Thương lượng" checked={otherPrice==='Thương lượng'} />
                                        <label className="text-sm form-check-label inline-block text-gray-800" htmlFor="type-of-price1">Giá "Thương lượng"</label>
                                    </div>
                                    <div className="form-check form-check-inline ml-5">
                                        <input onChange={handleChangeOtherPrice} className="form-check-input form-check-input rounded-full h-4 w-4 border border-gray-300 transition duration-200 mt-1 align-top mr-2 cursor-pointer" type="radio" name="type-of-price" id="type-of-price2" value="Cho tặng miễn phí" checked={otherPrice==='Cho tặng miễn phí'} />
                                        <label className="text-sm form-check-label inline-block text-gray-800" htmlFor="type-of-price2">Cho tặng miễn phí</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                                Chọn tỉnh thành
                            </label>
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
                                onChange={handleChangeCity}>
                                    {cities.map(city => {
                                        return <option key={city._id} value={city._id}>{city.cityName}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                Nội dung chi tiết
                            </label>
                            <CKEditor
                                editor={ ClassicEditor }
                                data={content}
                                onChange={ ( event, editor ) => {
                                    setContent(editor.getData());
                                    // console.log( { event, editor, data } );
                                } }
                            />
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
                            focus:text-gray-700 focus:bg-white focus:outline-none" onChange={handleImages} id="image" type="file" multiple required />
                            <div className='flex'>
                                {
                                    urlFile && urlFile.map(url => {
                                        return(
                                            <img key={url} className='w-[100px] h-[100px] object-contain mt-2 mr-4' src={url} alt='' />
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                                Thời hạn
                                <span className='font-normal italic'> (10.000 VNĐ/ngày)</span>
                            </label>
                            <div className='flex'>
                                <div className="mb-3 w-[15%]">
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
                        <div className="flex justify-between bg-[#FFF7F4] px-4 py-2">
                            <div className='font-bold flex items-center'>Tổng thanh toán:</div>
                            <div className='font-bold text-lg text-teal-500'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(duration*10000)}</div>
                        </div>
                        <div className="mb-6 bg-[#FFF7F4] px-4 py-2 text-sm">Khi bấm Đăng tin, bạn đã đồng ý với <Link to='' className='underline hover:text-teal-700'>quy định</Link> của chúng tôi.</div>
                        <div className="flex items-center justify-between">
                            <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline m-auto" type="submit">
                                <FaRegEdit className='inline mr-1'/>
                                Đăng tin
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Post;