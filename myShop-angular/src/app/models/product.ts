import { Common } from './common';

// Product class
export class Product {
  id: string = Common.getID();
  name: string = '';
  description: string = '';
  fullDescription: string = '';
  price: number = 0;
  img: string = '';
  stock: number = 0;
  info: string = '';
  favorite: boolean = false;
  visible: boolean = true;

  // Temporary properties, not saved
  cartQuantity: any = 0;
  additional: any = {}; // For additional properties (RxJS)

  constructor(
    name: string | null = null,
    description: string | null = null,
    fullDescription: string | null = null,
    price: number | null = null,
    img: string | null = null,
    stock: number | null = null,
    info: string | null = null,
    favorite: boolean | null = null,
  ) {
    if (typeof name === 'string') this.name = name;
    if (typeof description === 'string') this.description = description;
    if (typeof fullDescription === 'string') this.fullDescription = fullDescription;
    if (typeof price === 'number') this.price = price;
    if (typeof img === 'string') this.img = img;
    if (typeof stock === 'number') this.stock = stock;
    if (typeof info === 'string') this.info = info;
    if (typeof favorite === 'boolean') this.favorite = favorite;
  }
}
