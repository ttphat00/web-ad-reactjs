import Footer from "../components/Footer";
import AdminHeader from "../components/AdminHeader";
import styles from './OtherLayout.module.css'; 

function OtherLayout({ children }) {

    return (  
        <>
            <AdminHeader />
            <div className={styles.container}>
                {children}
            </div>
            <Footer />
        </>
    );
}

export default OtherLayout;