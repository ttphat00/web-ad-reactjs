import AdvertisingList from '../../components/AdvertisingList';
import { Link, useParams } from 'react-router-dom';
import styles from './Category.module.css';
import { FaCaretDown } from "react-icons/fa";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '../../config';
import clsx from 'clsx';

function Category() {
    let { category } = useParams();
    const [ ctg, setCtg ] = useState({});
    const [ cities, setCities ] = useState([]);
    const [ hidden, setHidden ] = useState(true);
    const [ hidden2, setHidden2 ] = useState(true);
    const [ city, setCity ] = useState('');
    const [ idCity, setIdCity ] = useState('');
    const [ status, setStatus ] = useState('Tin mới nhất');

    useEffect(() => {
        axios.get(`${apiURL}cities`)
            .then(res => {
                // console.log(res.data);
                setCities(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}categories/title/${category}`)
            .then(res => {
                // console.log(res.data);
                setCtg(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    const handleSelectedCity = (cityName, idCity) => {
        setCity(cityName);
        setIdCity(idCity);
    }

    const handleSelectedStatus = (status) => {
        setStatus(status);
    }

    return (
        <>
            <div className={styles.title}>
                <h2 className='text-sm'><Link to='/' className='text-teal-500 hover:text-teal-700'>Trang chủ</Link> / {category}</h2>
            </div>
            <div className={styles.filter}>
                <div onClick={() => {setHidden(!hidden)}} className={styles.type}>
                    {city || 'Toàn quốc'}
                    <FaCaretDown className='absolute top-[12px] right-[4px]'/>
                    <div className={clsx('py-1 w-max max-h-72 overflow-y-scroll shadow bg-white absolute top-[41px] right-0 z-50', {
                        'hidden': hidden
                    })}>
                        <ul>
                            <li onClick={() => handleSelectedCity('')} className='px-4 py-1 hover:bg-gray-100'>Toàn quốc</li>
                            {cities.map(city => {
                                return <li onClick={() => handleSelectedCity(city.cityName, city._id)} key={city._id} className='px-4 py-1 hover:bg-gray-100'>{city.cityName}</li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.advertising}>
                <div onClick={() => {setHidden2(!hidden2)}} className={styles.filter2}>
                    {status || 'Tin mới nhất'}
                    <FaCaretDown className='absolute top-[6px] right-0'/>
                    <div className={clsx('py-1 w-max shadow bg-white absolute top-[25px] right-0', {
                        'hidden': hidden2
                    })}>
                        <ul>
                            <li onClick={() => handleSelectedStatus('Tin mới nhất')} className='px-3 py-1 hover:bg-gray-100'>Tin mới nhất</li>
                            <li onClick={() => handleSelectedStatus('Tin cũ nhất')} className='px-3 py-1 hover:bg-gray-100'>Tin cũ nhất</li>
                        </ul>
                    </div>
                </div>
                <AdvertisingList cities={cities} idCategory={ctg._id} idCity={idCity} status={status} />
            </div>
        </>
    )
}

export default Category;