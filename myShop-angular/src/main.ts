import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// Product class /////////////////////////////////////////////////////////

export class Product {
  id: string = Date.now().toString();
  name: string = '';
  description: string = '';
  price: number = 0;
  img: string = '';
  stock: number = 0;
  info: string = '';
  visible: boolean = true;

  // For additional properties (RxJS)
  additional:any = {};

  constructor(
    name: string | null = null,
    description: string | null = null,
    price: number | null = null,
    img: string | null = null,
    stock: number | null = null,
    info: string | null = null,
  ) {
    if (typeof name === 'string') this.name = name;
    if (typeof description === 'string') this.description = description;
    if (typeof price === 'number') this.price = price;
    if (typeof img === 'string') this.img = img;
    if (typeof stock === 'number') this.stock = stock;
    if (typeof info === 'string') this.info = info;
  }
}

// User class ////////////////////////////////////////////////////////////

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

export class User {
  id: string = Date.now().toString();
  name: string = '';
  email: string = '';
  pswd: string = '';
  gender: number = 0;
  interests: number[] = [];
  country: number = 0;
  role: number = UserRole.user;
  visible: boolean = true;

  // For additional properties (RxJS)
  additional:any = {};

  constructor(
    name: string | null = null,
    email: string | null = null,
    pswd: string | null = null,
    gender: number | null = null,
    interests: number[] | null = null,
    country: number | null = null,
  ) {
    if (typeof name === 'string') this.name = name;
    if (typeof email === 'string') this.email = email;
    if (typeof pswd === 'string') this.pswd = pswd;
    if (typeof gender === 'number') {
      this.gender =
        gender === UserGender.female || gender === UserGender.male ? gender : UserGender.other;
    }
    if (Array.isArray(interests)) {
      this.interests = [UserInterest.clothes, UserInterest.accessories].filter((item: any) => {
        return interests.includes(item);
      });
    }
    if (typeof country === 'number') this.country = country;
  }
}

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

// Main class ////////////////////////////////////////////////////////////

export class Main {
  static checkPositiveNumber(
    value: string,
    isInt: boolean,
    maxValue: number = Number.MAX_SAFE_INTEGER,
    defaultValue: number = 0,
  ): string {
    value = value.replace(',', '.').replace(/[^\d.]/g, '');
    let nvalue;
    if (isInt) nvalue = parseInt(value);
    else {
      nvalue = parseFloat(value);
      nvalue = Math.round(100 * nvalue) / 100;
    }
    return nvalue > 0
      ? nvalue <= maxValue
        ? nvalue.toString()
        : maxValue.toString()
      : defaultValue
        ? defaultValue.toString()
        : '';
  }
}
