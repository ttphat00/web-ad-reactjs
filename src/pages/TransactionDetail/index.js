import { Fragment, useEffect, useState } from 'react';
// import styles from './TransactionDetail.module.css';
import axios from 'axios';
import { apiURL } from '../../config';
import { useParams } from 'react-router-dom';

function TransactionDetail() {
    let { idOrder } = useParams();
    const [ order, setOrder ] = useState({});
    const [ ads, setAds ] = useState([]);
    const [ categories, setCategories ] = useState([]);

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

    const formatTime = (time) => {
        const createdDate = new Date(time);
        createdDate.setHours(createdDate.getHours() - 7);
        const date = createdDate.getDate();
        const month = createdDate.getMonth() + 1;
        const year = createdDate.getFullYear();
        const hour = createdDate.getHours();
        const minute = createdDate.getMinutes();
        return `${date}/${month}/${year} - ${hour}:${minute}`;
    }

    return (
        <>
            <div className='mt-[30px] w-[85%] m-auto'>
                <div className='border-b-[3px] border-teal-500'>
                    <h2 className='text-xl font-medium'>CHI TIẾT GIAO DỊCH</h2>
                </div>
                <div className='px-6 py-8 text-sm bg-white'>
                    <div className='font-medium'>Thông tin đơn hàng:</div>
                    <div className='mt-1 mb-1'>- Mã đơn hàng: <span className='font-medium'>{idOrder}</span></div>
                    <div className='mb-1'>- Ngày đăng: <span className='font-medium'>{formatTime(order.orderDate)}</span></div>
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
                                                    Số ngày
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
                                                                            {ad.duration}
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
                </div>
            </div>
        </>
    )
}

export default TransactionDetail;