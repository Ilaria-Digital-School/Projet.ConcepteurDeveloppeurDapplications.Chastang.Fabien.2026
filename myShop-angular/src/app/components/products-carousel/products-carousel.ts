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
  @ViewChildren('productCard') productsCard!: QueryList<ElementRef>;

  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Initialization //////////////////////////////////////////////////////

  products: Product[] = [];
  productId!: string | null;
  activeIndex!: number;
  prevIndex!: number;
  intervalId: number = 0;

  // Initialization: retrieving the products and the product specified by the ID passed in the URL
  ngOnInit() {
    // Get the product ID
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');

    // Retrieve all products
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = structuredClone(res);
        this.activeIndex = this.products.findIndex(
          (product: Product) => product.id === this.productId,
        );
        this.changeDetectorRef.detectChanges(); // Force a check
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }

  // Initializing the product card list
  ngAfterViewInit() {
    this.intervalId = setInterval(() => {
      if (this.productsCard) {
        clearInterval(this.intervalId);
        this.changeDetectorRef.detectChanges(); // Force a check
      }
    }, 10);
  }

  // Handle the slide change
  @HostListener('slid.bs.carousel', ['$event'])
  onSlid(event: any) {
    this.prevIndex = this.activeIndex;
    if (event.direction === 'left') {
      this.activeIndex = (this.activeIndex - 1 + this.products.length) % this.products.length;
    } else {
      this.activeIndex = (this.activeIndex + 1) % this.products.length;
    }
    this.productsCard.get(this.prevIndex)?.nativeElement.classList.add('inactive');
    this.productsCard.get(this.activeIndex)?.nativeElement.classList.remove('inactive');
  }

  // To add the product to the cart
  add(product: Product) {
    this.cartService.add(product);
  }
}
