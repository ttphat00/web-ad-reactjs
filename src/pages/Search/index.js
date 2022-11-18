import AdvertisingList from '../../components/AdvertisingList';
import { useParams } from 'react-router-dom';
import styles from './Search.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '../../config';

function Search() {
    let { keyWord } = useParams();
    const [ cities, setCities ] = useState([]);

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
            <div className={styles.title}>
                <h2 className='font-medium'>Từ khóa tìm kiếm: "{keyWord}"</h2>
            </div>
            <div className={styles.advertising}>
                <AdvertisingList cities={cities} keyWord={keyWord} />
            </div>
        </>
    )
}

export default Search;