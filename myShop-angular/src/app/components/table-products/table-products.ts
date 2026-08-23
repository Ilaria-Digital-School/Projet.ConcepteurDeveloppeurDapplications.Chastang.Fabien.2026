import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product-service';
import { Common } from '../../constants/common';
import { map, Subject } from 'rxjs';

@Component({
  selector: 'app-table-products',
  imports: [],
  templateUrl: './table-products.html',
  styleUrl: './table-products.css',
})
export class TableProducts {
  // To retrieve DOM elements
  @ViewChild('nameProducts') nameProducts!: ElementRef<HTMLInputElement>;

  // Constants
  public Common = Common;

  // Native classes / Application services
  private router = inject(Router);
  private productService = inject(ProductService);

  // Product messages
  private static msgDelProduct: string = 'Êtes-vous sûr de vouloir supprimer cet article ?';

  // Class properties
  products: Product[] = [];
  filteredItems: Product[] = [];
  filteredText: Product[] = [];
  filteredByName: Product[] = [];
  filteredByRef: Product[] = [];
  searchByNameSubject: Subject<string> = new Subject<string>();
  searchByRefSubject: Subject<string> = new Subject<string>();
  selectedStock: number = -1;

  // Initialization //////////////////////////////////////////////////////

  ngOnInit() {
    // Load all products
    this.load();

    // Search for products by name
    this.searchByNameSubject
      .pipe(
        map((name: string) => {
          const NAME = name.toLocaleLowerCase();
          return this.products.filter(
            (product: Product) => product.name.toLowerCase().indexOf(NAME) === 0,
          );
        }),
      )
      .subscribe((res: Product[]) => {
        this.filteredByName = res;
        this.filteredText = res.filter((product: Product) =>
          // Filter by user reference
          this.filteredByRef.some((item: Product) => item.id === product.id),
        );
        this.filterByStock(); // Filter by product stock
      });

    // Search for products by reference
    this.searchByRefSubject
      .pipe(
        map((reference: string) => {
          const REFERENCE = reference.toLocaleUpperCase();
          return this.products.filter((user: Product) => user.reference.indexOf(REFERENCE) === 0);
        }),
      )
      .subscribe((res: Product[]) => {
        this.filteredByRef = res;
        this.filteredText = res.filter((user: Product) =>
          // Filter by user email
          this.filteredByName.some((item: Product) => item.id === user.id),
        );
        this.filterByStock(); // Filter by product stock
      });
  }

  // Load and filter //////////////////////////////////////////////////////////

  // Retrieve all products
  load() {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res; // All products
        this.filteredByName = res;
        this.filteredByRef = res;
        this.filteredText = res;
        this.filteredItems = res;
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Filter by product stock
  filterByStock() {
    if (this.selectedStock === -1) {
      this.filteredItems = this.filteredText;
    } else if (this.selectedStock >= 0) {
      this.filteredItems = this.filteredText.filter(
        (product: Product) => product.stock !== undefined && product.stock <= this.selectedStock,
      );
    } else {
      this.filteredItems = this.filteredText.filter(
        (product: Product) => product.stock !== undefined && product.stock > -this.selectedStock,
      );
    }
  }

  // Search ///////////////////////////////////////////////////////////////////

  // Search for users by reference
  searchRefItems(reference: string) {
    this.searchByRefSubject.next(reference);
  }

  // Search for products by name
  searchNameItems(name: string) {
    this.searchByNameSubject.next(name);
  }

  // Search for users by role
  selectStockItems(select: any) {
    this.selectedStock = Number(select.options[select.selectedIndex].value);
    this.filterByStock();
  }

  // Actions /////////////////////////////////////////////////////////////

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
          this.products = this.products.filter((item: Product) => item.id !== id);
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la suppression.");
          console.log(err);
        },
      });
    }
  }
}
