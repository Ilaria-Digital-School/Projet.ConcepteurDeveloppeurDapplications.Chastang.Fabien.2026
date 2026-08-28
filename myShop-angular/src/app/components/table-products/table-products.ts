import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Common } from '../../constants/common';
import { Product } from '../../models/product';
import { DashboardHandle } from '../../models/dashboard';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-table-products',
  imports: [],
  templateUrl: './table-products.html',
  styleUrl: './table-products.css',
})
export class TableProducts {
  // To retrieve DOM elements
  @ViewChild('nameProducts') nameProducts!: ElementRef<HTMLInputElement>;
  @ViewChild('sortName') sortName!: ElementRef<HTMLElement>;
  @ViewChild('sortPrice') sortPrice!: ElementRef<HTMLElement>;
  @ViewChild('sortStock') sortStock!: ElementRef<HTMLElement>;

  // Constants
  public Common = Common;

  // Native classes / Application services
  private router = inject(Router);
  private productService = inject(ProductService);

  // Product messages
  private static msgDelProduct: string = 'Êtes-vous sûr de vouloir supprimer cet article ?';

  // Class properties grouped in the 'DashboardHandle' class
  dashboard: DashboardHandle<Product> = new DashboardHandle<Product>();

  // Initialization //////////////////////////////////////////////////////

  ngOnInit() {
    // Load all products
    this.load();

    // Search for products by name
    this.dashboard.searchByTextSubject
      .pipe(
        map((name: string) => {
          const NAME = name.toLocaleLowerCase();
          return this.dashboard.arrays.unfiltered.filter(
            (product: Product) => product.name.toLowerCase().indexOf(NAME) === 0,
          );
        }),
      )
      .subscribe((res: Product[]) => {
        this.dashboard.arrays.filteredByText = res;
        this.dashboard.arrays.filteredText = res.filter((product: Product) =>
          // Filter by product reference
          this.dashboard.arrays.filteredByRef.some((item: Product) => item.id === product.id),
        );
        this.dashboard.filterByValue(); // Filter by product stock
      });

    // Search for products by reference
    this.dashboard.searchByRefSubject
      .pipe(
        map((reference: string) => {
          const REFERENCE = reference.toLocaleUpperCase();
          return this.dashboard.arrays.unfiltered.filter(
            (product: Product) => product.reference.indexOf(REFERENCE) === 0,
          );
        }),
      )
      .subscribe((res: Product[]) => {
        this.dashboard.arrays.filteredByRef = res;
        this.dashboard.arrays.filteredText = res.filter((product: Product) =>
          // Filter by product name
          this.dashboard.arrays.filteredByText.some((item: Product) => item.id === product.id),
        );
        this.dashboard.filterByValue(); // Filter by product stock
      });
  }

  ngAfterViewInit() {
    // Initialize the filter method
    this.dashboard.filterByValue = this.filterByStock;

    // Defines the sorting elements: here, all attributes are fixed
    this.dashboard.sortElements = [
      { col: 'name', up: true, func: this.sortByName, HTMLCol: this.sortName.nativeElement },
      { col: 'price', up: true, func: this.sortByPrice, HTMLCol: this.sortPrice.nativeElement },
      { col: 'stock', up: true, func: this.sortByStock, HTMLCol: this.sortStock.nativeElement },
    ];

    // Defines the sorting variables: 'sort' and/or 'up' are updated each time a sort is performed
    this.dashboard.sortVariables = [
      { col: 'name', sort: true, up: true },
      { col: 'price', sort: false, up: true },
      { col: 'stock', sort: false, up: true },
    ];
  }

  // Load and filter //////////////////////////////////////////////////////////

  // Retrieve all products
  load() {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        // All products
        this.dashboard.arrays.unfiltered = res.sort((p1: Product, p2: Product) => {
          const COMPARE = p1.name.localeCompare(p2.name);
          return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
        });
        this.dashboard.arrays.filteredByText = structuredClone(this.dashboard.arrays.unfiltered);
        this.dashboard.arrays.filteredByRef = structuredClone(this.dashboard.arrays.unfiltered);
        this.dashboard.arrays.filteredText = structuredClone(this.dashboard.arrays.unfiltered);
        this.dashboard.arrays.filteredItems = structuredClone(this.dashboard.arrays.unfiltered);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Filter by product stock
  filterByStock() {
    if (this.dashboard.selectedValue === -1) {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredText;
    } else if (this.dashboard.selectedValue >= 0) {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredText.filter(
        (product: Product) =>
          product.stock !== undefined && product.stock <= this.dashboard.selectedValue,
      );
    } else {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredText.filter(
        (product: Product) =>
          product.stock !== undefined && product.stock > -this.dashboard.selectedValue,
      );
    }
  }

  // Sort /////////////////////////////////////////////////////////////////////

  // Sort products by name (default)
  sortByName(array: Product[], up: boolean): Product[] {
    if (up) {
      return array.sort((item1: Product, item2: Product) => {
        const COMPARE = item1.name.localeCompare(item2.name);
        return COMPARE === 0 ? item1.description.localeCompare(item2.description) : COMPARE;
      });
    } else {
      return array.sort((item1: Product, item2: Product) => {
        const COMPARE = item2.name.localeCompare(item1.name);
        return COMPARE === 0 ? item2.description.localeCompare(item1.description) : COMPARE;
      });
    }
  }

  // Sort products by name
  sortByPrice(array: Product[], up: boolean): Product[] {
    if (up) {
      return array.sort((item1: Product, item2: Product) => item1.price - item2.price);
    } else {
      return array.sort((item1: Product, item2: Product) => item2.price - item1.price);
    }
  }

  // Sort products by name
  sortByStock(array: Product[], up: boolean): Product[] {
    if (up) {
      return array.sort((item1: Product, item2: Product) => {
        const COMPARE =
          (typeof item1.stock === 'number' ? item1.stock : 0) -
          (typeof item2.stock === 'number' ? item2.stock : 0);
        return COMPARE === 0 ? item1.name.localeCompare(item2.name) : COMPARE;
      });
    } else {
      return array.sort((item1: Product, item2: Product) => {
        const COMPARE =
          (typeof item2.stock === 'number' ? item2.stock : 0) -
          (typeof item1.stock === 'number' ? item1.stock : 0);
        return COMPARE === 0 ? item2.name.localeCompare(item1.name) : COMPARE;
      });
    }
  }

  // Actions //////////////////////////////////////////////////////////////////

  // View a product
  view(id: string) {
    this.router.navigate(['/product-view', id]);
  }

  // Edit a product
  edit(id: string) {
    this.router.navigate(['/edit-product', id]);
  }

  // Delete a product
  remove(id: string) {
    // Confirmaton message to delete the product
    if (confirm(TableProducts.msgDelProduct)) {
      // Remove the product
      this.productService.deleteProduct(id).subscribe({
        next: (res: Product) => {
          // Refresh the product list without calling the server
          this.dashboard.arrays.unfiltered = this.dashboard.arrays.unfiltered.filter(
            (item: Product) => item.id !== id,
          );
          this.dashboard.arrays.filteredText = this.dashboard.arrays.filteredText.filter(
            (item: Product) => item.id !== id,
          );
          this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredItems.filter(
            (item: Product) => item.id !== id,
          );
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la suppression.");
          console.log(err);
        },
      });
    }
  }
}
