import styles from './AdminHeader.module.css';
import logo from '../../../../logo.png';
import { FaCaretDown } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

function AdminHeader() {
    let navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/dang-nhap');
    }

    return (
        <header className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.logo}>
                    <Link to='/'><img className='w-full h-full object-contain' src={logo} alt='' /></Link>
                </div>
                {/* <div className={styles.search}>
                    <div className={`flex basis-full h-[55%] justify-end`}>
                        <div className="flex items-center bg-gray-100 rounded-full px-2">
                            <FaBell className='text-teal-500 text-lg cursor-pointer'/>
                        </div>
                    </div>
                </div> */}
                <div className={styles.login}>
                    <div className="flex items-center bg-gray-100 rounded-full px-2">
                        <FaBell className='text-teal-500 text-lg cursor-pointer'/>
                    </div>
                    <div 
                    className={`${styles.user} flex cursor-pointer items-center relative h-full pl-7`}
                    >
                        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8czzbrLzXJ9R_uhKyMiwj1iGxKhJtH7pwlQ&usqp=CAU' alt='' className='w-[30px] h-[30px] rounded-full object-contain'/>
                        <div className='h-max ml-1'>Admin</div>
                        <FaCaretDown className='ml-1'/>
                        <div className={`${styles.dropdown} w-max shadow bg-white absolute top-[55px] right-0 px-4 py-2 hidden`}>
                            <ul>
                                <li className='py-1'>
                                    <div onClick={handleSignOut} className='hover:text-teal-500'>
                                        <FaSignOutAlt className='inline text-sm'/> 
                                        Đăng xuất
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader;