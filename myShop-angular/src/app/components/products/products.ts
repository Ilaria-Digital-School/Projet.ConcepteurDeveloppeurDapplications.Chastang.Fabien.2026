import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../../main';
import { ProductService } from '../../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);

  searchFn!: number;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchSubject: Subject<string> = new Subject<string>();

  // Initialize the product list
  ngOnInit(): void {
    this.searchFn = Number(this.activatedRoute.snapshot.paramMap.get('search'));

    // Retrieve all products
    this.load(true);

    if (this.searchFn === 1) {
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
  }

  // Retrieve all products
  load(forceCheck: boolean = false): void {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = structuredClone(res);
        this.filteredProducts = structuredClone(res);
        if (forceCheck) this.changeDetectorRef.detectChanges(); // Force a check
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
  view(id: string): void {
    this.router.navigate(['/product-view', id]);
  }
}
