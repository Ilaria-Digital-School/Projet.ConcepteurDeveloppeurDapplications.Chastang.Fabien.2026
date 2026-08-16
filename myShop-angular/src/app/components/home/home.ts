import { Component } from '@angular/core';
import { Banner } from '../banner/banner';
import { Categories } from '../categories/categories';
import { Products } from '../products/products';
import { Promotion } from '../promotion/promotion';

@Component({
  selector: 'app-home',
  imports: [Banner, Categories, Products, Promotion],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
