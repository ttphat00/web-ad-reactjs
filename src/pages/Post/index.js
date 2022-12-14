import { useEffect, useState } from 'react';
import styles from './Post.module.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { apiURL, authorization } from '../../config';
import ErrorNotification from '../../components/Notification/ErrorNotification';
import { Link, useNavigate } from 'react-router-dom';
import PaypalCheckoutButton from '../../components/PaypalCheckoutButton';
import clsx from 'clsx';

function Post() {
    let navigate = useNavigate();
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [showPaypalButton, setShowPaypalButton] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
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
        setShowPaypalButton(false);
        setDisabledButton(false);
    }

    // const isNumberKey = (e) => {
    //     if (!/[0-9]/.test(e.key)) {
    //         e.preventDefault();
    //     }
    // }

    const handleChangePrice = (e) => {
        setPrice(parseInt(e.target.value) ? parseInt(e.target.value) : '');
        setOtherPrice('');
        setShowPaypalButton(false);
        setDisabledButton(false);
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
        setShowPaypalButton(false);
        setDisabledButton(false);
    }

    const handleChangeDuration = (e) => {
        setDuration(e.target.value);
        setShowPaypalButton(false);
        setDisabledButton(false);
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            setShowPaypalButton(true);
            setDisabledButton(true);
        }
    };

    const handleApprove = (orderId) => {
        
        const today = new Date();
        const expireDate = new Date();
        
        today.setHours(today.getHours() + 7);
        expireDate.setHours(expireDate.getHours() + 7);
        expireDate.setDate(today.getDate() + parseInt(duration));
        
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

        axios.post(`${apiURL}ads`, uploadData, authorization(localStorage.getItem('token')))
            .then(res => {
                console.log('Luu vao bang Ads');
                return axios.post(`${apiURL}orders`, {
                    totalCost: parseInt(duration),
                    idAd: res.data._id,
                    cost: parseInt(duration),
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
        
    }

    return (
        <>
            {showErrorNotification && <ErrorNotification />}
            <div className='mt-[30px] w-[90%] m-auto'>
                <div className='border-b-[3px] border-teal-500'>
                    <h2 className='text-xl font-medium'>????NG TIN</h2>
                </div>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit} className="bg-white px-8 pt-6 pb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                Ch???n danh m???c
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
                                Ti??u ?????
                            </label>
                            <input onChange={handleChangeTitle} value={title} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" minLength='10' maxLength='100' required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                Gi??
                            </label>
                            <div className='flex'>
                                <input className="appearance-none border rounded w-[30%] py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="price" type="text" onChange={handleChangePrice} value={price} required={price==='' && otherPrice===''} />
                                <div className='h-max mt-2 text-sm ml-2 text-gray-500'>VN??</div>
                                <div className="flex justify-center h-max mt-1 ml-6">
                                    <div className="form-check form-check-inline">
                                        <input onChange={handleChangeOtherPrice} className="form-check-input form-check-input h-4 w-4 border border-gray-300 mt-1 align-top mr-2 cursor-pointer" type="radio" name="type-of-price" id="type-of-price1" value="Th????ng l?????ng" checked={otherPrice==='Th????ng l?????ng'} />
                                        <label className="text-sm form-check-label inline-block text-gray-800" htmlFor="type-of-price1">Gi?? "Th????ng l?????ng"</label>
                                    </div>
                                    <div className="form-check form-check-inline ml-5">
                                        <input onChange={handleChangeOtherPrice} className="form-check-input form-check-input rounded-full h-4 w-4 border border-gray-300 transition duration-200 mt-1 align-top mr-2 cursor-pointer" type="radio" name="type-of-price" id="type-of-price2" value="Cho t???ng mi???n ph??" checked={otherPrice==='Cho t???ng mi???n ph??'} />
                                        <label className="text-sm form-check-label inline-block text-gray-800" htmlFor="type-of-price2">Cho t???ng mi???n ph??</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                                Ch???n t???nh th??nh
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
                                N???i dung chi ti???t
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
                                H??nh ???nh
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
                                Th???i h???n
                                <span className='font-normal italic'> (1.00 USD/ng??y)</span>
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
                                <div className='h-max mt-2 text-sm ml-2 text-gray-500'>Ng??y</div>
                            </div>
                        </div>
                        <div className="flex justify-between bg-[#FFF7F4] px-4 py-2">
                            <div className='font-bold flex items-center'>T???ng thanh to??n:</div>
                            <div className='font-bold text-lg text-teal-500'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(duration)}</div>
                        </div>
                        <div className="mb-6 bg-[#FFF7F4] px-4 py-2 text-sm">Khi b???m ????ng tin, b???n ???? ?????ng ?? v???i <Link to='' className='underline hover:text-teal-700'>quy ?????nh</Link> c???a ch??ng t??i.</div>
                        <div className="flex items-center justify-between">
                            <button className={clsx("bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline m-auto", {
                                'bg-gray-500': disabledButton,
                                'hover:bg-gray-500': disabledButton,
                            })} disabled={disabledButton} type="submit">
                                ????ng tin
                            </button>
                        </div>
                    </form>
                    {showPaypalButton &&
                    <div className="flex items-center justify-center bg-white pb-6">
                        <span className='text-gray-500 text-sm mr-2'>Thanh to??n v???i</span>
                        <PaypalCheckoutButton title={title} totalCost={parseInt(duration)} handleApprove={handleApprove} />
                    </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Post;