import { Common } from '../constants/common';
import { Product } from './product';

export class Order {
  id: string = Common.getID();
  date: number = Date.now();
  userId: string = '';
  products: Product[] = [];
  promoCode: string = '';
  totalExcludingTax: number = 0;
  totalIncludingTax: number = 0;

  // Temporary property, not saved
  additional: any = {}; // For additional properties (RxJS) while preserving the 'Order' type

  constructor(
    userId: string | null = null,
    products: Product[] | null = null,
    promoCode: string | null = null,
    totalExcludingTax: number | null = null,
    totalIncludingTax: number | null = null,
  ) {
    if (typeof userId === 'string') this.userId = userId;
    if (Array.isArray(products)) this.products = products;
    if (typeof promoCode === 'string') this.promoCode = promoCode;
    if (typeof totalExcludingTax === 'number') this.totalExcludingTax = totalExcludingTax;
    if (typeof totalIncludingTax === 'number') this.totalIncludingTax = totalIncludingTax;
  }
}
