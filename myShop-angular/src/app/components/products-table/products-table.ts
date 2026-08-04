import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);

  products!: Product[];

  // Retrieve the products
  load(forceCheck: boolean = false): void {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.map((item: any) => {
          const PRODUCT = new Product();
          Object.assign(PRODUCT, item);
          return PRODUCT;
        });
        if (forceCheck) this.changeDetectorRef.detectChanges(); // Force a check
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Initialize the product list
  ngOnInit(): void {
    this.load(true);
  }

  // View a product
  view(id: string): void {
    this.router.navigate(['/product-view', id]);
  }

  // Edit a product
  edit(id: string): void {
    this.router.navigate(['/product-edit', id]);
  }

  // Delete a product
  remove(id: string): void {
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
