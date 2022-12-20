import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { FaWindowClose } from "react-icons/fa";
import { apiURL } from "../../config";
import PopupUserInfo from "../../components/Popups/PopupUserInfo";

const columns = [
    {
        name: 'Ảnh đại diện',
        selector: row => row.avatar,
        width: '120px',
    },
    {
        name: 'Tên người dùng',
        selector: row => row.name,
        sortable: true,
        width: '226px',
    },
    {
        name: 'Email',
        selector: row => row.email,
        sortable: true,
        width: '226px',
    },
    {
        name: 'Ngày tạo',
        selector: row => row.createdAt,
        sortable: true,
        width: '150px',
    },
    {
        name: '',
        selector: row => row.manage,
        width: '80px',
    },
];

// const data = [];

const paginationComponentOptions = {
    rowsPerPageText: 'Số dòng hiển thị',
    rangeSeparatorText: 'trong số',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tất cả',
};

function UsersManage({ handleSetPage }) {
    const [ users, setUsers ] = useState([]);
    const [ idUser, setIdUser ] = useState('');
    const [ showPopupUserInfo, setShowPopupUserInfo ] = useState(false);

    //Data table
    const [ data, setData ] = useState([]);

    //Filtering table*******************
    const [filterText, setFilterText] = useState('');
    // const [dateFrom, setDateFrom] = useState('');
    // const [dateTo, setDateTo] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const filteredItems = data.filter(
		item => {
            return item.email && item.email.toLowerCase().includes(filterText.toLowerCase())
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
			// <div className="w-[70%] mt-[10px] flex justify-between">
            //     <div className="text-sm flex items-center">Lọc theo thời gian:</div>
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
            
            <div className="relative w-[40%] mt-[10px]">
                <input 
                className="w-full text-sm appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                type='text' 
                placeholder="Lọc theo email" 
                onChange={e => setFilterText(e.target.value)} 
                value={filterText} 
                />
                <FaWindowClose onClick={handleClear} className="absolute top-[2px] right-0 text-2xl rounded text-teal-500 cursor-pointer" />
            </div>
		);
	}, [filterText, resetPaginationToggle]);
    //*******************Filtering table

    useEffect(() => {
        handleSetPage('Quản lý người dùng');
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
        axios.get(`${apiURL}customers`)
            .then(res => {
                const arr = [...res.data].reverse();
                setUsers(arr);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const arr = [];

        users.map(user => {
            const row = {
                id: user._id,
                avatar: <img className="cursor-pointer w-[50px] h-[50px] rounded-full object-cover" onClick={() => {setShowPopupUserInfo(true); setIdUser(user._id)}} src={user.avatar} alt='' />,
                name: <div className="cursor-pointer hover:text-teal-700" onClick={() => {setShowPopupUserInfo(true); setIdUser(user._id)}}>{user.name}</div>,
                email: user.email,
                createdAt: formatTime(user.createdAt),
                manage: <div className="text-red-500 cursor-pointer hover:text-red-700">Xóa</div>,
            }
            arr.push(row);
        });

        setData(arr);

    }, [users])

    return ( 
        <div>
            {showPopupUserInfo && <PopupUserInfo handleShowPopupUserInfo={setShowPopupUserInfo} idUser={idUser} />}
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

export default UsersManage;