import axios from "axios";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { FaWindowClose } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiURL, authorization } from "../../config";

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
        width: '250px',
    },
    {
        name: 'Ngày cập nhật',
        selector: row => row.createdAt,
        sortable: true,
        width: '160px',
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
        width: '250px',
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
    rowsPerPageText: 'Dòng trên trang',
    rangeSeparatorText: 'trong',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tất cả',
};

function AdsManage({ handleSetPage }) {
    const [ tab, setTab ] = useState('Tin đang rao');
    const [ ads, setAds ] = useState([]);
    const [ orders, setOrders ] = useState([]);
    const [ user, setUser ] = useState({});

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
            .then(res => setOrders(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const arr = [];

        if(tab==='Tin đang rao'){
            ads.map(ad => {
                if(ad.idCustomer===user._id && ad.display){
                    const row = {
                        id: ad._id,
                        image: <Link to={`/chi-tiet/${ad.title}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                        title: <Link className="hover:text-teal-700" to={`/chi-tiet/${ad.title}`}>{ad.title}</Link>,
                        createdAt: formatTime(ad.createdAt),
                        expireDate: formatTime(ad.expireDate),
                        manage: <div className="flex text-teal-500">
                            <div className="mr-3 cursor-pointer hover:text-teal-700">Gia hạn</div>
                            <div className="cursor-pointer hover:text-teal-700">Xóa</div>
                        </div>,
                    }
                    arr.push(row);
                }
            });
        }else if(tab==='Tin hết hạn'){
            ads.map(ad => {
                const today = new Date();
                const expireDate = new Date(ad.expireDate);
                expireDate.setHours(expireDate.getHours() - 7);
                if(ad.idCustomer===user._id && expireDate<today){
                    const row = {
                        id: ad._id,
                        image: <Link to={`/xem-truoc/${ad.title}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                        title: <Link className="hover:text-teal-700" to={`/xem-truoc/${ad.title}`}>{ad.title}</Link>,
                        createdAt: formatTime(ad.createdAt),
                        expireDate: formatTime(ad.expireDate),
                        manage: <div className="flex text-teal-500">
                            <div className="mr-3 cursor-pointer hover:text-teal-700">Gia hạn</div>
                            <div className="cursor-pointer hover:text-teal-700">Xóa</div>
                        </div>,
                    }
                    arr.push(row);
                }
            });
        }else if(tab==='Tin chờ duyệt'){
            orders.map(order => {
                if(order.idCustomer===user._id && order.status==='Đang chờ xác nhận'){
                    ads.map(ad => {
                        if(ad._id===order.adDetails[0].idAd){
                            const row = {
                                id: ad._id,
                                image: <Link to={`/xem-truoc/${ad.title}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                                title: <Link className="hover:text-teal-700" to={`/xem-truoc/${ad.title}`}>{ad.title}</Link>,
                                createdAt: formatTime(ad.createdAt),
                                expireDate: formatTime(ad.expireDate),
                                manage: <div className="flex text-teal-500">
                                    <Link to='' className="mr-3 hover:text-teal-700">Sửa</Link>
                                    <div className="cursor-pointer hover:text-teal-700">Xóa</div>
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
                            image: <Link to={`/xem-truoc/${ad.title}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                            title: <Link className="hover:text-teal-700" to={`/xem-truoc/${ad.title}`}>{ad.title}</Link>,
                            createdAt: formatTime(ad.createdAt),
                            reason: <div className="text-red-500 font-medium">Nội dung không phù hợp</div>,
                            manage: <div className="flex text-teal-500">
                                <Link to='' className="mr-3 hover:text-teal-700">Sửa</Link>
                                <div className="cursor-pointer hover:text-teal-700">Xóa</div>
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
            <div className="flex border-b-[1px] border-gray-200 text-sm">
                <div onClick={() => setTab('Tin đang rao')} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin đang rao',
                    'border-teal-500': tab === 'Tin đang rao',
                    'hover:text-black': tab !== 'Tin đang rao',
                    'text-gray-500': tab !== 'Tin đang rao'
                })}>
                    Tin đang rao
                </div>
                <div onClick={() => setTab('Tin chờ duyệt')} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin chờ duyệt',
                    'border-teal-500': tab === 'Tin chờ duyệt',
                    'hover:text-black': tab !== 'Tin chờ duyệt',
                    'text-gray-500': tab !== 'Tin chờ duyệt'
                })}>
                    Tin chờ duyệt
                </div>
                <div onClick={() => setTab('Tin hết hạn')} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Tin hết hạn',
                    'border-teal-500': tab === 'Tin hết hạn',
                    'hover:text-black': tab !== 'Tin hết hạn',
                    'text-gray-500': tab !== 'Tin hết hạn'
                })}>
                    Tin hết hạn
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

export default AdsManage;