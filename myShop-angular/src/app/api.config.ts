export class Resources {
  // Base URL for resources: protocol://subdomain.domain.tld:port
  static baseURL: string = 'http://localhost:3000';

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
  static get categoriesURL() {
    return `${this.baseURL}/${this.categories}`;
  }
  static get countriesURL() {
    return `${this.baseURL}/${this.countries}`;
  }
  static get gendersURL() {
    return `${this.baseURL}/${this.genders}`;
  }
  static get interestsURL() {
    return `${this.baseURL}/${this.interests}`;
  }
  static get messagesURL() {
    return `${this.baseURL}/${this.messages}`;
  }
  static get ordersURL() {
    return `${this.baseURL}/${this.orders}`;
  }
  static get productsURL() {
    return `${this.baseURL}/${this.products}`;
  }
  static get rolesURL() {
    return `${this.baseURL}/${this.roles}`;
  }
  static get statusURL() {
    return `${this.baseURL}/${this.status}`;
  }
  static get usersURL() {
    return `${this.baseURL}/${this.users}`;
  }
}
