import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-products-table',
  imports: [],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css',
})
export class ProductsTable {
  private router = inject(Router);
  private productService = inject(ProductService);

  products: Product[] = [];

  // Initialization //////////////////////////////////////////////////////

  // Initialize the product list
  ngOnInit() {
    this.load();
  }

  // Retrieve all products
  load() {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = structuredClone(res);
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Actions /////////////////////////////////////////////////////////////

  // View a product
  view(id: string) {
    this.router.navigate(['/product-details', id]);
  }

  // Edit a product
  edit(id: string) {
    this.router.navigate(['/edit-product', id]);
  }

  // Delete a product
  remove(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      // Remove the product
      this.productService.deleteProduct(id).subscribe({
        next: (res: Object) => {
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
