import { useState, useEffect} from 'react';
import styles from './AdvertisingList.module.css';
import Advertising from '../Advertising';
import axios from 'axios';
import { apiURL } from '../../config';

function AdvertisingList({ cities, keyWord, idCategory, idAd, idCity, status }) {
    const [ newAds, setNewAds] = useState([]);
    const [ oldAds, setOldAds] = useState([]);

    useEffect(() => {
        axios.get(`${apiURL}ads`)
            .then(res => {
                setOldAds(res.data);
                const arr = [...res.data].reverse();
                setNewAds(arr);
            })
            .catch(err => console.log(err))
    }, [])

    return ( 
        <div className={styles.list}>
            <ul className='flex flex-wrap'>

                {!idCategory && !keyWord && newAds.map(ad => {
                    return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                })
                }

                {!idCategory && keyWord && newAds.map(ad => {
                    if(ad.title.toLowerCase().includes(keyWord.toLowerCase())){
                        return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                    }else return null;
                })
                }

                {idCategory && idAd && newAds.map(ad => {
                    if(ad.idCategory === idCategory && ad._id !== idAd){
                        return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                    }else return null;
                })}

                {idCategory && idCity && status==='Tin mới nhất' && newAds.map(ad => {
                    if(ad.idCategory === idCategory && ad.idCity === idCity){
                        return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                    }else return null;
                })}

                {idCategory && idCity && status==='Tin cũ nhất' && oldAds.map(ad => {
                    if(ad.idCategory === idCategory && ad.idCity === idCity){
                        return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                    }else return null;
                })}

                {idCategory && !idCity && status==='Tin mới nhất' && newAds.map(ad => {
                    if(ad.idCategory === idCategory){
                        return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                    }else return null;
                })}

                {idCategory && !idCity && status==='Tin cũ nhất' && oldAds.map(ad => {
                    if(ad.idCategory === idCategory){
                        return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                    }else return null;
                })}

                {/* {!idCategory 
                ?
                newAds.map(ad => {
                    return ad.display && <Advertising key={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                })
                :
                newAds.map(ad => {
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
                } */}

            </ul>
        </div>
    );
}

export default AdvertisingList;