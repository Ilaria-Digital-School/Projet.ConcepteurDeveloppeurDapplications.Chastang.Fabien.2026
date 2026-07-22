import { Component } from '@angular/core';
import { Banner } from '../banner/banner';
import { Categories } from '../categories/categories';
import { Products } from '../products/products';
import { RemnantSale } from '../remnant-sale/remnant-sale';

@Component({
  selector: 'app-home',
  imports: [Banner, Categories, Products, RemnantSale],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
