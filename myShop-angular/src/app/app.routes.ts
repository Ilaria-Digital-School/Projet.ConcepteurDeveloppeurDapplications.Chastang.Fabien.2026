import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Products } from './components/products/products';
import { Dashboard } from './components/dashboard/dashboard';
import { AddProduct } from './components/add-product/add-product';
import { Cart } from './components/cart/cart';
import { Login } from './components/login/login';
import { AddUser } from './components/add-user/add-user';
import { Orders } from './components/orders/orders';
import { Contact } from './components/contact/contact';
import { About } from './components/about/about';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'products', component: Products},
    {path: 'dashboard', component: Dashboard},
    {path: 'add-product', component: AddProduct},
    {path: 'cart', component: Cart},
    {path: 'login', component: Login},
    {path: 'add-user', component: AddUser},
    {path: 'orders', component: Orders},
    {path: 'contact', component: Contact},
    {path: 'about', component: About}
];
