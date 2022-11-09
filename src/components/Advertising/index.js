import { Link } from "react-router-dom";
import styles from './Advertising.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa';

function Advertising({ image, title, idCity, time, cities }) {

    const formatTime = (time) => {
        const date = new Date(time);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <li className={styles.item}>
            <Link to={`/chi-tiet/${title}`} className="flex hover:shadow-[0_1px_7px_0_rgb(0,0,0,0.3)]">
                <div className={styles.image}>
                    <img className="w-full h-full object-contain" src={image} alt="" />
                </div>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <h3 className="text-teal-700">{title}</h3>
                    </div>
                    <div className={styles.city}>
                        {cities.map(city => {
                            if(city._id === idCity){
                                return <h5 key={city._id} className="text-xs text-gray-500"><FaMapMarkerAlt className="inline mr-1"/>{city.cityName}</h5>
                            }else return null;
                        })}
                    </div>
                    <div className={styles.time}>
                        <h5 className="text-xs text-gray-500"><FaRegClock className="inline mr-1"/>{formatTime(time)}</h5>
                    </div>
                </div>
            </Link>
        </li>
    )
}

export default Advertising;