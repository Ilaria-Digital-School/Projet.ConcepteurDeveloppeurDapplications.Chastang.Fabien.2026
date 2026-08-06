import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Products } from './components/products/products';
import { ProductView } from './components/product-view/product-view';
import { AddProduct } from './components/add-product/add-product';
import { Dashboard } from './components/dashboard/dashboard';
import { Cart } from './components/cart/cart';
import { Login } from './components/login/login';
import { AddUser } from './components/add-user/add-user';
import { Orders } from './components/orders/orders';
import { Contact } from './components/contact/contact';
import { About } from './components/about/about';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products/:search', component: Products },
  { path: 'product-view/:id', component: ProductView },
  { path: 'add-product', component: AddProduct, canActivate: [adminGuard] },
  { path: 'product-edit/:id', component: AddProduct, canActivate: [adminGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [adminGuard] },
  { path: 'cart', component: Cart },
  { path: 'login', component: Login },
  { path: 'add-user', component: AddUser },
  { path: 'user-edit/:id', component: AddUser },
  { path: 'orders', component: Orders },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
];
