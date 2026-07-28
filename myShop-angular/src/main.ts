import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

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

  // BACKEND (normally): create an administrator account
  static addAdmin(name: string, email: string, pswd: string, role: number): boolean {
    // Check if the email does not exist
    const USERS = JSON.parse(localStorage.getItem('users') || '[]');
    if (USERS.some((user: any) => user.email == email)) {
      console.log('This email already exists!');
      return false;
    }

    const USER = {
      id: Date.now(),
      name: name,
      email: email,
      pswd: pswd,
      gender: 0,
      interests: [],
      country: 0,
      role: role,
      isVisible: true,
    };

    // Saving user data to local storage
    USERS.push(USER);
    localStorage.setItem('users', JSON.stringify(USERS));

    // Confirmation message
    console.log('The account has been created.');
    return true;
  }
}

Main.addAdmin('Fabien', 'admin.fabien@myshop.com', '3kb!BWFe;dgXqV]', 1);
