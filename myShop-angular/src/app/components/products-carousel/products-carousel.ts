import {
  Component,
  inject,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../main';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-products-carousel',
  imports: [ProductCard],
  templateUrl: './products-carousel.html',
  styleUrl: './products-carousel.css',
})
export class ProductsCarousel implements AfterViewInit {
  @ViewChildren('productCarousel') productsCarousel!: QueryList<ElementRef>;
  @ViewChildren('productCard') productsCard!: QueryList<ElementRef>;

  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Initialization //////////////////////////////////////////////////////

  products: Product[] = [];
  productId!: string | null;
  intervalId: number = 0;

  // Initialization: retrieving the products and the product specified by the ID passed in the URL
  ngOnInit() {
    // Get the product ID
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');

    // Retrieve all products
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = structuredClone(res);
        this.changeDetectorRef.detectChanges(); // Asynchrone process: force a check
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Initializing the carousel and card QueryList<ElementRef>
  ngAfterViewInit() {
    this.intervalId = setInterval(() => {
      if (this.productsCarousel && this.productsCard) {
        clearInterval(this.intervalId);
        this.changeDetectorRef.detectChanges(); // Asynchrone process: force a check
      }
    }, 10);
  }

  // Handle the slide change and show the active product card
  @HostListener('slid.bs.carousel', ['$event'])
  onSlid(event: any) {
    // Retrieve the active product ID
    const ID: string | undefined = this.productsCarousel.find((item: ElementRef<HTMLDivElement>) =>
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

  // Add the product to the user's cart
  addCart(product: Product) {
    this.cartService.add(product);
  }

  // Remove the product from the user's cart
  removeCart(product: Product) {
    this.cartService.remove(product);
  }
}
