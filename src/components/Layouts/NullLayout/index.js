import styles from './NullLayout.module.css'; 

function NullLayout({ children }) {

    return (  
        <>
            <div className={styles.container}>
                {children}
            </div>
        </>
    );
}

export default NullLayout;