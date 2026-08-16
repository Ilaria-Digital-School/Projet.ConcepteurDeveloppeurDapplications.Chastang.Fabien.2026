import { Common } from '../constants/common';

// Product class
export class Contact {
  id: string = Common.getID();
  name: string = '';
  email: string = '';
  message: string = '';

  // Temporary properties, not saved
  additional: any = {}; // For additional properties (RxJS)

  constructor(
    name: string | null = null,
    email: string | null = null,
    message: string | null = null,
  ) {
    if (typeof name === 'string') this.name = name;
    if (typeof email === 'string') this.email = email;
    if (typeof message === 'string') this.message = message;
  }
}
