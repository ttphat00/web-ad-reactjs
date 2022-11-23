import { Fragment, useEffect, useState } from 'react';
// import styles from './ExtendedAdPayment.module.css';
import axios from 'axios';
import { apiURL, authorization } from '../../config';
import { Link, useParams } from 'react-router-dom';

function ExtendedAdPayment() {
    let { idOrder } = useParams();
    const [ user, setUser ] = useState({});
    const [ order, setOrder ] = useState({});
    const [ ads, setAds ] = useState([]);
    const [ categories, setCategories ] = useState([]);

    useEffect(() => {
        axios.get(`${apiURL}customers/profile`, authorization(localStorage.getItem('token')))
            .then(res => {
                // console.log(res.data);
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}orders/${idOrder}`)
            .then(res => {
                // console.log(res.data);
                setOrder(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}ads`)
            .then(res => {
                // console.log(res.data);
                setAds(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}categories`)
            .then(res => {
                // console.log(res.data);
                setCategories(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            <div className='mt-[30px] w-[85%] m-auto'>
                <div className='border-b-[3px] border-teal-500'>
                    <h2 className='text-xl font-medium'>THÔNG BÁO</h2>
                </div>
                <div className='px-6 py-8 text-sm bg-white'>
                    <div>Xin chào <span className='font-medium'>{user.name}</span></div>
                    <div className='mt-1'>Bạn vừa thanh toán gia hạn tin thành công.</div>
                    <div className='mt-5 font-medium'>Thông tin đơn hàng:</div>
                    <div className='mt-1 mb-1'>- Mã đơn hàng: <span className='font-medium'>{idOrder}</span></div>
                    <div>- Tổng số tiền đã thanh toán: <span className='font-medium'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalCost)}</span></div>
                    <div className='mt-5 font-medium'>Chi tiết:</div>
                    <div className="flex flex-col">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
                                    <table className="min-w-full text-center">
                                        <thead className="border-b bg-[#D9EDE9]">
                                            <tr>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                                    Tiêu đề
                                                </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                                    Danh mục
                                                </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                                    Số ngày gia hạn
                                                </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                                    Tổng phí
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.adDetails && order.adDetails.map(adDetail => {
                                                return (
                                                    <tr key={adDetail._id} className="bg-white border-b">
                                                        {ads.map(ad => {
                                                            if(ad._id === adDetail.idAd){
                                                                return (
                                                                    <Fragment key={ad._id}>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                            {ad.title}
                                                                        </td>
                                                                        {categories.map(category => {
                                                                            if(category._id === ad.idCategory){
                                                                                return <td key={category._id} className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">{category.title}</td>
                                                                            }else return null;
                                                                        })}
                                                                        <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                                                            {adDetail.cost/10000}
                                                                        </td>
                                                                    </Fragment>
                                                                )
                                                            }else return null;
                                                        })}
                                                        <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(adDetail.cost)}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            <tr className="bg-white border-b">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"></td>
                                                <td colSpan="2" className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap text-center">
                                                    Tổng tiền:
                                                </td>
                                                <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalCost)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <Link to='/'>
                            <button className="mr-10 bg-teal-500 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                Về trang chủ
                            </button>
                        </Link>
                        <Link to='/user/quan-ly-tin'>
                            <button className="ml-10 bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                Quay lại
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExtendedAdPayment;