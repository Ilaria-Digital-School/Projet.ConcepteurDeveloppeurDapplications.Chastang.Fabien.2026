import { Component } from '@angular/core';
import { Banner } from '../banner/banner';
import { CategoriesHome } from '../categories-home/categories-home';
import { ProductsHome } from '../products-home/products-home';
import { Promotion } from '../promotion/promotion';

@Component({
  selector: 'app-home',
  imports: [Banner, CategoriesHome, ProductsHome, Promotion],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
