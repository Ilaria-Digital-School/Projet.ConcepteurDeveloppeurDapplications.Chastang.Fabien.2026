import { Common } from '../constants/common';

// Product class
export class Product {
  id: string = '';
  reference: string = Common.getProductRef();
  name: string = '';
  description: string = '';
  price: number = 0;
  img: string = '';
  types: number[] = [];
  categories: number[] = [];
  fullDescription: string = '';

  // Remove when ordering
  stock: number | undefined = 0;
  info: string | undefined = '';
  favorite: boolean | undefined = false;
  visible: boolean | undefined = true;

  // Save only when ordering
  cartQuantity: number | undefined = 0;

  // Temporary properties, not saved
  additional: any = {}; // For additional properties (RxJS) while preserving the 'Product' type

  constructor(
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
    delete PRODUCT.cartQuantity;
    delete PRODUCT.additional;
    return PRODUCT;
  }

  // Remove these properties before saving the order
  removeBeforeSaveCart(): Product {
    const PRODUCT = this.removeBeforeSaveProduct();
    delete PRODUCT.stock;
    delete PRODUCT.info;
    delete PRODUCT.favorite;
    delete PRODUCT.visible;
    return PRODUCT;
  }
}
