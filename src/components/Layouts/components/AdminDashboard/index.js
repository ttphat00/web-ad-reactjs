import styles from './AdminDashboard.module.css';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

function AdminDashboard({ page }) {
    return ( 
        <div className={styles.wrapper}>
            <div className={styles.user}>
                <div className={styles.avatar}>
                    <img className='w-full h-full object-contain rounded-full' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8czzbrLzXJ9R_uhKyMiwj1iGxKhJtH7pwlQ&usqp=CAU' alt='' />
                </div>
                <div className={styles.info}>
                    <div className='font-bold'>
                        Admin
                    </div>
                </div>
            </div>
            <div className='mt-1'>
                <ul>
                    <li className='py-3 text-sm border-b-[1px] border-solid text-gray-500'>
                        <Link className={clsx({
                            'text-teal-500': page === 'Quản lý người dùng',
                            'font-bold': page === 'Quản lý người dùng'
                        })} to='/admin/quan-ly-nguoi-dung'>
                            Quản lý người dùng
                        </Link>
                    </li>
                    <li className='py-3 text-sm border-b-[1px] border-solid text-gray-500'>
                        <Link className={clsx({
                            'text-teal-500': page === 'Quản lý danh mục',
                            'font-bold': page === 'Quản lý danh mục'
                        })} to='/admin/quan-ly-danh-muc'>
                            Quản lý danh mục
                        </Link>
                    </li>
                    <li className='py-3 text-sm border-b-[1px] border-solid text-gray-500'>
                        <Link className={clsx({
                            'text-teal-500': page === 'Quản lý giao dịch',
                            'font-bold': page === 'Quản lý giao dịch'
                        })} to='/admin/quan-ly-giao-dich'>
                            Quản lý giao dịch
                        </Link>
                    </li>
                    <li className='py-3 text-sm border-b-[1px] border-solid text-gray-500'>
                        <Link className={clsx({
                            'text-teal-500': page === 'Quản lý tin',
                            'font-bold': page === 'Quản lý tin'
                        })} to='/admin/quan-ly-tin'>
                            Quản lý tin
                        </Link>
                    </li>
                    <li className='py-3 text-sm border-b-[1px] border-solid text-gray-500'>
                        <Link className={clsx({
                            'text-teal-500': page === 'Thống kê doanh thu',
                            'font-bold': page === 'Thống kê doanh thu'
                        })} to=''>
                            Thống kê doanh thu
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;