import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { FaFacebookSquare } from "react-icons/fa";

function Footer() {
    return ( 
        <footer className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.contact}>
                    <h3 className='text-base max-[739px]:text-2xl font-medium'>Liên hệ</h3>
                    <div className={styles.content}>
                        <ul>
                            <li>Địa chỉ: <span className='font-medium'>3/2, quận Ninh Kiều, TP Cần Thơ</span></li>
                            <li>Điện thoại: <span className='font-medium'>0776509443</span></li>
                            <li>Email: <span className='font-medium'>advertisingvietnam@gmail.com</span><Link to=''></Link></li>
                            <li><Link to=''><FaFacebookSquare className='text-3xl max-[739px]:text-4xl text-blue-700' /></Link></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.infor}>
                    <h3 className='text-base max-[739px]:text-2xl font-medium'>Thông tin</h3>
                    <div className={styles.content}>
                        <ul>
                            <li><Link to=''>Điều khoản</Link></li>
                            <li><Link to=''>Liên hệ</Link></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.instruction}>
                    <h3 className='text-base max-[739px]:text-2xl font-medium'>Hướng dẫn</h3>
                    <div className={styles.content}>
                        <ul>
                            <li><Link to=''>Đăng tin</Link></li>
                            <li><Link to=''>Thanh toán</Link></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.support}>
                    <h3 className='text-base max-[739px]:text-2xl font-medium'>Hỗ trợ</h3>
                    <div className={styles.content}>
                        <ul>
                            <li><Link to=''>Trung tâm trợ giúp</Link></li>
                            <li><Link to=''>Liên hệ hỗ trợ</Link></li>
                            <li><Link to=''>Quyền riêng tư</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;