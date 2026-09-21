export class Resources {
  // Base URL for resources: protocol://subdomain.domain.tld:port
  static baseURL: string = 'http://localhost:3000/api';

  // Resources
  static categories: string = 'categories';
  static countries: string = 'countries';
  static genders: string = 'genders';
  static interests: string = 'interests';
  static messages: string = 'messages';
  static orders: string = 'orders';
  static products: string = 'products';
  static roles: string = 'roles';
  static status: string = 'status';
  static users: string = 'users';

  // Getters returning resource URLs
  static get categoriesURL(): string {
    return `${this.baseURL}/${this.categories}`;
  }
  static get countriesURL(): string {
    return `${this.baseURL}/${this.countries}`;
  }
  static get gendersURL(): string {
    return `${this.baseURL}/${this.genders}`;
  }
  static get interestsURL(): string {
    return `${this.baseURL}/${this.interests}`;
  }
  static get messagesURL(): string {
    return `${this.baseURL}/${this.messages}`;
  }
  static get ordersURL(): string {
    return `${this.baseURL}/${this.orders}`;
  }
  static get productsURL(): string {
    return `${this.baseURL}/${this.products}`;
  }
  static get rolesURL(): string {
    return `${this.baseURL}/${this.roles}`;
  }
  static get statusURL(): string {
    return `${this.baseURL}/${this.status}`;
  }
  static get usersURL(): string {
    return `${this.baseURL}/${this.users}`;
  }
}
