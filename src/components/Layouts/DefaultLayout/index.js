import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from './DefaultLayout.module.css'; 
import { FaArrowUp } from 'react-icons/fa';
import { useEffect, useState } from "react";
import clsx from "clsx";

function DefaultLayout({ children }) {
    const [show, setShow] = useState(true);

    const handleScroll = () => {
        if(window.scrollY > 600){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    return (  
        <>
            <Header />
            <div className={styles.container}>
                {children}
            </div>
            <Footer />
            <button 
            onClick={handleScrollToTop}
            className={clsx('bg-teal-500 hover:bg-teal-700 text-white font-bold py-3 px-3 rounded-full fixed bottom-3 right-3',{
                'hidden': show
            })}
            >
                <FaArrowUp />
            </button>
        </>
    );
}

export default DefaultLayout;