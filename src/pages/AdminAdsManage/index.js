import axios from "axios";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { FaWindowClose } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiURL } from "../../config";
import ErrorNotification from "../../components/Notification/ErrorNotification";
// import SuccessNotification from "../../components/Notification/SuccessNotification";

const columns = [
    {
        name: '',
        selector: row => row.image,
        width: '100px',
    },
    {
        name: 'Tiêu đề',
        selector: row => row.title,
        sortable: true,
    },
    {
        name: 'Ngày cập nhật',
        selector: row => row.createdAt,
        sortable: true,
        width: '140px',
    },
    {
        name: 'Ngày hết hạn',
        selector: row => row.expireDate,
        sortable: true,
        width: '160px',
    },
    {
        name: '',
        selector: row => row.manage,
        width: '160px',
    },
];

const columns2 = [
    {
        name: '',
        selector: row => row.image,
        width: '100px',
    },
    {
        name: 'Tiêu đề',
        selector: row => row.title,
        sortable: true,
    },
    {
        name: 'Ngày cập nhật',
        selector: row => row.createdAt,
        sortable: true,
        width: '160px',
    },
    {
        name: 'Lý do',
        selector: row => row.reason,
        width: '200px',
    },
    {
        name: '',
        selector: row => row.manage,
        width: '100px',
    },
];

// const data = [];

const paginationComponentOptions = {
    rowsPerPageText: 'Dòng trên trang',
    rangeSeparatorText: 'trong',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tất cả',
};

