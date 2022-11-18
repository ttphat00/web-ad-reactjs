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
import UpdatingAd from '../pages/UpdatingAd';
import ExtendedAdPayment from '../pages/ExtendedAdPayment';
import Search from '../pages/Search';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import AdminLayout from '../components/Layouts/AdminLayout';
import UsersManage from '../pages/UsersManage';
import CategoriesManage from '../pages/CategoriesManage';
import TransactionManage from '../pages/TransactionManage';
import AdminAdsManage from '../pages/AdminAdsManage';
import AdminLogin from '../pages/AdminLogin';
import NullLayout from '../components/Layouts/NullLayout';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/danh-muc/:category', component: Category },
    { path: '/dang-tin', component: Post },
    { path: '/thanh-toan/:idOrder', component: Payment },
    { path: '/gia-han/:idOrder', component: ExtendedAdPayment },
    { path: '/chi-tiet-giao-dich/:idOrder', component: TransactionDetail },
    { path: '/chi-tiet/:title', component: Detail },
    { path: '/xem-truoc/:title', component: DetailPreview },
    { path: '/tim-kiem/:keyWord', component: Search },
    { path: '/user/quan-ly-tin', component: AdsManage, layout: DashboardLayout },
    { path: '/user/lich-su-giao-dich', component: TransactionHistory, layout: DashboardLayout },
    { path: '/user/tai-khoan', component: AccountInfo, layout: DashboardLayout },
    { path: '/user/cap-nhat-tai-khoan', component: UpdatingAccount, layout: DashboardLayout },
    { path: '/user/cap-nhat-tin/:idAd', component: UpdatingAd },
    { path: '/admin/dang-nhap', component: AdminLogin, layout: NullLayout },
    { path: '/admin/quan-ly-nguoi-dung', component: UsersManage, layout: AdminLayout },
    { path: '/admin/quan-ly-danh-muc', component: CategoriesManage, layout: AdminLayout },
    { path: '/admin/quan-ly-giao-dich', component: TransactionManage, layout: AdminLayout },
    { path: '/admin/quan-ly-tin', component: AdminAdsManage, layout: AdminLayout },
    { path: '*', component: NotFound },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };