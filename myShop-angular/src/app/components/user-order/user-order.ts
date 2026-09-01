import { DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Common } from '../../constants/common';
import { Product } from '../../models/product';
import { StatusList } from '../../models/status';
import { ProductService } from '../../services/product-service';
import { OrderProduct } from '../../models/order-product';
import { Order } from '../../models/order';

@Component({
  selector: 'app-user-order',
  imports: [DatePipe],
  templateUrl: './user-order.html',
  styleUrl: './user-order.css',
})
export class UserOrder {
  // Constants
  public Common = Common;

  // To retrieve data from another component
  @Input() order: any;

  // Native classes / Application services
  private productService = inject(ProductService);

  // Class properties
  objOrder: Order = new Order();
  products: Product[] | null = [];
  orderStatus: StatusList = new StatusList();

  // Load the order products
  ngOnInit() {
    Object.assign(this.objOrder, this.order);

    this.productService.getProductsByIDs(this.objOrder.getProductIDs()).subscribe({
      next: (res: Product[]) => {
        this.products = res
          .map((product: Product) => {
            const PRODUCT = this.order.products.find(
              (item: OrderProduct) => item.id === product.id,
            );
            if (PRODUCT) {
              // Initialize the price AND the quantity
              product.quantity = PRODUCT.price;
              product.quantity = PRODUCT.quantity;
            }
            return product;
          })
          .sort((p1: Product, p2: Product) => {
            const COMPARE = p1.name.localeCompare(p2.name);
            return COMPARE === 0 ? p1.description.localeCompare(p2.description) : COMPARE;
          });
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de la récupération des données.");
        console.log(err);
      },
    });
  }
}
