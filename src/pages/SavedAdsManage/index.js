import axios from "axios";
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
        width: '582px',
    },
    {
        name: '',
        selector: row => row.manage,
        width: '120px',
    },
];

// const data = [];

const paginationComponentOptions = {
    rowsPerPageText: 'Số dòng hiển thị',
    rangeSeparatorText: 'trong số',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tất cả',
};

function SavedAdsManage({ handleSetPage }) {
    const [renderData, setRenderData] = useState(false);
    const [ ads, setAds ] = useState([]);
    const [ savedAds, setSavedAds ] = useState([]);
    const [ user, setUser ] = useState({});

    //Data table
    const [ data, setData ] = useState([]);

    //Filtering table*******************
    const [filterText, setFilterText] = useState('');
    // const [dateFrom, setDateFrom] = useState('');
    // const [dateTo, setDateTo] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = data.filter(
		item => {
            return item.title && item.title.toLowerCase().includes(filterText.toLowerCase())
            // if(dateFrom && dateTo){
            //     const from = new Date(dateFrom);
            //     const to = new Date(dateTo);
            //     const createdAt = new Date(item.createdAt);
            //     return from <= createdAt && createdAt <= to;
            // }else return true;
        },
	);

    const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
                // setDateFrom('');
                // setDateTo('');
			}
		};

		return (
			<div className="relative w-[33%] mt-[10px]">
                <input 
                className="w-full text-sm appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                type='text' 
                placeholder="Lọc theo tiêu đề" 
                onChange={e => setFilterText(e.target.value)} 
                value={filterText} 
                />
                <FaWindowClose onClick={handleClear} className="absolute top-[2px] right-0 text-2xl rounded text-teal-500 cursor-pointer" />
            </div>
            // <div className="w-[72%] mt-[10px] flex justify-between">
            //     <div className="text-sm flex items-center">Lọc theo ngày cập nhật:</div>
            //     <div className="flex">
            //         <label className="text-sm flex items-center mr-2">Từ</label>
            //         <input 
            //         className="w-full text-sm appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            //         type='date' 
            //         onChange={e => setDateFrom(e.target.value)} 
            //         value={dateFrom} 
            //         />
            //     </div>
            //     <div className="flex">
            //         <label className="text-sm flex items-center mr-2">đến</label>
            //         <input 
            //         className="w-full text-sm appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            //         type='date' 
            //         onChange={e => setDateTo(e.target.value)} 
            //         value={dateTo} 
            //         />
            //     </div>
            //     <div className="flex items-center">
            //         <FaWindowClose onClick={handleClear} className="text-2xl rounded text-teal-500 cursor-pointer" />
            //     </div>
            // </div>
		);
	}, [filterText, resetPaginationToggle]);
    //*******************Filtering table

    useEffect(() => {
        handleSetPage('Tin đã lưu');
    }, [])

    const handleCancelSaved = (idAd) => {
        axios.delete(`${apiURL}saved-ads/${idAd}`, authorization(localStorage.getItem('token')))
            .then(res => {
                console.log('Bo luu tin');
                // const arr = data.filter(item => item.id !== idAd);
                // setData(arr);
                setRenderData(!renderData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        axios.get(`${apiURL}customers/profile`, authorization(localStorage.getItem('token')))
            .then(res => setUser(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}ads`)
            .then(res => {
                // const arr = [...res.data].reverse();
                setAds(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}saved-ads`)
            .then(res => {
                const arr = [...res.data].reverse();
                setSavedAds(arr);
            })
            .catch(err => console.log(err))
    }, [renderData])

    useEffect(() => {
        const arr = [];

        savedAds.map(savedad => {
            if(savedad.idCustomer===user._id){
                ads.map(ad => {
                    if(ad._id===savedad.idAd){
                        const row = {
                            id: ad._id,
                            image: <Link to={`/chi-tiet/${ad._id}`}><img className="w-[50px] h-[50px] object-contain" src={ad.images[0].url} alt=""/></Link>,
                            title: ad.title,
                            manage: <div className="flex text-teal-500">
                                <div onClick={() => handleCancelSaved(ad._id)} className="cursor-pointer text-red-500 hover:text-red-700">Bỏ lưu</div>
                            </div>,
                        }
                        arr.push(row);
                    }
                });
            }
        });

        setData(arr);

    }, [ads, savedAds])

    return ( 
        <div>
            <div>
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
            </div>
        </div>
    );
}

export default SavedAdsManage;