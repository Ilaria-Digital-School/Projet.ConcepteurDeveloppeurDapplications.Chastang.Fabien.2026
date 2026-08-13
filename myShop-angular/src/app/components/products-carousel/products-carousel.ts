import {
  Component,
  inject,
  ViewChildren,
  QueryList,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart-service';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-products-carousel',
  imports: [ProductCard],
  templateUrl: './products-carousel.html',
  styleUrl: './products-carousel.css',
})
export class ProductsCarousel {
  @ViewChildren('productCarousel') productsCarousel!: QueryList<ElementRef>;
  @ViewChildren('productCard') productsCard!: QueryList<ElementRef>;

  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  // Initialization //////////////////////////////////////////////////////

  products: Product[] = [];
  productId!: string | null;

  // Initialization: retrieving the products and the product specified by the ID passed in the URL
  ngOnInit() {
    // Get the product ID
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');

    // Retrieve all products
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

  // Handle the slide change and show the active product card
  @HostListener('slid.bs.carousel', ['$event'])
  onSlid(event: any) {
    // Retrieve the active product ID
    const ID = this.productsCarousel.find((item: ElementRef<HTMLDivElement>) =>
      item.nativeElement.className.includes('active'),
    )?.nativeElement.id;

    if (ID) {
      // Hide the previous active product card
      this.productsCard
        .find((item: ElementRef<HTMLDivElement>) => item.nativeElement.className.includes('active'))
        ?.nativeElement.classList.remove('active');

      // Show the current active product card
      this.productsCard
        .find((item: ElementRef<HTMLDivElement>) => item.nativeElement.id === `card_${ID}`)
        ?.nativeElement.classList.add('active');
    }
  }

  // Used to activate the first product
  isActive(id: string, index: number) {
    return (
      (this.productId !== null && id === this.productId) || (this.productId === null && index === 0)
    );
  }

  // View a product
  view(id: string) {
    this.router.navigate(['/product-details', id]);
  }

  // Add the product to the user's cart
  addCart(product: Product) {
    this.cartService.add(product);
  }

  // Remove the product from the user's cart
  removeCart(product: Product) {
    this.cartService.remove(product);
  }
}
