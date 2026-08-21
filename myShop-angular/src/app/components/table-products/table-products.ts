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
  @ViewChild('search') search!: ElementRef<HTMLInputElement>;

  // Constants
  public Common = Common;

  // Native classes / Application services
  private router = inject(Router);
  private productService = inject(ProductService);

  // User messages
  private static msgDelProduct: string = 'Êtes-vous sûr de vouloir supprimer cet article ?';

  // Class properties
  products: Product[] = [];
  filteredItems: Product[] = [];
  searchSubject: Subject<string> = new Subject<string>();

  // Initialization //////////////////////////////////////////////////////

  ngOnInit() {
    // Initialize the product list
    this.load();

    // Search for products by name
    this.searchSubject
      .pipe(
        map((name: string) => {
          const NAME = name.toLocaleLowerCase();
          return this.products.filter((product: Product) => {
            return product.name.toLowerCase().indexOf(NAME) === 0;
          });
        }),
      )
      .subscribe((res: Product[]) => {
        this.filteredItems = res;
      });
  }

  // Retrieve all products
  load() {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        this.filteredItems = res;
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Search for products by name
  searchItems(name: string) {
    this.searchSubject.next(name);
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
