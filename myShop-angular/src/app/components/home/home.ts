import { Component } from '@angular/core';
import { HomeBanner } from '../home-banner/home-banner';
import { CategoriesHome } from '../categories-home/categories-home';
import { ProductsHome } from '../products-home/products-home';
import { HomePromotion } from '../home-promotion/home-promotion';

@Component({
  selector: 'app-home',
  imports: [HomeBanner, CategoriesHome, ProductsHome, HomePromotion],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
