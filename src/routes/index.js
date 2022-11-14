import Home from '../pages/Home';
import Category from '../pages/Category';
import Detail from '../pages/Detail';
import DetailPreview from '../pages/DetailPreview';
import Post from '../pages/Post';
import Payment from '../pages/Payment';
import TransactionDetail from '../pages/TransactionDetail';
import NotFound from '../pages/NotFound';
import AdsManage from '../pages/AdsManage';
import TransactionHistory from '../pages/TransactionHistory';
import AccountInfo from '../pages/AccountInfo';
import UpdatingAccount from '../pages/UpdatingAccount';
import DashboardLayout from '../components/Layouts/DashboardLayout';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/danh-muc/:category', component: Category },
    { path: '/dang-tin', component: Post },
    { path: '/thanh-toan/:idOrder', component: Payment },
    { path: '/chi-tiet-giao-dich/:idOrder', component: TransactionDetail },
    { path: '/chi-tiet/:title', component: Detail },
    { path: '/xem-truoc/:title', component: DetailPreview },
    { path: '/user/quan-ly-tin', component: AdsManage, layout: DashboardLayout },
    { path: '/user/lich-su-giao-dich', component: TransactionHistory, layout: DashboardLayout },
    { path: '/user/tai-khoan', component: AccountInfo, layout: DashboardLayout },
    { path: '/user/cap-nhat-tai-khoan', component: UpdatingAccount, layout: DashboardLayout },
    { path: '*', component: NotFound },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };