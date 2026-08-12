import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Product } from '../../../main';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../../services/product-service';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';

@Component({
  selector: 'app-products-search',
  imports: [ProductCard],
  templateUrl: './products-search.html',
  styleUrl: './products-search.css',
})
export class ProductsSearch {
  private router = inject(Router);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchSubject: Subject<string> = new Subject<string>();

  // Initialize the product list
  ngOnInit() {
    // Retrieve the products
    this.load(true);

    // Search for products by name
    this.searchSubject
      .pipe(
        map((name: string) => {
          const NAME = name.toLocaleLowerCase();
          return this.products.filter((product: Product) => {
            return product.name.toLowerCase().includes(NAME);
          });
        }),
      )
      .subscribe((res: Product[]) => {
        this.filteredProducts = structuredClone(res);
      });
  }

  // Retrieve the products
  load(forceCheck: boolean = false) {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = structuredClone(res);
        this.filteredProducts = structuredClone(res);
        if (forceCheck) this.changeDetectorRef.detectChanges(); // Asynchrone process: force a check
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Search for products by name
  search(name: string) {
    this.searchSubject.next(name);
  }

  // View a product
  view(id: string) {
    this.router.navigate(['/product-details', id]);
  }
}
