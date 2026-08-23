import { Component } from '@angular/core';
import { CategoryCard } from '../category-card/category-card';

@Component({
  selector: 'app-categories-home',
  imports: [CategoryCard],
  templateUrl: './categories-home.html',
  styleUrl: './categories-home.css',
})
export class CategoriesHome {
  path: string = 'assets/img/clothing/';
  categories: any[] = [
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
