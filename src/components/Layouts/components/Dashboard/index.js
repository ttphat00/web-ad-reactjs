import styles from './Dashboard.module.css';
import { FaCoins } from "react-icons/fa";
import { Link } from 'react-router-dom';
import clsx from 'clsx';

function Dashboard({ page, user }) {
    return ( 
        <div className={styles.wrapper}>
            <div className={styles.user}>
                <div className={styles.avatar}>
                    <img className='w-full h-full object-cover rounded-full' src={user.avatar} alt='' />
                </div>
                <div className={styles.info}>
                    <div className='font-bold'>
                        {user.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                        <Link to='/user/cap-nhat-tai-khoan' className='hover:text-teal-700'>Chỉnh sửa tài khoản</Link>
                    </div>
                    <div className='text-sm mt-1'>
                        <FaCoins className='inline text-yellow-500 mr-1'/>
                        Số dư: <span className='text-red-500 font-bold'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.accountBalance)}</span>
                    </div>
                </div>
            </div>
            <div className='mt-1'>
                <ul>
                    <li className='py-3 text-sm border-b-[1px] border-solid text-gray-500'>
                        <Link className={clsx({
                            'text-teal-500': page === 'Thông tin tài khoản',
                            'font-bold': page === 'Thông tin tài khoản'
                        })} to='/user/tai-khoan'>
                            Thông tin tài khoản
                        </Link>
                    </li>
                    <li className='py-3 text-sm border-b-[1px] border-solid text-gray-500'>
                        <Link className={clsx({
                            'text-teal-500': page === 'Quản lý tin đăng',
                            'font-bold': page === 'Quản lý tin đăng'
                        })} to='/user/quan-ly-tin'>
                            Quản lý tin đăng
                        </Link>
                    </li>
                    <li className='py-3 text-sm border-b-[1px] border-solid text-gray-500'>
                        <Link className={clsx({
                            'text-teal-500': page === 'Lịch sử giao dịch',
                            'font-bold': page === 'Lịch sử giao dịch'
                        })} to='/user/lich-su-giao-dich'>
                            Lịch sử giao dịch
                        </Link>
                    </li>
                    <li className='py-3 text-sm border-b-[1px] border-solid text-gray-500'>
                        <Link className={clsx({
                            'text-teal-500': page === 'Tin đã lưu',
                            'font-bold': page === 'Tin đã lưu'
                        })} to='/user/tin-da-luu'>
                            Tin đã lưu
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;