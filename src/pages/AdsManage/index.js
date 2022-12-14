import axios from "axios";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { FaWindowClose } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiURL, authorization } from "../../config";
import ErrorNotification from "../../components/Notification/ErrorNotification";
import SuccessNotification from "../../components/Notification/SuccessNotification";
import PopupExtend from "../../components/Popups/PopupExtend";
import PopupExtendOfExpireAd from "../../components/Popups/PopupExtendOfExpireAd";

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
        width: '220px',
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
        width: '130px',
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
        width: '220px',
    },
    {
        name: 'Ngày cập nhật',
        selector: row => row.createdAt,
        sortable: true,
        width: '140px',
    },
    {
        name: 'Lý do',
        selector: row => row.reason,
        width: '190px',
    },
    {
        name: '',
        selector: row => row.manage,
        width: '100px',
    },
];

// const data = [];

const paginationComponentOptions = {
    rowsPerPageText: 'Số dòng hiển thị',
    rangeSeparatorText: 'trong số',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tất cả',
};

function AdsManage({ handleSetPage }) {
    const [showPopupExtend, setShowPopupExtend] = useState(false);
    const [showPopupExtendOfExpireAd, setShowPopupExtendOfExpireAd] = useState(false);
    const [renderData, setRenderData] = useState(false);
    const [acceptedAds, setAcceptedAds] = useState(0);
    const [waitingAds, setWaitingAds] = useState(0);
    const [expireAds, setExpireAds] = useState(0);
    const [refusedAds, setRefusedAds] = useState(0);
    const [idAd, setIdAd] = useState('');
    const [idOrder, setIdOrder] = useState('');
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [ tab, setTab ] = useState('Tin đang rao');
    const [ ads, setAds ] = useState([]);
    const [ orders, setOrders ] = useState([]);
    const [ user, setUser ] = useState({});

    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);

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

    const handleChange = ({ selectedRows }) => {
        setSelectedRows(selectedRows);
        // console.log(selectedRows);
    };

    useEffect(() => {
        handleSetPage('Quản lý tin đăng');
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

    const handleDeleteAd = async (idAd, idOrder) => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa tin quảng cáo này?');
        
        if(confirm){
            try {

                const res1 = await axios.put(`${apiURL}ads/extend/${idAd}`, {
                    display: false,
                });
                console.log('An tin');

                const res2 = await axios.put(`${apiURL}orders/${idOrder}`, {
                    status: 'Tin đã xóa',
                });
                console.log('Thay doi trang thai thanh Tin bi xoa');

                setShowSuccessNotification(true);

                // const arr = data.filter(ad => ad.id !== idAd);

                // setData(arr);
                setRenderData(!renderData);

                setTimeout(() => {
                    setShowSuccessNotification(false);
                }, 5000);
            } catch (error) {
                console.log(error);

                setShowErrorNotification(true);

                setTimeout(() => {
                    setShowErrorNotification(false);
                }, 5000);
            }
            
            // axios.put(`${apiURL}ads/${idAd}`, uploadData)
            //     .then(res => {
            //         console.log('An tin');
            //         return axios.put(`${apiURL}orders/${idOrder}`, {
            //             status: 'Tin đã xóa',
            //         })
            //     })
            //     .then(res => {
            //         console.log('Thay doi trang thai thanh Tin bi xoa');
                    
            //         setShowSuccessNotification(true);

            //         setData([]);
            //         setToggleDel(!toggleDel);

            //         setTimeout(() => {
            //             setShowSuccessNotification(false);
            //         }, 5000);
            //     })
            //     .catch(err => {
            //         console.log(err);

            //         setShowErrorNotification(true);

            //         setTimeout(() => {
            //             setShowErrorNotification(false);
            //         }, 5000);
            //     });
        }
    }

    const handleDeleteManyAd = async () => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa các tin đã chọn?');
        
        if(confirm){
            try {

                const res1 = await axios.put(`${apiURL}ads/delete-many`, {
                    ads: selectedRows,
                });
                console.log('An cac tin');

                const res2 = await axios.put(`${apiURL}orders/delete-many`, {
                    ads: selectedRows,
                });
                console.log('Thay doi trang thai thanh Tin bi xoa');

                setShowSuccessNotification(true);

                setSelectedRows([]);

                setToggleCleared(!toggleCleared);

                // const arr = data.filter(ad => !(selectedRows.includes(ad)));

                // setData(arr);
                setRenderData(!renderData);

                setTimeout(() => {
                    setShowSuccessNotification(false);
                }, 5000);
            } catch (error) {
                console.log(error);

                setShowErrorNotification(true);

                setTimeout(() => {
                    setShowErrorNotification(false);
                }, 5000);
            }
        }
    }

    useEffect(() => {
        axios.get(`${apiURL}customers/profile`, authorization(localStorage.getItem('token')))
            .then(res => setUser(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}ads`)
            .then(res => setAds(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}orders`)
            .then(res => {
                const arr = [...res.data].reverse();
                setOrders(arr);
            })
            .catch(err => console.log(err))
    }, [renderData])

    useEffect(() => {
        let accepted = 0;
        orders.map(order => {
            if(order.idCustomer===user._id && order.status==='Chấp nhận'){
                ads.map(ad => {
                    const today = new Date();
                    const expireDate = new Date(ad.expireDate);
                    expireDate.setHours(expireDate.getHours() - 7);
                    if(ad._id===order.adDetails[0].idAd && ad.display && expireDate>=today){
                        accepted += 1;
                    }
                });
            }
        });
        setAcceptedAds(accepted);
    }, [orders])
    
    useEffect(() => {
        let waiting = 0;
        orders.map(order => {
            if(order.idCustomer===user._id && order.status==='Đang chờ xác nhận'){
                ads.map(ad => {
                    if(ad._id===order.adDetails[0].idAd){
                        waiting += 1;
                    }
                });
            }
        });
        setWaitingAds(waiting);
    }, [orders])

    useEffect(() => {
        let expire = 0;
        orders.map(order => {
            if(order.idCustomer===user._id && order.status==='Chấp nhận'){
                ads.map(ad => {
                    const today = new Date();
                    const expireDate = new Date(ad.expireDate);
                    expireDate.setHours(expireDate.getHours() - 7);
                    if(ad._id===order.adDetails[0].idAd && expireDate<today){
                        expire += 1;
                    }
                });
            }
        });
        setExpireAds(expire);
    }, [orders])

    useEffect(() => {
        let refused = 0;
        orders.map(order => {
            if(order.idCustomer===user._id && order.status==='Bị từ chối'){
                ads.map(ad => {
                    if(ad._id===order.adDetails[0].idAd){
                        refused += 1;
                    }
                });
            }
        });
        setRefusedAds(refused);
    }, [orders])

    useEffect(() => {
        const arr = [];

        if(tab==='Tin đang rao'){
            orders.map(order => {
                if(order.idCustomer===user._id && order.status==='Chấp nhận'){
                    ads.map(ad => {
                        const today = new Date();
                        const expireDate = new Date(ad.expireDate);
                        expireDate.setHours(expireDate.getHours() - 7);
                        if(ad._id===order.adDetails[0].idAd && ad.display && expireDate>=today){
                            const row = {
                                id: ad._id,
                                idOrder: order._id,
                                image: <Link to={`/chi-tiet/${ad._id}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                                title: <Link className="hover:text-teal-700" to={`/chi-tiet/${ad._id}`}>{ad.title}</Link>,
                                createdAt: formatTime(ad.createdAt),
                                expireDate: formatExpireTime(ad.expireDate),
                                manage: <div className="flex">
                                    <div onClick={() => {setShowPopupExtend(true); setIdAd(ad._id)}} className="mr-3 cursor-pointer text-yellow-700 hover:text-yellow-900">Gia hạn</div>
                                    <div onClick={() => handleDeleteAd(ad._id, order._id)} className="cursor-pointer text-red-500 hover:text-red-700">Xóa</div>
                                </div>,
                            }
                            arr.push(row);
                        }
                    });
                }
            });
        }else if(tab==='Tin hết hạn'){
            orders.map(order => {
                if(order.idCustomer===user._id && order.status==='Chấp nhận'){
                    ads.map(ad => {
                        const today = new Date();
                        const expireDate = new Date(ad.expireDate);
                        expireDate.setHours(expireDate.getHours() - 7);
                        if(ad._id===order.adDetails[0].idAd && expireDate<today){
                            const row = {
                                id: ad._id,
                                idOrder: order._id,
                                image: <Link to={`/xem-truoc/${ad._id}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                                title: <Link className="hover:text-teal-700" to={`/xem-truoc/${ad._id}`}>{ad.title}</Link>,
                                createdAt: formatTime(ad.createdAt),
                                expireDate: formatExpireTime(ad.expireDate),
                                manage: <div className="flex text-teal-500">
                                    <div onClick={() => {setShowPopupExtendOfExpireAd(true); setIdAd(ad._id); setIdOrder(order._id);}} className="mr-3 cursor-pointer text-yellow-700 hover:text-yellow-900">Gia hạn</div>
                                    <div onClick={() => handleDeleteAd(ad._id, order._id)} className="cursor-pointer text-red-500 hover:text-red-700">Xóa</div>
                                </div>,
                            }
                            arr.push(row);
                        }
                    });
                }
            });
        }else if(tab==='Tin chờ duyệt'){
            orders.map(order => {
                if(order.idCustomer===user._id && order.status==='Đang chờ xác nhận'){
                    ads.map(ad => {
                        if(ad._id===order.adDetails[0].idAd){
                            const row = {
                                id: ad._id,
                                idOrder: order._id,
                                image: <Link to={`/xem-truoc/${ad._id}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                                title: <Link className="hover:text-teal-700" to={`/xem-truoc/${ad._id}`}>{ad.title}</Link>,
                                createdAt: formatTime(ad.createdAt),
                                expireDate: formatExpireTime(ad.expireDate),
                                manage: <div className="flex text-teal-500">
                                    <Link to={`/user/cap-nhat-tin/${ad._id}`} className="mr-3 text-blue-500 hover:text-blue-700">Sửa</Link>
                                    <div onClick={() => handleDeleteAd(ad._id, order._id)} className="cursor-pointer text-red-500 hover:text-red-700">Xóa</div>
                                </div>,
                            }
                            arr.push(row);
                        }
                    });
                }
            });
        }else orders.map(order => {
            if(order.idCustomer===user._id && order.status==='Bị từ chối'){
                ads.map(ad => {
                    if(ad._id===order.adDetails[0].idAd){
                        const row = {
                            id: ad._id,
                            idOrder: order._id,
                            image: <Link to={`/xem-truoc/${ad._id}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                            title: <Link className="hover:text-teal-700" to={`/xem-truoc/${ad._id}`}>{ad.title}</Link>,
                            createdAt: formatTime(ad.createdAt),
                            reason: <div className="text-yellow-700">Nội dung không phù hợp</div>,
                            manage: <div className="flex">
                                {/* <Link to={`/user/cap-nhat-tin/${ad._id}`} className="mr-3 text-blue-500 hover:text-blue-700">Sửa</Link> */}
                                <div onClick={() => handleDeleteAd(ad._id, order._id)} className="cursor-pointer text-red-500 hover:text-red-700">Xóa</div>
                            </div>,
                        }
                        arr.push(row);
                    }
                });
            }
        });

        setData(arr);

    }, [ads, tab, orders])

    return ( 
        <div>
            {showPopupExtend && <PopupExtend handleShowPopupExtend={setShowPopupExtend} idAd={idAd} />}
            {showPopupExtendOfExpireAd && <PopupExtendOfExpireAd handleShowPopupExtendOfExpireAd={setShowPopupExtendOfExpireAd} idAd={idAd} idOrder={idOrder} />}
            {showErrorNotification && <ErrorNotification />}
            {showSuccessNotification && <SuccessNotification />}
            <div className="flex border-b-[1px] border-gray-200 text-sm">
                <div onClick={() => {setTab('Tin đang rao'); setToggleCleared(!toggleCleared); setSelectedRows([]);}} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin đang rao',
                    'border-teal-500': tab === 'Tin đang rao',
                    'hover:text-black': tab !== 'Tin đang rao',
                    'text-gray-500': tab !== 'Tin đang rao'
                })}>
                    Tin đang rao
                    <span className="text-teal-500 font-medium ml-2">{acceptedAds}</span>
                </div>
                <div onClick={() => {setTab('Tin chờ duyệt'); setToggleCleared(!toggleCleared); setSelectedRows([]);}} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin chờ duyệt',
                    'border-teal-500': tab === 'Tin chờ duyệt',
                    'hover:text-black': tab !== 'Tin chờ duyệt',
                    'text-gray-500': tab !== 'Tin chờ duyệt'
                })}>
                    Tin chờ duyệt
                    <span className="text-teal-500 font-medium ml-2">{waitingAds}</span>
                </div>
                <div onClick={() => {setTab('Tin hết hạn'); setToggleCleared(!toggleCleared); setSelectedRows([]);}} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin hết hạn',
                    'border-teal-500': tab === 'Tin hết hạn',
                    'hover:text-black': tab !== 'Tin hết hạn',
                    'text-gray-500': tab !== 'Tin hết hạn'
                })}>
                    Tin hết hạn
                    <span className="text-teal-500 font-medium ml-2">{expireAds}</span>
                </div>
                <div onClick={() => {setTab('Tin bị từ chối'); setToggleCleared(!toggleCleared); setSelectedRows([]);}} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin bị từ chối',
                    'border-teal-500': tab === 'Tin bị từ chối',
                    'hover:text-black': tab !== 'Tin bị từ chối',
                    'text-gray-500': tab !== 'Tin bị từ chối'
                })}>
                    Tin bị từ chối
                    <span className="text-teal-500 font-medium ml-2">{refusedAds}</span>
                </div>
            </div>
            <div className="relative">
                {selectedRows.length!==0 &&
                <div className="absolute z-50 top-[32px] left-[18px]">
                    <button onClick={handleDeleteManyAd} className="bg-red-500 hover:bg-red-700 text-white text-sm px-3 rounded">Xóa</button>
                </div>
                }
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
                    selectableRows
                    onSelectedRowsChange={handleChange}
                    clearSelectedRows={toggleCleared}
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
                    selectableRows
                    onSelectedRowsChange={handleChange}
                    clearSelectedRows={toggleCleared}
                />
                }
            </div>
        </div>
    );
}

export default AdsManage;