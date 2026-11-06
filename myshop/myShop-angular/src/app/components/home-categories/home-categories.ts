import { Component } from '@angular/core';
import { CategoryList } from '../../models/category';
import { CategoryCard } from '../category-card/category-card';

@Component({
  selector: 'app-home-categories',
  imports: [CategoryCard],
  templateUrl: './home-categories.html',
  styleUrl: './home-categories.css',
})
export class HomeCategories {
  // Class properties
  categories: CategoryList = new CategoryList();
}
