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
  filteredName: Product[] = [];
  filteredItems: Product[] = [];
  searchNameSubject: Subject<string> = new Subject<string>();
  selectedType: number = -1;
  selectedCategory: number = -1;

  // Load the data and initialize the search function /////////////////////////

  // Initialize the product lists and the search function
  ngOnInit() {
    // Retrieve the products
    this.load();

    // Search for products by name
    this.searchNameSubject
      .pipe(
        map((name: string) => {
          const NAME = name.toLocaleLowerCase();
          return this.products.filter((product: Product) => {
            return product.name.toLowerCase().indexOf(NAME) === 0;
          });
        }),
      )
      .subscribe((res: Product[]) => {
        this.filteredName = res;
        this.filterSelect(); // Filter by product type and category
      });
  }

  // Retrieve all products
  load() {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res.sort((p1: Product, p2: Product) => {
          const COMPARE = p1.name.localeCompare(p2.name);
          return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
        });
        this.filteredName = structuredClone(this.products);
        this.filteredItems = structuredClone(this.products);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Set the focus in the product name search field
  ngAfterViewInit() {
    this.nameProducts?.nativeElement.focus();
  }

  // Search ///////////////////////////////////////////////////////////////////

  // Search for products by name
  searchNameItems(name: string) {
    this.searchNameSubject.next(name);
  }

  // Search for products by type
  selectTypeItems(select: any) {
    this.selectedType = Number(select.options[select.selectedIndex].value);
    this.filterSelect();
  }

  // Search for products by category
  selectCategoryItems(select: any) {
    this.selectedCategory = Number(select.options[select.selectedIndex].value);
    this.filterSelect();
  }

  // Filter by product type and category
  filterSelect() {
    switch (this.selectedType) {
      case -1:
        switch (this.selectedCategory) {
          case -1:
            this.filteredItems = this.filteredName;
            break;
          case 0:
            this.filteredItems = this.filteredName.filter(
              (product: Product) => product.categories.length === 0,
            );
            break;
          default:
            this.filteredItems = this.filteredName.filter((product: Product) =>
              product.categories.includes(this.selectedCategory),
            );
        }
        break;
      case 0:
        switch (this.selectedCategory) {
          case -1:
            this.filteredItems = this.filteredName.filter(
              (product: Product) => product.types.length === 0,
            );
            break;
          case 0:
            this.filteredItems = this.filteredName.filter(
              (product: Product) => product.types.length === 0 && product.categories.length === 0,
            );
            break;
          default:
            this.filteredItems = this.filteredName.filter(
              (product: Product) =>
                product.types.length === 0 && product.categories.includes(this.selectedCategory),
            );
        }
        break;
      default:
        switch (this.selectedCategory) {
          case -1:
            this.filteredItems = this.filteredName.filter((product: Product) =>
              product.types.includes(this.selectedType),
            );
            break;
          case 0:
            this.filteredItems = this.filteredName.filter(
              (product: Product) =>
                product.types.includes(this.selectedType) && product.categories.length === 0,
            );
            break;
          default:
            this.filteredItems = this.filteredName.filter(
              (product: Product) =>
                product.types.includes(this.selectedType) &&
                product.categories.includes(this.selectedCategory),
            );
        }
    }
  }

  // Actions //////////////////////////////////////////////////////////////////

  // View a product
  view(id: string) {
    this.router.navigate(['/product-view', id]);
  }
}
