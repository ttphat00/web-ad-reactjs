import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { FaWindowClose } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiURL, authorization } from "../../config";

const columns = [
    {
        name: 'Mã đơn hàng',
        selector: row => row.idOrder,
    },
    {
        name: 'Loại giao dịch',
        selector: row => row.type,
        sortable: true,
        width: '180px',
    },
    {
        name: 'Ngày tạo',
        selector: row => row.orderDate,
        sortable: true,
        width: '200px',
    },
    {
        name: 'Tổng tiền',
        selector: row => row.totalCost,
        sortable: true,
        width: '150px',
    },
];

// const data = [];

const paginationComponentOptions = {
    rowsPerPageText: 'Số dòng hiển thị',
    rangeSeparatorText: 'trong số',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tất cả',
};

function TransactionHistory({ handleSetPage }) {
    const [ orders, setOrders ] = useState([]);
    const [ user, setUser ] = useState({});

    //Data table
    const [ data, setData ] = useState([]);

    //Filtering table*******************
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = data.filter(
		item => {
            if(dateFrom && dateTo){
                const from = new Date(dateFrom);
                const to = new Date(dateTo);
                const orderDate = new Date(item.orderDate);
                return from <= orderDate && orderDate <= to;
            }else return true;
        },
	);

    const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (dateFrom || dateTo) {
				setResetPaginationToggle(!resetPaginationToggle);
				setDateFrom('');
                setDateTo('');
			}
		};

		return (
			<div className="w-[70%] mt-[10px] flex justify-between">
                <div className="text-sm flex items-center">Lọc theo thời gian:</div>
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
        handleSetPage('Lịch sử giao dịch');
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

    const getOrderType = (status) => {
        if(status==='Gia hạn tin'){
            return <span className="text-yellow-700 font-medium">Gia hạn</span>
        }else if(status==='Hoàn trả tiền'){
            return <span className="text-red-500 font-medium">Hoàn trả</span>
        }else return <span className="text-teal-500 font-medium">Đăng tin</span>
    }

    useEffect(() => {
        axios.get(`${apiURL}customers/profile`, authorization(localStorage.getItem('token')))
            .then(res => setUser(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}orders`)
            .then(res => {
                const arr = [...res.data].reverse();
                setOrders(arr);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const arr = [];

        orders.map(order => {
            if(order.idCustomer===user._id){
                const row = {
                    id: order._id,
                    idOrder: <Link className="hover:text-teal-700" to={`/chi-tiet-giao-dich/${order._id}`}>{order._id}</Link>,
                    type: getOrderType(order.status),
                    orderDate: order.status==='Hoàn trả tiền' ? formatTime(order.approvalDate) : formatTime(order.orderDate),
                    totalCost: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalCost),
                }
                arr.push(row);
            }
        });

        setData(arr);

    }, [orders])

    return ( 
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
    );
}

export default TransactionHistory;