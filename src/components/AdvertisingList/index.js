import { useState, useEffect} from 'react';
import styles from './AdvertisingList.module.css';
import Advertising from '../Advertising';
import axios from 'axios';
import { apiURL } from '../../config';

function AdvertisingList({ cities, idCategory, idAd, idCity }) {
    const [ ads, setAds] = useState([]);

    useEffect(() => {
        axios.get(`${apiURL}ads`)
            .then(res => {
                setAds(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    return ( 
        <div className={styles.list}>
            <ul className='flex flex-wrap'>
                {!idCategory 
                ?
                ads.map(ad => {
                    return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                })
                :
                ads.map(ad => {
                    if(ad.idCategory === idCategory){
                        if(idAd){
                            if(ad._id !== idAd){
                                return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                            }else return null;
                        }else if(idCity){
                            if(ad.idCity === idCity){
                                return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                            }else return null;
                        }else return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                    }else return null;
                })
                }
            </ul>
        </div>
    );
}

export default AdvertisingList;