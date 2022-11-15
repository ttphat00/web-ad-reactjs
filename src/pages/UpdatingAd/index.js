import { useEffect, useState } from 'react';
// import styles from './UpdatingAd.module.css';
import { FaExclamationTriangle } from "react-icons/fa";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { apiURL } from '../../config';
import ErrorNotification from '../../components/Notification/ErrorNotification';
import { useNavigate, useParams } from 'react-router-dom';

function UpdatingAd() {
    let { idAd } = useParams();
    let navigate = useNavigate();

    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [ idOrder, setIdOrder ] = useState('');
    const [ orders, setOrders ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const [ cities, setCities ] = useState([]);
    const [ price, setPrice ] = useState('');
    const [ otherPrice, setOtherPrice ] = useState('');
    const [ category, setCategory ] = useState('');
    const [ city, setCity ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');
    const [images, setImages] = useState([]);
    const [urlFile, setUrlFile] = useState([]);

    useEffect(() => {
        axios.get(`${apiURL}ads/${idAd}`)
            .then(res => {
                // console.log(res.data);
                setCategory(res.data.idCategory);
                setCity(res.data.idCity);
                setTitle(res.data.title);
                setContent(res.data.content);
                setUrlFile(res.data.images);
                if(parseInt(res.data.price)){
                    setPrice(res.data.price);
                }else setOtherPrice(res.data.price);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}orders`)
            .then(res => {
                // console.log(res.data);
                setOrders(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        orders.map(order => {
            if(order.adDetails[0].idAd === idAd){
                setIdOrder(order._id);
            }
        });
    }, [orders])

    useEffect(() => {
        axios.get(`${apiURL}categories`)
            .then(res => {
                // console.log(res.data);
                setCategories(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}cities`)
            .then(res => {
                // console.log(res.data);
                setCities(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        return () => {
            urlFile && urlFile.map(url => {
                URL.revokeObjectURL(url.url);
            })
        }
    }, [urlFile])

    const handleImages = (e) => {
        setImages(e.target.files);
        const urlArray = [];
        for(let i=0; i<e.target.files.length; i++){
            const obj = {
                url: URL.createObjectURL(e.target.files[i])
            };
            urlArray.push(obj);
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

    const handleReturn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/user/quan-ly-tin');
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            
            const uploadData = new FormData();

            for(let i=0; i<images.length; i++){
                uploadData.append("file", images[i]);
            }
            uploadData.append("title", title);
            uploadData.append("content", content);
            uploadData.append("idCity", city);
            uploadData.append("idCategory", category);
            uploadData.append("price", price || otherPrice);

            axios.put(`${apiURL}ads/${idAd}`, uploadData)
                .then(res => {
                    console.log('Cap nhat tin');
                    return axios.put(`${apiURL}orders/${idOrder}`, {
                        status: 'Đang chờ xác nhận',
                    })
                })
                .then(res => {
                    console.log('Dang cho duyet');
                    navigate('/user/quan-ly-tin');
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
        <>
            {showErrorNotification && <ErrorNotification />}
            <div className='mt-[30px] w-[90%] m-auto'>
                <div className='border-b-[3px] border-teal-500'>
                    <h2 className='text-xl font-medium'>SỬA TIN</h2>
                </div>
                <div>
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
                                onChange={handleChangeCategory}
                                value={category}>
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
                                onChange={handleChangeCity}
                                value={city}>
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
                            focus:text-gray-700 focus:bg-white focus:outline-none" onChange={handleImages} id="image" type="file" multiple />
                            <div className='flex'>
                                {
                                    urlFile && urlFile.map(url => {
                                        return(
                                            <img key={url.url} className='w-[100px] h-[100px] object-contain mt-2 mr-4' src={url.url} alt='' />
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className="mb-6 bg-[#fff3cd] text-[#856404] font-medium px-4 py-3 text-sm">
                            <FaExclamationTriangle className='inline pb-[4px] box-content mr-1' />
                            Khi bạn chỉnh sửa tin, nội dung chỉnh sửa của bạn sẽ được xét duyệt.
                        </div>
                        <div className="flex items-center justify-center">
                            <button onClick={handleReturn} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline mr-1" type="button">
                                Quay lại
                            </button>
                            <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline ml-1" type="submit">
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdatingAd;