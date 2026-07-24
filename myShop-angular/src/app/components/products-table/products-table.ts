import { Component } from '@angular/core';
import { ProductsData } from '../../../data/products-data';

@Component({
  selector: 'app-products-table',
  imports: [],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css',
})
export class ProductsTable extends ProductsData {}
