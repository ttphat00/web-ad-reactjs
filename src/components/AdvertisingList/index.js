import { useState, useEffect} from 'react';
import styles from './AdvertisingList.module.css';
import Advertising from '../Advertising';
import axios from 'axios';
import { apiURL } from '../../config';
import ReactPaginate from 'react-paginate';

function AdvertisingList({ cities, keyWord, idCategory, idAd, idCity, status, itemsPerPage }) {
    const [ newAds, setNewAds] = useState([]);
    const [ oldAds, setOldAds] = useState([]);
    const [ ads, setAds] = useState([]);

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
  
    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = ads.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(ads.length / itemsPerPage);
  
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % ads.length;
        // console.log(
        //     `User requested page number ${event.selected}, which is offset ${newOffset}`
        // );
        setItemOffset(newOffset);
    };

    useEffect(() => {
        axios.get(`${apiURL}ads`)
            .then(res => {
                setOldAds(res.data);
                const arr = [...res.data].reverse();
                setNewAds(arr);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const arr = [];
        
        if(!idCategory && !keyWord){
            newAds.map(ad => {
                if(ad.display){
                    arr.push(ad);
                }
            });
        }else if(!idCategory && keyWord){
            newAds.map(ad => {
                if(ad.display && ad.title.toLowerCase().includes(keyWord.toLowerCase())){
                    arr.push(ad);
                }
            });
        }else if(idCategory && idAd){
            newAds.map(ad => {
                if(ad.display && ad.idCategory === idCategory && ad._id !== idAd){
                    arr.push(ad);
                }
            });
        }else if(idCategory && idCity && status==='Tin mới nhất'){
            newAds.map(ad => {
                if(ad.display && ad.idCategory === idCategory && ad.idCity === idCity){
                    arr.push(ad);
                }
            });
        }else if(idCategory && idCity && status==='Tin cũ nhất'){
            oldAds.map(ad => {
                if(ad.display && ad.idCategory === idCategory && ad.idCity === idCity){
                    arr.push(ad);
                }
            });
        }else if(idCategory && !idCity && status==='Tin mới nhất'){
            newAds.map(ad => {
                if(ad.display && ad.idCategory === idCategory){
                    arr.push(ad);
                }
            });
        }else if(idCategory && !idCity && status==='Tin cũ nhất'){
            oldAds.map(ad => {
                if(ad.display && ad.idCategory === idCategory){
                    arr.push(ad);
                }
            });
        }

        setAds(arr);
    }, [newAds, oldAds, idCity, status])

    return ( 
        <div className={styles.list}>
            <ul className='flex flex-wrap'>

                {/* {!idCategory && !keyWord && newAds.map(ad => {
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
                })} */}

                {
                    currentItems && currentItems.map(ad => {
                        return <Advertising key={ad._id} id={ad._id} image={ad.images[0].url} title={ad.title} idCity={ad.idCity} time={ad.createdAt} cities={cities}/>
                    })
                }

            </ul>
            <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                renderOnZeroPageCount={null}
                containerClassName="flex justify-center mt-5"
                breakLabel="..."
                breakClassName="bg-white border-[1px] hover:bg-gray-100 text-teal-700"
                breakLinkClassName="px-2"
                pageClassName="bg-white border-[1px] hover:bg-gray-100 text-teal-700"
                pageLinkClassName="px-2"
                previousClassName="bg-white border-[1px] hover:bg-gray-100 text-teal-700"
                previousLinkClassName="px-2"
                nextClassName="bg-white border-[1px] hover:bg-gray-100 text-teal-700"
                nextLinkClassName="px-2"
                activeClassName="bg-teal-500 text-white border-teal-500 hover:bg-teal-500"
                activeLinkClassName=""
                disabledClassName="text-gray-400 hover:bg-white"
                disabledLinkClassName="cursor-default"
            />      
        </div>
    );
}

export default AdvertisingList;