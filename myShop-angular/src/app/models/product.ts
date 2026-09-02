import { Common } from '../constants/common';

// Object structuring the full description of a product
export type FullDesc = { title: string | undefined; description: Array<string> };

// Product class
export class Product {
  id: string = '';
  reference: string = Common.getProductRef();
  dateIns: number = Date.now(); // Insertion date
  dateMod: number | null = null; // Modification date
  name: string = '';
  description: string = '';
  price: number = 0;
  img: string = '';
  types: number[] = [];
  categories: number[] = [];
  fullDescription: string = '';
  stock: number = 0;
  info: string = '';
  favorite: boolean = false;
  visible: boolean = true;

  // Temporary properties, not saved
  quantity: number | undefined = 0;
  additional: any = {}; // For additional properties (RxJS) while preserving the 'Product' type

  constructor(
    dateIns: number | null = null,
    dateMod: number | null = null,
    name: string | null = null,
    description: string | null = null,
    price: number | null = null,
    img: string | null = null,
    types: number[] | null = null,
    categories: number[] | null = null,
    fullDescription: string | null = null,
    stock: number | null = null,
    info: string | null = null,
    favorite: boolean | null = null,
  ) {
    if (typeof dateIns === 'number') this.dateIns = dateIns;
    if (typeof dateMod === 'number') this.dateMod = dateMod;
    if (typeof name === 'string') this.name = name;
    if (typeof description === 'string') this.description = description;
    if (typeof price === 'number') this.price = price;
    if (typeof img === 'string') this.img = img;
    if (Array.isArray(types)) this.types = types;
    if (Array.isArray(categories)) this.categories = categories;
    if (typeof fullDescription === 'string') this.fullDescription = fullDescription;
    if (typeof stock === 'number') this.stock = stock;
    if (typeof info === 'string') this.info = info;
    if (typeof favorite === 'boolean') this.favorite = favorite;
  }

  // Remove these properties before saving the product
  removeBeforeSaveProduct(): Product {
    const PRODUCT = new Product();
    Object.assign(PRODUCT, this);
    delete PRODUCT.quantity;
    delete PRODUCT.additional;
    return PRODUCT;
  }
}
