import { Component } from '@angular/core';
import { CategoryCard } from '../category-card/category-card';

@Component({
  selector: 'app-categories',
  imports: [CategoryCard],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categories: any[] = [
    { name: 'Femme', description: 'Mode Femme', img: '/assets/img/clothing/women_s_fashion.png' },
    { name: 'Homme', description: 'Mode Homme', img: '/assets/img/clothing/men_s_fashion.png' },
    {
      name: 'Enfant',
      description: 'Mode Enfant',
      img: '/assets/img/clothing/children_s_fashion.png',
    },
  ];
}
