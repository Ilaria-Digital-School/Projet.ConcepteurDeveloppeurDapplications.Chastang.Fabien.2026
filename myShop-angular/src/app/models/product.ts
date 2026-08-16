import { Common } from '../constants/common';

// Product class
export class Product {
  id: string = Common.getID();
  name: string = '';
  description: string = '';
  price: number = 0;
  stock: number = 0;
  img: string = '';
  fullDescription: string = '';
  info: string = '';
  favorite: boolean = false;
  visible: boolean = true;

  // Save only when ordering
  cartQuantity: number | undefined = 0;

  // Temporary properties, not saved
  additional: any = {}; // For additional properties (RxJS) while preserving the 'Product' type

  constructor(
    name: string | null = null,
    description: string | null = null,
    price: number | null = null,
    stock: number | null = null,
    img: string | null = null,
    fullDescription: string | null = null,
    info: string | null = null,
    favorite: boolean | null = null,
  ) {
    if (typeof name === 'string') this.name = name;
    if (typeof description === 'string') this.description = description;
    if (typeof price === 'number') this.price = price;
    if (typeof stock === 'number') this.stock = stock;
    if (typeof img === 'string') this.img = img;
    if (typeof fullDescription === 'string') this.fullDescription = fullDescription;
    if (typeof info === 'string') this.info = info;
    if (typeof favorite === 'boolean') this.favorite = favorite;
  }
}
