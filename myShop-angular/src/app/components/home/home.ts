import { Component } from '@angular/core';
import { Banner } from '../banner/banner';
import { Categories } from '../categories/categories';
import { ProductsHome } from '../products-home/products-home';
import { Promotion } from '../promotion/promotion';

@Component({
  selector: 'app-home',
  imports: [Banner, Categories, ProductsHome, Promotion],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
