import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../../main';

@Component({
  selector: 'app-products-table',
  imports: [],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css',
})
export class ProductsTable {
  private router = inject(Router);
  private productService = inject(ProductService);

  products!: Product[];

  load(): void {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.map((item: any) => {
          const PRODUCT = new Product();
          Object.assign(PRODUCT, item);
          return PRODUCT;
        });
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  ngOnInit(): void {
    this.load();
  }

  view(id: string): void {
    this.router.navigate(['/product-view', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/product-edit', id]);
  }

  remove(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      // Remove the product
      this.productService.deleteProduct(id).subscribe({
        next: (res: Object) => {
          this.load();
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la suppression.");
          console.log(err);
        },
      });
    }
  }
}
