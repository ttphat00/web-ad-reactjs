import Footer from "../components/Footer";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import styles from './DashboardLayout.module.css'; 
import { FaArrowUp } from 'react-icons/fa';
import { useEffect, useState } from "react";
import clsx from "clsx";

function DashboardLayout({ changeAvatar, page, children }) {
    const [show, setShow] = useState(true);
    const [user, setUser] = useState({});

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
            <Header changeAvatar={changeAvatar} handleSetUser={setUser}/>
            <div className={styles.container}>
                <Dashboard page={page} user={user}/>
                <div className={styles.content}>
                    <div className={styles.title}>{page}</div>
                    {children}
                </div>
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

export default DashboardLayout;