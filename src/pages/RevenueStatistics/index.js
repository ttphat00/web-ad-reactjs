import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { apiURL } from "../../config";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function RevenueStatistics({ handleSetPage }) {
    const [ tab, setTab ] = useState('Theo tuần');
    const [ labels, setLabels ] = useState([]);
    const [ text, setText ] = useState('');
    const [ data, setData ] = useState([]);
    const [ orders, setOrders ] = useState([]);

    useEffect(() => {
        handleSetPage('Thống kê doanh thu');
    }, [])

    const isOnThisWeek = (time) => {
        const today = new Date();
        let startDate = new Date();
        let endDate = new Date();

        if(today.getDay()===1){
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            today.setDate(today.getDate() + 6);
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }else if(today.getDay()===2){
            today.setDate(today.getDate() - 1);
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            today.setDate(today.getDate() + 6);
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }else if(today.getDay()===3){
            today.setDate(today.getDate() - 2);
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            today.setDate(today.getDate() + 6);
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }else if(today.getDay()===4){
            today.setDate(today.getDate() - 3);
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            today.setDate(today.getDate() + 6);
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }else if(today.getDay()===5){
            today.setDate(today.getDate() - 4);
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            today.setDate(today.getDate() + 6);
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }else if(today.getDay()===6){
            today.setDate(today.getDate() - 5);
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            today.setDate(today.getDate() + 6);
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }else if(today.getDay()===0){
            today.setDate(today.getDate() - 6);
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            today.setDate(today.getDate() + 6);
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }

        return startDate <= time && time <= endDate;
    }

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

        if(tab==='Theo tuần'){
            setLabels(['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']);
            setText('Biểu đồ thống kê doanh thu trong tuần này');
            let monday = 0;
            let tuesday = 0;
            let wednesday = 0;
            let thursday = 0;
            let friday = 0;
            let saturday = 0;
            let sunday = 0;
            orders.map(order => {
                if(order.status==='Chấp nhận' || order.status==='Gia hạn tin' || order.status==='Tin đã xóa' || order.status==='Bị từ chối'){
                    const orderDate = new Date(order.orderDate);
                    orderDate.setHours(orderDate.getHours() - 7);
                    if(isOnThisWeek(orderDate) && orderDate.getDay()===1){
                        monday += order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===2){
                        tuesday += order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===3){
                        wednesday += order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===4){
                        thursday += order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===5){
                        friday += order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===6){
                        saturday += order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===0){
                        sunday += order.totalCost;
                    }
                }else if(order.status==='Hoàn trả tiền'){
                    const orderDate = new Date(order.orderDate);
                    orderDate.setHours(orderDate.getHours() - 7);
                    if(isOnThisWeek(orderDate) && orderDate.getDay()===1){
                        monday -= order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===2){
                        tuesday -= order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===3){
                        wednesday -= order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===4){
                        thursday -= order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===5){
                        friday -= order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===6){
                        saturday -= order.totalCost;
                    }else if(isOnThisWeek(orderDate) && orderDate.getDay()===0){
                        sunday -= order.totalCost;
                    }
                }
            });
            arr.push(monday);
            arr.push(tuesday);
            arr.push(wednesday);
            arr.push(thursday);
            arr.push(friday);
            arr.push(saturday);
            arr.push(sunday);
        }else if(tab==='Theo tháng'){
            setLabels(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
            setText('Biểu đồ thống kê doanh thu theo tháng trong năm nay');
            let jan = 0;
            let feb = 0;
            let mar = 0;
            let apr = 0;
            let may = 0;
            let jun = 0;
            let jul = 0;
            let aug = 0;
            let sep = 0;
            let oct = 0;
            let nov = 0;
            let dec = 0;
            const today = new Date();
            orders.map(order => {
                if(order.status==='Chấp nhận' || order.status==='Gia hạn tin' || order.status==='Tin đã xóa' || order.status==='Bị từ chối'){
                    const orderDate = new Date(order.orderDate);
                    orderDate.setHours(orderDate.getHours() - 7);
                    if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===0){
                        jan += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===1){
                        feb += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===2){
                        mar += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===3){
                        apr += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===4){
                        may += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===5){
                        jun += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===6){
                        jul += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===7){
                        aug += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===8){
                        sep += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===9){
                        oct += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===10){
                        nov += order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===11){
                        dec += order.totalCost;
                    }
                }else if(order.status==='Hoàn trả tiền'){
                    const orderDate = new Date(order.orderDate);
                    orderDate.setHours(orderDate.getHours() - 7);
                    if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===0){
                        jan -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===1){
                        feb -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===2){
                        mar -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===3){
                        apr -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===4){
                        may -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===5){
                        jun -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===6){
                        jul -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===7){
                        aug -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===8){
                        sep -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===9){
                        oct -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===10){
                        nov -= order.totalCost;
                    }else if(orderDate.getFullYear()===today.getFullYear() && orderDate.getMonth()===11){
                        dec -= order.totalCost;
                    }
                }
            });
            arr.push(jan);
            arr.push(feb);
            arr.push(mar);
            arr.push(apr);
            arr.push(may);
            arr.push(jun);
            arr.push(jul);
            arr.push(aug);
            arr.push(sep);
            arr.push(oct);
            arr.push(nov);
            arr.push(dec);
        }else if(tab==='Theo năm'){
            setText('Biểu đồ thống kê doanh thu qua các năm');

            const today = new Date();
            const years = [];
            
            for(let i=2018; i<=today.getFullYear(); i++){
                years.push(i);
            }

            setLabels(years);

            for(let i=2018; i<=today.getFullYear(); i++){
                let year = 0;
                orders.map(order => {
                    if(order.status==='Chấp nhận' || order.status==='Gia hạn tin' || order.status==='Tin đã xóa' || order.status==='Bị từ chối'){
                        const orderDate = new Date(order.orderDate);
                        orderDate.setHours(orderDate.getHours() - 7);
                        if(orderDate.getFullYear()===i){
                            year += order.totalCost;
                        }
                    }else if(order.status==='Hoàn trả tiền'){
                        const orderDate = new Date(order.orderDate);
                        orderDate.setHours(orderDate.getHours() - 7);
                        if(orderDate.getFullYear()===i){
                            year -= order.totalCost;
                        }
                    }
                });
                arr.push(year);
            }
        }

        setData(arr);

    }, [orders, tab])

    return ( 
        <div>
            <div className="flex border-b-[1px] border-gray-200 text-sm">
                <div onClick={() => setTab('Theo tuần')} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Theo tuần',
                    'border-teal-500': tab === 'Theo tuần',
                    'hover:text-black': tab !== 'Theo tuần',
                    'text-gray-500': tab !== 'Theo tuần'
                })}>
                    Theo tuần
                </div>
                <div onClick={() => setTab('Theo tháng')} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Theo tháng',
                    'border-teal-500': tab === 'Theo tháng',
                    'hover:text-black': tab !== 'Theo tháng',
                    'text-gray-500': tab !== 'Theo tháng'
                })}>
                    Theo tháng
                </div>
                <div onClick={() => setTab('Theo năm')} className={clsx("py-1 cursor-pointer mr-10", {
                    'border-b-[3px]': tab === 'Theo năm',
                    'border-teal-500': tab === 'Theo năm',
                    'hover:text-black': tab !== 'Theo năm',
                    'text-gray-500': tab !== 'Theo năm'
                })}>
                    Theo năm
                </div>
            </div>
            <div className="py-4">
                <Line
                    data={{
                        labels,
                        datasets: [
                            {
                                label: 'Doanh thu',
                                data: data,
                                borderColor: 'rgb(53, 162, 235)',
                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                // fill: false,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: text,
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default RevenueStatistics;