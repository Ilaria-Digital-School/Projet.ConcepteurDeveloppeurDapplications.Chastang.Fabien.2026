import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Common } from '../../constants/common';
import { Product } from '../../models/product';
import { DashboardHandle } from '../../models/dashboard';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-dashboard-products',
  imports: [],
  templateUrl: './dashboard-products.html',
  styleUrl: './dashboard-products.css',
})
export class DashboardProducts {
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

  // Load and search //////////////////////////////////////////////////////////

  // Initialize product lists and search functions
  ngOnInit() {
    // Load all products
    this.load();

    // Search for products by name
    this.dashboard.searchTextSubject
      .pipe(
        map((name: string) => {
          const NAME = name.toLocaleLowerCase();
          return this.dashboard.arrays.unfiltered.filter(
            (product: Product) => product.name.toLowerCase().indexOf(NAME) === 0,
          );
        }),
      )
      .subscribe((res: Product[]) => {
        this.dashboard.arrays.filteredText = res;
        this.dashboard.arrays.filteredTextRef = res.filter((product: Product) =>
          // Filter by product reference
          this.dashboard.arrays.filteredRef.some((item: Product) => item.id === product.id),
        );
        // Filter by product stock
        this.filterStock();
      });

    // Search for products by reference
    this.dashboard.searchRefSubject
      .pipe(
        map((reference: string) => {
          const REFERENCE = reference.toLocaleUpperCase();
          return this.dashboard.arrays.unfiltered.filter(
            (product: Product) => product.reference.indexOf(REFERENCE) === 0,
          );
        }),
      )
      .subscribe((res: Product[]) => {
        this.dashboard.arrays.filteredRef = res;
        this.dashboard.arrays.filteredTextRef = res.filter((product: Product) =>
          // Filter by product name
          this.dashboard.arrays.filteredText.some((item: Product) => item.id === product.id),
        );
        // Filter by product stock
        this.filterStock();
      });
  }

  // Retrieve all products
  load() {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        // All products
        this.dashboard.arrays.unfiltered = res.sort((p1: Product, p2: Product) => {
          const COMPARE = p1.name.localeCompare(p2.name);
          return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
        });
        this.dashboard.arrays.filteredText = this.dashboard.arrays.unfiltered;
        this.dashboard.arrays.filteredRef = this.dashboard.arrays.unfiltered;
        this.dashboard.arrays.filteredTextRef = this.dashboard.arrays.unfiltered;
        this.dashboard.arrays.filteredItems = this.dashboard.arrays.unfiltered;
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Filter by product stock
  filterStock() {
    if (this.dashboard.selectedValue === -1) {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredTextRef;
    } else if (this.dashboard.selectedValue >= 0) {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredTextRef.filter(
        (product: Product) => product.stock <= this.dashboard.selectedValue,
      );
    } else {
      this.dashboard.arrays.filteredItems = this.dashboard.arrays.filteredTextRef.filter(
        (product: Product) => product.stock > -this.dashboard.selectedValue,
      );
    }
  }

  // Search by product stock
  selectStock(select: any) {
    this.dashboard.selectedValue = Number(select.options[select.selectedIndex].value);
    this.filterStock();
  }

  // Sort /////////////////////////////////////////////////////////////////////

  // Initialize sorting
  ngAfterViewInit() {
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

  // Sort products by price
  sortByPrice(array: Product[], up: boolean): Product[] {
    if (up) {
      return array.sort((item1: Product, item2: Product) => item1.price - item2.price);
    } else {
      return array.sort((item1: Product, item2: Product) => item2.price - item1.price);
    }
  }

  // Sort products by stock
  sortByStock(array: Product[], up: boolean): Product[] {
    if (up) {
      return array.sort((item1: Product, item2: Product) => {
        const COMPARE = item1.stock - item2.stock;
        return COMPARE === 0 ? item1.name.localeCompare(item2.name) : COMPARE;
      });
    } else {
      return array.sort((item1: Product, item2: Product) => {
        const COMPARE = item2.stock - item1.stock;
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
    if (confirm(DashboardProducts.msgDelProduct)) {
      // Remove the product
      this.productService.deleteProduct(id).subscribe({
        next: (res: Product) => {
          // Refresh the product list without calling the server
          this.dashboard.arrays.unfiltered = this.dashboard.arrays.unfiltered.filter(
            (item: Product) => item.id !== id,
          );
          this.dashboard.arrays.filteredTextRef = this.dashboard.arrays.filteredTextRef.filter(
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
