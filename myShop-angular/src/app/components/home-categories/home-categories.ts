import { Component } from '@angular/core';
import { Category } from '../../types/common';
import { CategoryCard } from '../category-card/category-card';

@Component({
  selector: 'app-home-categories',
  imports: [CategoryCard],
  templateUrl: './home-categories.html',
  styleUrl: './home-categories.css',
})
export class HomeCategories {
  path: string = 'assets/img/clothing/';
  categories: Category[] = [
    {
      name: 'Femme',
      description: 'Mode Femme',
      img: `${this.path}women_s_fashion.png`,
    },
    {
      name: 'Homme',
      description: 'Mode Homme',
      img: `${this.path}men_s_fashion.png`,
    },
    {
      name: 'Enfant',
      description: 'Mode Enfant',
      img: `${this.path}children_s_fashion.png`,
    },
  ];
}
