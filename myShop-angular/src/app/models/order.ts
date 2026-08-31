import { Common } from '../constants/common';
import { Cart } from './cart';
import { Product } from './product';
import { User } from './user';

export type OrderExt = { order: Order; user: User | undefined };

// Order class
export class Order {
  id: string = '';
  reference: string = Common.getOrderRef();
  date: number = Date.now();
  userId: string = '';
  products: Product[] = []; // List of products from the 'Cart' object, with their
  promoCode: string = ''; // prices at the time of the order and their quantities
  taxPercent: number = 0;
  promoPercent: number = 0;
  totalExcludingTax: number = 0;
  totalIncludingTax: number = 0;
  totalPromotion: number = 0;
  status: number = 0;

  // Temporary property, not saved
  additional: any = {}; // For additional properties (RxJS) while preserving the 'Order' type

  constructor(
    userId: string | null = null,
    products: Product[] | null = null,
    taxPercent: number | null = null,
    promoCode: string | null = null,
    promoPercent: number | null = null,
    totalExcludingTax: number | null = null,
    totalIncludingTax: number | null = null,
    totalPromotion: number | null = null,
    status: number | null = null,
  ) {
    if (typeof userId === 'string') this.userId = userId;
    if (Array.isArray(products)) this.products = products;
    if (typeof taxPercent === 'number') this.taxPercent = taxPercent;
    if (typeof promoCode === 'string') this.promoCode = promoCode;
    if (typeof promoPercent === 'number') this.promoPercent = promoPercent;
    if (typeof totalExcludingTax === 'number') this.totalExcludingTax = totalExcludingTax;
    if (typeof totalIncludingTax === 'number') this.totalIncludingTax = totalIncludingTax;
    if (typeof totalPromotion === 'number') this.totalPromotion = totalPromotion;
    if (typeof status === 'number') this.status = status;
  }

  // Rounded to two decimal places
  round(value: number) {
    const POWER10 = 10 ** 2;
    return Math.round(POWER10 * value) / POWER10;
  }

  // Initialize the object
  initialize(
    cart: Cart,
    taxPercent: number,
    promoCode: string | null = null,
    promoPercent: number | null = null,
  ) {
    this.userId = cart.userId;
    this.products = cart.products;
    this.taxPercent = taxPercent;

    // Calculate the total cart amount excluding tax
    this.totalExcludingTax = cart.getTotalExcludingTax();
    // Calculate the total cart amount including tax
    this.totalIncludingTax = (1 + this.taxPercent / 100) * this.totalExcludingTax;

    // Calculate the total amount after the promotion
    if (typeof promoCode === 'string') {
      this.promoCode = promoCode;

      if (typeof promoPercent === 'number') {
        this.promoPercent = promoPercent;
        this.totalPromotion = (1 - this.promoPercent / 100) * this.totalIncludingTax;
      }
    }

    // Rounded to two decimal places
    this.totalExcludingTax = this.round(this.totalExcludingTax);
    this.totalIncludingTax = this.round(this.totalIncludingTax);
    if (this.totalPromotion > 0) this.totalPromotion = this.round(this.totalPromotion);
  }

  // Retrieve the total invoiced price
  getTotalInvoiced() {
    return this.totalPromotion > 0 ? this.totalPromotion : this.totalIncludingTax;
  }

  // Update the status
  changeStatus(status: number) {
    this.status = status;
  }

  // Remove these properties before saving the order
  removeBeforeSaveOrder() {
    const ORDER = new Order();
    Object.assign(ORDER, this);
    delete ORDER.additional;
    ORDER.products = ORDER.products.map((product: Product) => product.removeBeforeSaveOrder());
    return ORDER;
  }
}
