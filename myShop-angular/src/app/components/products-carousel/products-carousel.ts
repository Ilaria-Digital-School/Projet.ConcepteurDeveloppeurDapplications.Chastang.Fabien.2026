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
  endSlid: boolean = false;

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

  ngAfterViewInit() {
    this.intervalId = setInterval(() => {
      if (this.productsCard) {
        this.clearInterval();
        this.changeDetectorRef.detectChanges(); // Force a check
      }
    }, 10);
  }

  // Handle the slide change /////////////////////////////////////////////

  @HostListener('slid.bs.carousel', ['$event'])
  onSlid(event: Event) {
    if (this.intervalId) this.endSlid = true;
  }

  prev() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        if (this.endSlid) {
          this.clearInterval();
          this.prevIndex = this.activeIndex;
          this.activeIndex = (this.activeIndex - 1 + this.products.length) % this.products.length;
          this.display();
        }
      }, 100);
    }
  }

  next() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        if (this.endSlid) {
          this.clearInterval();
          this.prevIndex = this.activeIndex;
          this.activeIndex = (this.activeIndex + 1) % this.products.length;
          this.display();
        }
      }, 100);
    }
  }

  display() {
    this.productsCard.get(this.prevIndex)?.nativeElement.classList.add('inactive');
    this.productsCard.get(this.activeIndex)?.nativeElement.classList.remove('inactive');
  }

  clearInterval() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
    this.endSlid = false; // Used to handle the slide change
  }

  // To add the product to the cart //////////////////////////////////////

  add(product: Product) {
    this.cartService.add(product);
  }
}
