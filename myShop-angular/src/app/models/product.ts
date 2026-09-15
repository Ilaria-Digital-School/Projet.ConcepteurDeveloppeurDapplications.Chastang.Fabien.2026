import { Common } from '../constants/common';

// Object structuring the full description of a product
export type FullDesc = { title: string | undefined; description: Array<string> };

// Product class
export class Product {
  _id: string = '';
  reference: string = Common.getProductRef();
  dateIns: Date = new Date(Date.now()); // Insertion date
  dateMod: Date | null = null; // Modification date
  userId: string | undefined = '';
  name: string = '';
  description: string = '';
  price: number = 0;
  stock: number = 0;
  img: string = '';
  types: number[] = [];
  categories: number[] = [];
  fullDescription: string = '';
  info: string = '';
  favorite: boolean = false;
  dateVisible: Date | null = null; // Date on which the data was show or hidden
  visible: boolean = true;

  // Temporary properties, not saved
  quantity: number | undefined = 0;
  additional: any = {}; // For additional properties (RxJS) while preserving the 'Product' type

  constructor(
    dateIns: Date | null = null,
    dateMod: Date | null = null,
    userId: string | null = null,
    name: string | null = null,
    description: string | null = null,
    price: number | null = null,
    stock: number | null = null,
    img: string | null = null,
    types: number[] | null = null,
    categories: number[] | null = null,
    fullDescription: string | null = null,
    info: string | null = null,
    favorite: boolean | null = null,
  ) {
    if (dateIns instanceof Date) this.dateIns = dateIns;
    if (dateMod instanceof Date) this.dateMod = dateMod;
    if (typeof userId === 'string') this.userId = userId;
    if (typeof name === 'string') this.name = name;
    if (typeof description === 'string') this.description = description;
    if (typeof price === 'number') this.price = price;
    if (typeof stock === 'number') this.stock = stock;
    if (typeof img === 'string') this.img = img;
    if (Array.isArray(types)) this.types = types;
    if (Array.isArray(categories)) this.categories = categories;
    if (typeof fullDescription === 'string') this.fullDescription = fullDescription;
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
