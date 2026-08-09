import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductsSearch } from './components/products-search/products-search';
import { ProductsCarousel } from './components/products-carousel/products-carousel';
import { ProductDetails } from './components/product-details/product-details';
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
  { path: 'products-search', component: ProductsSearch },
  { path: 'products-carousel/:id', component: ProductsCarousel },
  { path: 'product-details/:id', component: ProductDetails },
  { path: 'add-product', component: AddProduct, canActivate: [adminGuard] },
  { path: 'edit-product/:id', component: AddProduct, canActivate: [adminGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [adminGuard] },
  { path: 'cart', component: Cart },
  { path: 'login', component: Login },
  { path: 'add-user', component: AddUser },
  { path: 'edit-user/:id', component: AddUser },
  { path: 'orders', component: Orders },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
];
