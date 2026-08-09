import { Component } from '@angular/core';
import { Product, UserCart } from '../../../main';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  tax: number = 1.2;
  userCart!: UserCart;
  productsIni!: Product[];

  ngOnInit() {
    const CART = localStorage.getItem('cart');
    if (CART) {
      const USER_CART = JSON.parse(CART).map((item: any) => {
        const PRODUCT = new Product();
        Object.assign(PRODUCT, item);
        return PRODUCT;
      });
      this.userCart = new UserCart(USER_CART);
      this.productsIni = structuredClone(this.userCart.products);
    }
  }

  changeQuantity(product: Product, quantity: number) {
    const QUANTITY = product.cartQuantity ? Math.round(product.cartQuantity) : 0;
    if (QUANTITY <= 0 || QUANTITY > 99) {
      product.cartQuantity = QUANTITY <= 0 ? quantity : 99;
      alert('La quantité doit être un nombre entier positif inférieur à 100 !');
    }
  }

  getTotal() {
    return this.userCart.products.reduce((total: number, product: Product) => {
      return total + product.cartQuantity * product.price;
    }, 0);
  }

  getTotalTax() {
    return this.userCart.products.reduce((total: number, product: Product) => {
      return total + product.cartQuantity * product.price * this.tax;
    }, 0);
  }

  remove(id: string) {}

  removeCart() {}

  payCart() {}
}
