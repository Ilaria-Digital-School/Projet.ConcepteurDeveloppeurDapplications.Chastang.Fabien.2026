import { Common } from '../constants/common';
import { OrderProduct } from './order-product';
import { Cart } from './cart';
import { User } from './user';

// Type used by the dashboard order list
export type OrderExt = { order: Order; user: User | undefined };

// Order class
export class Order {
  // Class properties
  id: string = '';
  reference: string = Common.getOrderRef();
  dateIns: number = Date.now();
  dateMod: number | null = null;
  userId: string = '';
  products: OrderProduct[] = [];
  promoCode: string = '';
  taxPercent: number = 0;
  promoPercent: number = 0;
  status: number = 0;
  dateHidden: number | null = null; // Date on which the data was hidden
  visible: boolean = true;

  // Temporary property, not saved
  additional: any = {}; // For additional properties (RxJS) while preserving the 'Order' type

  constructor(
    dateIns: number | null = null,
    dateMod: number | null = null,
    userId: string | null = null,
    products: OrderProduct[] | null = null,
    taxPercent: number | null = null,
    promoCode: string | null = null,
    promoPercent: number | null = null,
    status: number | null = null,
  ) {
    if (typeof dateIns === 'number') this.dateIns = dateIns;
    if (typeof dateMod === 'number') this.dateMod = dateMod;
    if (typeof userId === 'string') this.userId = userId;
    if (Array.isArray(products)) this.products = products;
    if (typeof taxPercent === 'number') this.taxPercent = taxPercent;
    if (typeof promoCode === 'string') this.promoCode = promoCode;
    if (typeof promoPercent === 'number') this.promoPercent = promoPercent;
    if (typeof status === 'number') this.status = status;
  }

  // Rounded to two decimal places
  round(value: number): number {
    const POWER10 = 10 ** 2;
    return Math.round(POWER10 * value) / POWER10;
  }

  // Initialize the object, called when adding an order
  initialize(
    cart: Cart,
    taxPercent: number,
    promoCode: string | null = null,
    promoPercent: number | null = null,
  ) {
    this.userId = cart.userId;
    this.products = cart.products;
    this.taxPercent = taxPercent;

    if (typeof promoCode === 'string') {
      this.promoCode = promoCode;
      if (typeof promoPercent === 'number') this.promoPercent = promoPercent;
    }
  }

  // Returns the list of product IDs for the order
  getProductIDs(): string[] {
    return this.products.map((product: OrderProduct) => product.id);
  }

  // Returns the total excluding tax
  getTotalExcludingTax(): number {
    const getTotal = (total: number, product: OrderProduct) => {
      return total + product.quantity * product.price;
    };
    return this.products.reduce(getTotal, 0);
  }

  // Returns the total including tax
  getTotalIncludingTax(): number {
    return (1 + this.taxPercent / 100) * this.getTotalExcludingTax();
  }

  // Returns the total including the promotion
  getTotalPromotion(): number {
    return (1 - this.promoPercent / 100) * this.getTotalIncludingTax();
  }

  // Retrieve the total invoiced price
  getTotalInvoiced(): number {
    return this.promoPercent > 0 ? this.getTotalPromotion() : this.getTotalIncludingTax();
  }

  // Update the status
  changeStatus(status: number) {
    this.status = status;
  }

  // Remove these properties before saving the order
  removeBeforeSaveOrder(): Order {
    const ORDER = new Order();
    Object.assign(ORDER, this);
    delete ORDER.additional;
    return ORDER;
  }
}
