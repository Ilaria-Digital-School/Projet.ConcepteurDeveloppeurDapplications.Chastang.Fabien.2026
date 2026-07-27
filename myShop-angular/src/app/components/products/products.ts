import { Component } from '@angular/core';
import { ProductsData } from '../../../assets/ts/products-data';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products extends ProductsData {}
