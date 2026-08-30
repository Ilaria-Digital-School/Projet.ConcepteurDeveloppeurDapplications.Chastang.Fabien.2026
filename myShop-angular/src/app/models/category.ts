import { inject } from '@angular/core';
import { CategoryService } from '../services/category-service';

// Category class
export class Category {
  id: string = '';
  value: number = 0;
  field: string = '';
  name: string = '';
  description: string = '';
  img: string = '';

  constructor(
    id: string | null = null,
    value: number | null = null,
    field: string | null = null,
    name: string | null = null,
    description: string | null = null,
    img: string | null = null,
  ) {
    if (typeof id === 'string') this.id = id;
    if (typeof value === 'number') this.value = value;
    if (typeof field === 'string') this.field = field;
    if (typeof name === 'string') this.name = name;
    if (typeof description === 'string') this.description = description;
    if (typeof img === 'string') this.img = img;
  }
}

// Class to handle the category list
export class CategoryList {
  private categoryService = inject(CategoryService);
  private categories: Category[] = [];

  constructor() {
    // Retrieve all categories
    this.categoryService.getAllCategories().subscribe({
      next: (res: Category[]) => {
        this.categories = res;
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Returns the category list
  getAll(): Category[] {
    return this.categories;
  }

  // Returns a category by its value
  getByValue(value: number): Category | undefined {
    return this.categories.find((category: Category) => category.value === value);
  }

  // Returns a category by its field
  getByField(field: string): Category | undefined {
    return this.categories.find((category: Category) => category.field === field);
  }
}
