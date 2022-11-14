import { useEffect, useState } from 'react';
// import styles from './DetailPreview.module.css';
import axios from 'axios';
import { apiURL } from '../../config';
import { useParams } from 'react-router-dom';

function DetailPreview() {
    let { title } = useParams();
    const [ city, setCity ] = useState({});
    const [ ad, setAd ] = useState({});
    const [ category, setCategory ] = useState({});

    useEffect(() => {
        axios.get(`${apiURL}ads/title/${title}`)
            .then(res => {
                // console.log(res.data);
                setAd(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if(ad.idCategory){
            axios.get(`${apiURL}categories/${ad.idCategory}`)
                .then(res => {
                    // console.log(res.data);
                    setCategory(res.data);
                })
                .catch(err => console.log(err))
        }
    }, [ad])

    useEffect(() => {
        if(ad.idCity){
            axios.get(`${apiURL}cities/${ad.idCity}`)
                .then(res => {
                    // console.log(res.data);
                    setCity(res.data);
                })
                .catch(err => console.log(err))
        }
    }, [ad])

    useEffect(() => {
        document.getElementById('content').innerHTML = ad.content;
    }, [ad])

    return (
        <>
            <div className='mt-[30px] w-[80%] m-auto'>
                <div className='border-b-[3px] border-teal-500'>
                    <h2 className='text-xl font-medium'>XEM TRƯỚC TIN</h2>
                </div>
                <div className='px-6 py-8 bg-white'>
                    <div className='flex px-10 mb-5'>
                        <div className='font-bold w-[15%]'>Danh mục:</div>
                        <div className='w-[85%]'>{category.title}</div>
                    </div>
                    <div className='flex px-10 mb-5'>
                        <div className='font-bold w-[15%]'>Tiêu đề:</div>
                        <div className='w-[85%]'>{ad.title}</div>
                    </div>
                    <div className='flex px-10 mb-5'>
                        <div className='font-bold w-[15%]'>Giá:</div>
                        <div className='w-[85%]'>{parseInt(ad.price) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(ad.price)) : ad.price}</div>
                    </div>
                    <div className='flex px-10 mb-5'>
                        <div className='font-bold w-[15%]'>Địa chỉ:</div>
                        <div className='w-[85%]'>{city.cityName}</div>
                    </div>
                    <div className='flex px-10 mb-5'>
                        <div className='font-bold w-[15%]'>Nội dung:</div>
                        <div id='content' className='w-[85%]'></div>
                    </div>
                    <div className='px-10 mb-5'>
                        <div className='font-bold w-[15%]'>Hình ảnh:</div>
                        <div className='flex mt-3 flex-wrap'>
                            {ad.images && ad.images.map(image => {
                                return <img key={image._id} className='w-[100px] h-[100px] object-contain mr-4 mb-4' src={image.url} alt='' />
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailPreview;