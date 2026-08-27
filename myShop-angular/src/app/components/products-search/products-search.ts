import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../../services/product-service';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { ProductTypes } from '../../constants/product-types';
import { ProductCategories } from '../../constants/product-categories';

@Component({
  selector: 'app-products-search',
  imports: [ProductCard],
  templateUrl: './products-search.html',
  styleUrl: './products-search.css',
})
export class ProductsSearch {
  // Constants
  public ProductTypes = ProductTypes;
  public ProductCategories = ProductCategories;

  // To retrieve DOM elements
  @ViewChild('nameProducts') nameProducts!: ElementRef<HTMLInputElement>;

  // Native classes / Application services
  private router = inject(Router);
  private productService = inject(ProductService);

  // Class properties
  products: Product[] = [];
  filteredItems: Product[] = [];
  filteredText: Product[] = [];
  searchByNameSubject: Subject<string> = new Subject<string>();
  selectedType: number = -1;
  selectedCategory: number = -1;

  // Initialization //////////////////////////////////////////////////////

  // Initialize the product list
  ngOnInit() {
    // Retrieve the products
    this.load();

    // Search for products by name
    this.searchByNameSubject
      .pipe(
        map((name: string) => {
          const NAME = name.toLocaleLowerCase();
          return this.products.filter((product: Product) => {
            return product.name.toLowerCase().indexOf(NAME) === 0;
          });
        }),
      )
      .subscribe((res: Product[]) => {
        this.filteredText = res;
        this.filterSelect(); // Filter by product type and category
      });
  }

  ngAfterViewInit() {
    this.nameProducts?.nativeElement.focus();
  }

  // Load and filter //////////////////////////////////////////////////////////

  // Retrieve the products
  load() {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res.sort((p1: Product, p2: Product) => {
          const COMPARE = p1.name.localeCompare(p2.name);
          return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
        });
        this.filteredText = structuredClone(this.products);
        this.filteredItems = structuredClone(this.products);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Filter by product type and category
  filterSelect() {
    switch (this.selectedType) {
      case -1:
        switch (this.selectedCategory) {
          case -1:
            this.filteredItems = this.filteredText;
            break;
          case 0:
            this.filteredItems = this.filteredText.filter(
              (product: Product) => product.categories.length === 0,
            );
            break;
          default:
            this.filteredItems = this.filteredText.filter((product: Product) =>
              product.categories.includes(this.selectedCategory),
            );
        }
        break;
      case 0:
        switch (this.selectedCategory) {
          case -1:
            this.filteredItems = this.filteredText.filter(
              (product: Product) => product.types.length === 0,
            );
            break;
          case 0:
            this.filteredItems = this.filteredText.filter(
              (product: Product) => product.types.length === 0 && product.categories.length === 0,
            );
            break;
          default:
            this.filteredItems = this.filteredText.filter(
              (product: Product) =>
                product.types.length === 0 && product.categories.includes(this.selectedCategory),
            );
        }
        break;
      default:
        switch (this.selectedCategory) {
          case -1:
            this.filteredItems = this.filteredText.filter((product: Product) =>
              product.types.includes(this.selectedType),
            );
            break;
          case 0:
            this.filteredItems = this.filteredText.filter(
              (product: Product) =>
                product.types.includes(this.selectedType) && product.categories.length === 0,
            );
            break;
          default:
            this.filteredItems = this.filteredText.filter(
              (product: Product) =>
                product.types.includes(this.selectedType) &&
                product.categories.includes(this.selectedCategory),
            );
        }
    }
  }

  // Search ///////////////////////////////////////////////////////////////////

  // Search for products by name
  searchNameItems(name: string) {
    this.searchByNameSubject.next(name);
  }

  // Search for users by role
  selectTypeItems(select: any) {
    this.selectedType = Number(select.options[select.selectedIndex].value);
    this.filterSelect();
  }

  // Search for users by role
  selectCategoryItems(select: any) {
    this.selectedCategory = Number(select.options[select.selectedIndex].value);
    this.filterSelect();
  }

  // Actions //////////////////////////////////////////////////////////////////

  // View a product
  view(id: string) {
    this.router.navigate(['/product-view', id]);
  }
}
