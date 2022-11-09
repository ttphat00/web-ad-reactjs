import AdvertisingList from '../../components/AdvertisingList';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '../../config';

function Home() {
    const [ categories, setCategories ] = useState([]);
    const [ cities, setCities ] = useState([]);

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

    return (
        <>
            <div className={styles.category}>
                <div className={styles.title}>
                    <h2 className='text-2xl'>Danh mục</h2>
                </div>
                <div className={styles.list}>
                    <ul className='flex flex-wrap'>
                        {categories.map((category) => {
                            return (
                                <li key={category._id} className={styles.item}>
                                    <Link to={`/danh-muc/${category.title}`} className='flex items-center flex-col text-teal-700 hover:text-teal-500 hover:translate-y-px'>
                                        <img src={category.image} alt='' className='mb-2 w-[50px] h-[50px] object-contain' />
                                        {category.title}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <div className={styles.advertising}>
                <div className={styles.title}>
                    <h2 className='text-2xl'>Tin mới</h2>
                </div>
                <AdvertisingList cities={cities} />
            </div>
        </>
    )
}

export default Home;