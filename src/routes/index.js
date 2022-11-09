import Home from '../pages/Home';
import Category from '../pages/Category';
import Detail from '../pages/Detail';
import Post from '../pages/Post';
import Payment from '../pages/Payment';
import NotFound from '../pages/NotFound';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/danh-muc/:category', component: Category },
    { path: '/dang-tin', component: Post },
    { path: '/thanh-toan/:idOrder', component: Payment },
    { path: '/chi-tiet/:title', component: Detail },
    { path: '*', component: NotFound },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };