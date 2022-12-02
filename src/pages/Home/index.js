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
                    <h2 className='text-xl max-[390px]:text-4xl'>DANH MỤC</h2>
                </div>
                <div className={styles.list}>
                    <ul className='flex flex-wrap'>
                        {categories.map((category) => {
                            return (
                                <li key={category._id} className={styles.item}>
                                    <Link to={`/danh-muc/${category.title}`} className='max-[390px]:text-4xl flex items-center flex-col font-medium text-teal-700 hover:translate-y-px hover:shadow-[0_1px_7px_0_rgb(0,0,0,0.3)]'>
                                        <img src={category.image} alt='' className='mb-2 w-[50px] h-[50px] max-[390px]:w-[100px] max-[390px]:h-[100px] object-contain' />
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
                    <h2 className='text-xl max-[390px]:text-4xl'>TIN MỚI</h2>
                </div>
                <AdvertisingList cities={cities} itemsPerPage={9} />
            </div>
        </>
    )
}

export default Home;