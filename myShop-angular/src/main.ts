/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// Product class /////////////////////////////////////////////////////////

/*
  After JSON.parse(), 'fullDescription' has the following structure:
  [
    {
      title: "title 1",
      description: [
        "paragraph 1",
        "paragraph 2",
        ...
      ]
    },
    {
      title: "title 2",
      description: [
        "paragraph 1",
        "paragraph 2",
        ...
      ]
    },
    ...
  ]
*/

// Product class
export class Product {
  id: string = Date.now().toString();
  name: string = '';
  description: string = '';
  fullDescription: string = '';
  price: number = 0;
  img: string = '';
  stock: number = 0;
  info: string = '';
  favorite: boolean = false;
  cartQuantity: number = 0;
  visible: boolean = true;

  // For additional properties
  additional: any = {};

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

// User class ////////////////////////////////////////////////////////////

// Enumeration classes
export class UserRole {
  static user: number = 0;
  static admin: number = 1;
  static superAdmin: number = 2;
}
export class UserGender {
  static other: number = 0;
  static female: number = 1;
  static male: number = 2;
}
export class UserInterest {
  static none: number = 0;
  static clothes: number = 1;
  static accessories: number = 2;
}

// User's role class
export class Roles {
  static other = { value: UserRole.user, label: 'Utilisateur' };
  static list = [
    { value: UserRole.admin, label: 'Admin.' },
    { value: UserRole.superAdmin, label: 'Super Admin.' },
    this.other,
  ];

  // Get the ID from the name and the name from the ID
  static getId(roleName: string) {
    const ROLE = this.list.find((item: any) => item.label.toLowerCase() === roleName);
    return ROLE ? ROLE.value : this.other.value;
  }
  static getName(roleId: number) {
    const ROLE = this.list.find((item: any) => item.value === roleId);
    return ROLE ? ROLE.label : this.other.label;
  }
}

// User's gender class
export class Genders {
  static other = { value: UserGender.other, id: 'other', label: '– Indéfini –' };
  static list = [
    { value: UserGender.female, id: 'female', label: 'Femme' },
    { value: UserGender.male, id: 'male', label: 'Homme' },
    this.other,
  ];

  // Get the ID from the name and the name from the ID
  static getId(genderName: string) {
    const GENDER = this.list.find((item: any) => item.label.toLowerCase() === genderName);
    return GENDER ? GENDER.value : this.other.value;
  }
  static getName(genderId: number) {
    const GENDER = this.list.find((item: any) => item.value === genderId);
    return GENDER ? GENDER.label : this.other.label;
  }
}

// User's interests class
export class Interests {
  static other = { value: UserInterest.none, id: null, label: null };
  static list = [
    { value: UserInterest.clothes, id: 'clothes', label: 'Vêtements' },
    { value: UserInterest.accessories, id: 'accessories', label: 'Accessoires' },
  ];

  // Get the ID from the name and the name from the ID
  static getId(interestName: string) {
    const NAME = interestName.trim().toLowerCase();
    const INTEREST = this.list.find((item: any) => item.label.toLowerCase() === NAME);
    return INTEREST ? INTEREST.value : this.other.value;
  }
  static getName(interestId: number) {
    const INTEREST = this.list.find((item: any) => item.value === interestId);
    return INTEREST ? INTEREST.label : this.other.label;
  }
}

// User's country class
export class Countries {
  static other = { value: 0, label: '– Autre –' };
  static list = [
    { value: 1, label: 'Allemagne' },
    { value: 2, label: 'Autriche' },
    { value: 3, label: 'Belgique' },
    { value: 4, label: 'Brésil' },
    { value: 5, label: 'Canada' },
    { value: 6, label: 'Chine' },
    { value: 7, label: 'Espagne' },
    { value: 8, label: 'États-Unis' },
    { value: 9, label: 'France' },
    { value: 10, label: 'Grèce' },
    { value: 11, label: 'Inde' },
    { value: 12, label: 'Italie' },
    { value: 13, label: 'Japon' },
    { value: 14, label: 'Luxembourg' },
    { value: 15, label: 'Mauritanie' },
    { value: 16, label: 'Mexique' },
    { value: 17, label: 'Portugal' },
    { value: 18, label: 'Royaume-Uni' },
    { value: 19, label: 'Sénégal' },
    { value: 20, label: 'Suisse' },
    { value: 21, label: 'Taïwan' },
    { value: 22, label: 'Tunisie' },
    this.other,
  ];

  // Get the ID from the name and the name from the ID
  static etId(countryName: string) {
    const COUNTRY = this.list.find((item) => item.label.toLowerCase() === countryName);
    return COUNTRY ? COUNTRY.value : this.other.value;
  }
  static getName(countryId: number) {
    const COUNTRY = this.list.find((item) => item.value === countryId);
    return COUNTRY ? COUNTRY.label : this.other.label;
  }
}

// User class
export class User {
  id: string = Date.now().toString();
  name: string = '';
  email: string = '';
  pswd: string = '';
  gender: number = 0;
  interests: string = '';
  country: number = 0;
  role: number = UserRole.user;
  visible: boolean = true;

  // For additional properties (RxJS)
  additional: any = {};

  constructor(
    name: string | null = null,
    email: string | null = null,
    pswd: string | null = null,
    gender: number | null = null,
    interests: string | null = null,
    country: number | null = null,
  ) {
    if (typeof name === 'string') this.name = name;
    if (typeof email === 'string') this.email = email;
    if (typeof pswd === 'string') this.pswd = pswd;
    if (typeof gender === 'number') {
      this.gender =
        gender === UserGender.female || gender === UserGender.male ? gender : UserGender.other;
    }
    if (typeof interests === 'string') this.interests = interests;
    if (typeof country === 'number') this.country = country;
  }
}

// Cart class ////////////////////////////////////////////////////////////

// Cart class
export class Cart {
  id: string = Date.now().toString();
  userId: string = '';
  products: Product[] = [];

  constructor(products: Product[] | null = null, userId: string | null = null) {
    if (typeof userId === 'string') this.userId = userId;

    if (Array.isArray(products)) {
      products.forEach((product: Product) => {
        const PRODUCT = this.products.find((item: Product) => item.id === product.id);
        if (PRODUCT) PRODUCT.cartQuantity++;
        else this.products.push(product);
      });
    }
  }
}
