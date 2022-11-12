import AdvertisingList from '../../components/AdvertisingList';
import { Link, useParams } from 'react-router-dom';
import styles from './Detail.module.css';
import { FaRegHeart } from 'react-icons/fa';
import { FaPhoneVolume } from 'react-icons/fa';
import { useEffect } from 'react';
import axios from 'axios';
import { apiURL } from '../../config';
import { useState } from 'react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function Detail() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    let { title } = useParams();
    const [ showPhone, setShowPhone ] = useState(false);
    const [ ad, setAd ] = useState({});
    const [ categories, setCategories] = useState([]);
    const [ city, setCity] = useState({});
    const [ cities, setCities] = useState([]);
    const [ host, setHost] = useState({});

    useEffect(() => {
        axios.get(`${apiURL}ads/title/${title}`)
            .then(res => {
                setAd(res.data);
            })
            .catch(err => console.log(err))
    }, [title])

    useEffect(() => {
        axios.get(`${apiURL}categories`)
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if(ad.idCity){
            axios.get(`${apiURL}cities/${ad.idCity}`)
                .then(res => {
                    setCity(res.data);
                })
                .catch(err => console.log(err))
        }
    }, [ad])

    useEffect(() => {
        axios.get(`${apiURL}cities`)
            .then(res => {
                // console.log(res.data);
                setCities(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if(ad.idCustomer){
            axios.get(`${apiURL}customers/${ad.idCustomer}`)
                .then(res => {
                    setHost(res.data);
                })
                .catch(err => console.log(err))
        }
    }, [ad])

    useEffect(() => {
        if(ad.content){
            document.getElementById('content').innerHTML = ad.content;
        }
    }, [ad])

    const formatTime = (time) => {
        const createdDate = new Date(time);
        createdDate.setHours(createdDate.getHours() - 7);
        const date = createdDate.getDate();
        const month = createdDate.getMonth() + 1;
        const year = createdDate.getFullYear();
        const hour = createdDate.getHours();
        const minute = createdDate.getMinutes();
        return `${date}/${month}/${year} - ${hour}:${minute}`;
    }

    return (
        <>
            <div className={styles.category}>
                <h2 className='text-sm'><Link to='/' className='text-teal-500 hover:text-teal-700'>Trang chủ</Link> / {
                    categories.map(category => {
                        if(category._id === ad.idCategory){
                            return <Link key={category._id} to={`/danh-muc/${category.title}`} className='text-teal-500 hover:text-teal-700'>{category.title}</Link>
                        }else return null;
                    })
                } / {title}</h2>
            </div>
            <div className={styles.content}>
                <div className={styles.detail}>
                    <div className={styles.slider}>
                        {/* <img className='w-full h-full object-contain' src='https://s3.cloud.cmctelecom.vn/tinhte2/2020/11/5209549_image.jpg' alt='' /> */}
                        <Slider {...settings}>
                            {ad.images && ad.images.map(image => {
                                return <div key={image._id}>
                                    <img className={styles.image} src={image.url} alt='' />
                                </div>
                            })}
                        </Slider>
                    </div>
                    <div className='relative'>
                        <div className={styles.save}>Lưu tin <FaRegHeart className='inline relative bottom-[1px]'/></div>
                    </div>
                    <div className={styles.title}>{ad.title}</div>
                    <div className={styles.time}>{formatTime(ad.createdAt)}</div>
                    <div className={styles.price}><span className='text-black'>Giá:</span> {parseInt(ad.price) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(ad.price)) : ad.price}</div>
                    <div className={styles.address}><span className='font-bold'>Địa chỉ:</span> {city.cityName}</div>
                    <div id='content' className={styles.description}></div>
                </div>
                <div className={styles.contact}>
                    <div className={styles.host}>
                        <img className={styles.avatar} src={host.avatar} alt=''/>
                        <div className={styles.name}><span className='text-xs text-gray-700 font-normal'>Đăng bởi</span> {host.name}</div>
                    </div>
                    <div onClick={() => setShowPhone(true)} className={styles.phone}>
                        <div className='h-max px-2'><FaPhoneVolume className='inline text-xl mr-1' /> {showPhone ? host.phone : (host.phone && `${host.phone.slice(0, 6)}****`)}</div>
                        <div className='h-max px-2 text-sm'>{showPhone ? '' : 'Hiện số'}</div>
                    </div>
                    <div className={styles.email}>
                        <div className='px-2 text-sm'><span className='font-medium'>Email liên hệ:</span> <span className='italic font-bold'>{host.email}</span></div>
                    </div>
                </div>
            </div>
            <div className={styles.related}>
                <h3 className='text-lg font-bold'>Tin đăng cùng danh mục</h3>
                {ad.idCategory && ad._id && <AdvertisingList cities={cities} idCategory={ad.idCategory} idAd={ad._id} />}
            </div>
        </>
    )
}

export default Detail;