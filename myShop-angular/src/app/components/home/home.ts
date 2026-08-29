import { Component } from '@angular/core';
import { HomeBanner } from '../home-banner/home-banner';
import { HomeCategories } from '../home-categories/home-categories';
import { HomeProducts } from '../home-products/home-products';
import { HomePromotion } from '../home-promotion/home-promotion';

@Component({
  selector: 'app-home',
  imports: [HomeBanner, HomeCategories, HomeProducts, HomePromotion],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
