import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductsSearch } from './components/products-search/products-search';
import { ProductsCarousel } from './components/products-carousel/products-carousel';
import { ProductView } from './components/product-view/product-view';
import { AddProduct } from './components/add-product/add-product';
import { Dashboard } from './components/dashboard/dashboard';
import { UserCart } from './components/user-cart/user-cart';
import { UserLogin } from './components/user-login/user-login';
import { AddUser } from './components/add-user/add-user';
import { AddOrder } from './components/add-order/add-order';
import { UserOrders } from './components/user-orders/user-orders';
import { AddMessage } from './components/add-message/add-message';
import { About } from './components/about/about';
import { adminGuard } from './guards/admin-guard';
import { UserView } from './components/user-view/user-view';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products-search', component: ProductsSearch },
  { path: 'products-carousel/:id', component: ProductsCarousel },
  { path: 'product-view/:id', component: ProductView },
  { path: 'add-product', component: AddProduct, canActivate: [adminGuard] },
  { path: 'edit-product/:id', component: AddProduct, canActivate: [adminGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [adminGuard] },
  { path: 'dashboard-product', component: Dashboard, canActivate: [adminGuard] },
  { path: 'dashboard-order', component: Dashboard, canActivate: [adminGuard] },
  { path: 'user-cart', component: UserCart },
  { path: 'user-login', component: UserLogin },
  { path: 'user-login-cart', component: UserLogin },
  { path: 'user-view/:id', component: UserView },
  { path: 'add-user', component: AddUser },
  { path: 'add-user-cart', component: AddUser },
  { path: 'edit-user/:id', component: AddUser },
  { path: 'edit-user-table/:id', component: AddUser },
  { path: 'add-order/:id', component: AddOrder },
  { path: 'user-orders/:id', component: UserOrders },
  { path: 'add-message', component: AddMessage },
  { path: 'about', component: About },
];
