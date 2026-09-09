import { Product } from './product';

// Class used by the 'Cart' and 'Order' classes
export class OrderProduct {
  _id: string = '';
  price: number = 0;
  quantity: number = 0;

  constructor(product: Product | null = null) {
    if (product !== null) {
      this._id = product._id;
      this.price = product.price;
      this.quantity = typeof product.quantity === 'number' ? product.quantity : 0;
    }
  }
}
