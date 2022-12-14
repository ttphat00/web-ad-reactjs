import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { FaWindowClose } from "react-icons/fa";
import { apiURL } from "../../config";
import PopupAddCategory from "../../components/Popups/PopupAddCategory";
import PopupEditCategory from "../../components/Popups/PopupEditCategory";
import SuccessNotification from "../../components/Notification/SuccessNotification";

const columns = [
    {
        name: '',
        selector: row => row.image,
        width: '100px',
    },
    {
        name: 'Tên danh mục',
        selector: row => row.title,
        sortable: true,
        width: '552px',
    },
    {
        name: '',
        selector: row => row.manage,
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

function CategoriesManage({ handleSetPage }) {
    const [ categories, setCategories ] = useState([]);
    const [ showPopupAddCategory, setShowPopupAddCategory ] = useState(false);
    const [ showPopupEditCategory, setShowPopupEditCategory ] = useState(false);
    const [ idCategory, setIdCategory ] = useState('');
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);

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
            
            <div className="relative w-[60%] mt-[10px] flex">
                <div className="flex items-center justify-between text-sm mr-4">
                    <button onClick={() => setShowPopupAddCategory(true)} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline w-[150px]" type="button">
                        Thêm danh mục
                    </button>
                </div>
                <input 
                className="w-full text-sm appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                type='text' 
                placeholder="Lọc theo tên" 
                onChange={e => setFilterText(e.target.value)} 
                value={filterText} 
                />
                <FaWindowClose onClick={handleClear} className="absolute top-[2px] right-0 text-2xl rounded text-teal-500 cursor-pointer" />
            </div>
		);
	}, [filterText, resetPaginationToggle]);
    //*******************Filtering table

    useEffect(() => {
        handleSetPage('Quản lý danh mục');
    }, [])

    useEffect(() => {
        axios.get(`${apiURL}categories`)
            .then(res => {
                const arr = [...res.data].reverse();
                setCategories(arr);
            })
            .catch(err => console.log(err))
    }, [showSuccessNotification])

    const handleDelete = async (id) => {
        if(window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')){
            try {
                const ads = await axios.get(`${apiURL}ads`)
                for(let i=0; i<ads.data.length; i++){
                    if(ads.data[i].idCategory===id){
                        window.alert('Danh mục này có chứa tin quảng cáo nên bạn không thể xóa danh mục này!');
                        return;
                    }
                }
                const res = await axios.delete(`${apiURL}categories/${id}`)
                console.log('Danh muc da bi xoa');

                setShowSuccessNotification(true);

                setTimeout(() => {
                    setShowSuccessNotification(false);
                }, 5000);
            } catch (err) {
                console.log(err);
            }

            // axios.get(`${apiURL}ads`)
            //     .then(res => {
            //         for(let i=0; i<res.data.length; i++){
            //             if(res.data[i].idCategory===id){
            //                 window.alert('Danh mục này có chứa tin quảng cáo nên bạn không thể xóa danh mục này!');
            //                 return;
            //             }
            //         }
            //         return axios.delete(`${apiURL}categories/${id}`)
            //     })
            //     .then(res => {
            //         console.log('Danh muc da bi xoa');

            //         setShowSuccessNotification(true);

            //         setTimeout(() => {
            //             setShowSuccessNotification(false);
            //         }, 5000);
            //     })
            //     .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        const arr = [];

        categories.map(category => {
            const row = {
                id: category._id,
                image: <img className="w-[50px] h-[50px] object-contain" src={category.image} alt='' />,
                title: category.title,
                manage: <div className="flex">
                    <div onClick={() => {setShowPopupEditCategory(true); setIdCategory(category._id);}} className="cursor-pointer mr-3 text-blue-500 hover:text-blue-700">Sửa</div>
                    <div onClick={() => handleDelete(category._id)} className="cursor-pointer text-red-500 hover:text-red-700">Xóa</div>
                </div>,
            }
            arr.push(row);
        });

        setData(arr);

    }, [categories])

    return ( 
        <div>
            {showSuccessNotification && <SuccessNotification />}
            {showPopupAddCategory && <PopupAddCategory handleShowPopupAddCategory={setShowPopupAddCategory} handleShowSuccessNotification={setShowSuccessNotification} />}
            {showPopupEditCategory && <PopupEditCategory handleShowPopupEditCategory={setShowPopupEditCategory} handleShowSuccessNotification={setShowSuccessNotification} id={idCategory} />}
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

export default CategoriesManage;