function AdminAdsManage({ handleSetPage }) {
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    // const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [ tab, setTab ] = useState('Tin chờ duyệt');
    const [ ads, setAds ] = useState([]);
    const [ orders, setOrders ] = useState([]);

    //Data table
    const [ data, setData ] = useState([]);

    //Filtering table*******************
    // const [filterText, setFilterText] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = data.filter(
		item => {
            // item.title && item.title.toLowerCase().includes(filterText.toLowerCase())
            if(dateFrom && dateTo){
                const from = new Date(dateFrom);
                const to = new Date(dateTo);
                const createdAt = new Date(item.createdAt);
                return from <= createdAt && createdAt <= to;
            }else return true;
        },
	);

    const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (dateFrom || dateTo) {
				setResetPaginationToggle(!resetPaginationToggle);
				// setFilterText('');
                setDateFrom('');
                setDateTo('');
			}
		};

		return (
			// <div className="relative w-[33%] mt-[10px]">
            //     <input 
            //     className="w-full text-sm appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            //     type='text' 
            //     placeholder="Lọc theo tiêu đề" 
            //     onChange={e => setFilterText(e.target.value)} 
            //     value={filterText} 
            //     />
            //     <FaWindowClose onClick={handleClear} className="absolute top-[2px] right-0 text-2xl rounded text-teal-500 cursor-pointer" />
            // </div>
            <div className="w-[72%] mt-[10px] flex justify-between">
                <div className="text-sm flex items-center">Lọc theo ngày cập nhật:</div>
                <div className="flex">
                    <label className="text-sm flex items-center mr-2">Từ</label>
                    <input 
                    className="w-full text-sm appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    type='date' 
                    onChange={e => setDateFrom(e.target.value)} 
                    value={dateFrom} 
                    />
                </div>
                <div className="flex">
                    <label className="text-sm flex items-center mr-2">đến</label>
                    <input 
                    className="w-full text-sm appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    type='date' 
                    onChange={e => setDateTo(e.target.value)} 
                    value={dateTo} 
                    />
                </div>
                <div className="flex items-center">
                    <FaWindowClose onClick={handleClear} className="text-2xl rounded text-teal-500 cursor-pointer" />
                </div>
            </div>
		);
	}, [dateFrom, dateTo, resetPaginationToggle]);
    //*******************Filtering table

    useEffect(() => {
        handleSetPage('Quản lý tin');
    }, [])

    const formatTime = (time) => {
        const createdDate = new Date(time);
        createdDate.setHours(createdDate.getHours() - 7);
        
        let date = createdDate.getDate();
        if(date < 10){
            date = `0${date}`;
        }

        let month = createdDate.getMonth() + 1;
        if(month < 10){
            month = `0${month}`;
        }

        const year = createdDate.getFullYear();

        return `${year}-${month}-${date}`;
    }

    const formatExpireTime = (time) => {
        const createdDate = new Date(time);
        createdDate.setHours(createdDate.getHours() - 7);
        
        let hour = createdDate.getHours();
        if(hour < 10){
            hour = `0${hour}`;
        }

        let minute = createdDate.getMinutes();
        if(minute < 10){
            minute = `0${minute}`;
        }

        let date = createdDate.getDate();
        if(date < 10){
            date = `0${date}`;
        }

        let month = createdDate.getMonth() + 1;
        if(month < 10){
            month = `0${month}`;
        }

        const year = createdDate.getFullYear();

        return `${year}-${month}-${date} - ${hour}:${minute}`;
    }

    const handleAcceptAd = (idAd, idOrder) => {
        const today = new Date();
        today.setHours(today.getHours() + 7);

        axios.put(`${apiURL}ads/extend/${idAd}`, {
            display: true
        })
            .then(res => {
                console.log('Hien tin');
                return axios.put(`${apiURL}orders/${idOrder}`, {
                    status: 'Chấp nhận',
                    approvalDate: today,
                })
            })
            .then(res => {
                console.log('Thay doi trang thai thanh Chap nhan');

                const arr = data.filter(ad => ad.id !== idAd);

                setData(arr);
            })
            .catch(err => {
                console.log(err);

                setShowErrorNotification(true);

                setTimeout(() => {
                    setShowErrorNotification(false);
                }, 5000);
            })
    }

    const handleRefuseAd = (idAd, idOrder, idCustomer, totalCost, orderDate, cost) => {
        const confirm = window.confirm('');
        if(confirm){
            const today = new Date();
            today.setHours(today.getHours() + 7);

            // axios.get(`${apiURL}customers/${idCustomer}`)
            //     .then(res => {
            //         const accountBalance = res.data.accountBalance;
            //         return axios.put(`${apiURL}customers/update/${idCustomer}`, {
            //             accountBalance: (accountBalance + totalCost)
            //         })
            //     })
            //     .then(res => {
            //         console.log('Tra tien cho khach hang');
            //         return axios.put(`${apiURL}orders/${idOrder}`, {
            //             status: 'Bị từ chối',
            //             approvalDate: today,
            //         })
            //     })
            axios.put(`${apiURL}orders/${idOrder}`, {
                status: 'Bị từ chối',
                approvalDate: today,
            })
                .then(res => {
                    console.log('Thay doi trang thai thanh Bi tu choi');
                    return axios.post(`${apiURL}orders/admin-order`, {
                        totalCost: totalCost,
                        idAd: idAd,
                        cost: cost,
                        orderDate: new Date(orderDate),
                        approvalDate: today,
                        status: 'Hoàn trả tiền',
                        idCustomer: idCustomer,
                    })
                })
                .then(res => {
                    console.log('Tao giao dich moi');

                    const arr = data.filter(ad => ad.id !== idAd);

                    setData(arr);
                })
                .catch(err => {
                    console.log(err);

                    setShowErrorNotification(true);

                    setTimeout(() => {
                        setShowErrorNotification(false);
                    }, 5000);
                })
        }
    }

    // const handleDeleteAd = async (idAd, idOrder) => {
    //     const confirm = window.confirm('Bạn có chắc chắn muốn xóa tin quảng cáo này?');
        
    //     if(confirm){
    //         try {
    //             const uploadData = new FormData();

    //             uploadData.append("display", false);

    //             const res1 = await axios.put(`${apiURL}ads/${idAd}`, uploadData);
    //             console.log('An tin');

    //             const res2 = await axios.put(`${apiURL}orders/${idOrder}`, {
    //                 status: 'Tin đã xóa',
    //             });
    //             console.log('Thay doi trang thai thanh Tin bi xoa');

    //             setShowSuccessNotification(true);

    //             const arr = data.filter(ad => ad.id !== idAd);

    //             setData(arr);

    //             setTimeout(() => {
    //                 setShowSuccessNotification(false);
    //             }, 5000);
    //         } catch (error) {
    //             console.log(error);

    //             setShowErrorNotification(true);

    //             setTimeout(() => {
    //                 setShowErrorNotification(false);
    //             }, 5000);
    //         }
    //     }
    // }

    useEffect(() => {
        axios.get(`${apiURL}ads`)
            .then(res => setAds(res.data))
            .catch(err => console.log(err))
    }, [data])

    useEffect(() => {
        axios.get(`${apiURL}orders`)
            .then(res => {
                const arr = [...res.data].reverse();
                setOrders(arr);
            })
            .catch(err => console.log(err))
    }, [data])

    useEffect(() => {
        const arr = [];

        if(tab==='Tin đã duyệt'){
            orders.map(order => {
                if(order.status==='Chấp nhận'){
                    ads.map(ad => {
                        if(ad._id===order.adDetails[0].idAd && ad.display){
                            const row = {
                                id: ad._id,
                                image: <Link to={`/chi-tiet/${ad.title}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                                title: <Link className="hover:text-teal-700" to={`/chi-tiet/${ad.title}`}>{ad.title}</Link>,
                                createdAt: formatTime(ad.createdAt),
                                expireDate: formatExpireTime(ad.expireDate),
                                manage: '',
                            }
                            arr.push(row);
                        }
                    });
                }
            });
        }else if(tab==='Tin chờ duyệt'){
            orders.map(order => {
                if(order.status==='Đang chờ xác nhận'){
                    ads.map(ad => {
                        if(ad._id===order.adDetails[0].idAd){
                            const row = {
                                id: ad._id,
                                image: <Link to={`/xem-truoc/${ad.title}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                                title: <Link className="hover:text-teal-700" to={`/xem-truoc/${ad.title}`}>{ad.title}</Link>,
                                createdAt: formatTime(ad.createdAt),
                                expireDate: formatExpireTime(ad.expireDate),
                                manage: <div className="flex">
                                    <div onClick={() => handleAcceptAd(ad._id, order._id)} className="cursor-pointer text-teal-500 hover:text-teal-700 mr-4">Chấp nhận</div>
                                    <div onClick={() => handleRefuseAd(ad._id, order._id, order.idCustomer, order.totalCost, order.orderDate, order.adDetails[0].cost)} className="cursor-pointer text-red-500 hover:text-red-700">Từ chối</div>
                                </div>,
                            }
                            arr.push(row);
                        }
                    });
                }
            });
        }else orders.map(order => {
            if(order.status==='Bị từ chối'){
                ads.map(ad => {
                    if(ad._id===order.adDetails[0].idAd){
                        const row = {
                            id: ad._id,
                            image: <Link to={`/xem-truoc/${ad.title}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                            title: <Link className="hover:text-teal-700" to={`/xem-truoc/${ad.title}`}>{ad.title}</Link>,
                            createdAt: formatTime(ad.createdAt),
                            reason: <div className="text-yellow-700">Nội dung không phù hợp</div>,
                            manage: <div className="flex text-red-500">
                                <div className="cursor-pointer hover:text-red-700">Xóa</div>
                            </div>,
                        }
                        arr.push(row);
                    }
                });
            }
        });

        setData(arr);

    }, [ads, tab])

    return ( 
        <div>
            {showErrorNotification && <ErrorNotification />}
            {/* {showSuccessNotification && <SuccessNotification />} */}
            <div className="flex border-b-[1px] border-gray-200 text-sm">
            <div onClick={() => setTab('Tin chờ duyệt')} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin chờ duyệt',
                    'border-teal-500': tab === 'Tin chờ duyệt',
                    'hover:text-black': tab !== 'Tin chờ duyệt',
                    'text-gray-500': tab !== 'Tin chờ duyệt'
                })}>
                    Tin chờ duyệt
                </div>
                <div onClick={() => setTab('Tin đã duyệt')} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin đã duyệt',
                    'border-teal-500': tab === 'Tin đã duyệt',
                    'hover:text-black': tab !== 'Tin đã duyệt',
                    'text-gray-500': tab !== 'Tin đã duyệt'
                })}>
                    Tin đã duyệt
                </div>
                <div onClick={() => setTab('Tin bị từ chối')} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin bị từ chối',
                    'border-teal-500': tab === 'Tin bị từ chối',
                    'hover:text-black': tab !== 'Tin bị từ chối',
                    'text-gray-500': tab !== 'Tin bị từ chối'
                })}>
                    Tin bị từ chối
                </div>
            </div>
            <div>
                {tab==='Tin bị từ chối'
                ?
                <DataTable
                    columns={columns2}
                    data={filteredItems}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToggle}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                />
                :
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToggle}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                />
                }
            </div>
        </div>
    );
}

export default AdminAdsManage;