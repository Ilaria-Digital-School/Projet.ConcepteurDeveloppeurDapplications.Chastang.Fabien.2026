// Static class grouping general purpose functionalities

import { jwtDecode } from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';
import { TokenPayload } from '../models/user';

// HTTP headers for transmitting the token: using an HttpOnly, Secure,
// and SameSite=Strict cookie is a much better practice
export type HTTPHeaders = { headers: HttpHeaders } | undefined;

export class Common {
  // Pseudorandom string generation function //////////////////////////////////

  // Returns a random string of characters
  // 'type' parameter:
  //    1 == Uppercase letters only
  //    2 == Lowercase letters only
  //    3 == Letters only
  //    4 == Digits only
  //    5 == Alphanumeric characters only (no underscores)
  //    0 == Printable ASCII characters (character codes 33–126)
  //
  static randomString(length: number, type: number = 5, additionalChars: string[] = []): string {
    const randChar = (start: number, interval: number) =>
      String.fromCharCode(start + Math.floor(interval * Math.random()));

    let interval!: number;
    let func: () => string;

    switch (type) {
      case 1:
        // Uppercase letters only
        interval = 26;
        func = () => randChar(65, 26);
        break;
      case 2:
        // Lowercase letters only
        interval = 26;
        func = () => randChar(97, 26);
        break;
      case 3:
        // Letters only
        interval = 52;
        func = () => {
          let choice = Math.floor(2 * Math.random());
          return choice === 0 ? randChar(65, 26) : randChar(97, 26);
        };
        break;
      case 4:
        // Digits only
        interval = 10;
        func = () => randChar(48, 10);
        break;
      case 5:
        // Alphanumeric characters only (no underscores)
        interval = 62;
        func = () => {
          let choice = Math.floor(62 * Math.random());
          if (choice < 26) {
            return randChar(65, 26); // Uppercase letter
          } else if (choice < 52) {
            return randChar(97, 26); // Lowercase letter
          } else {
            return randChar(48, 10); // Digit
          }
        };
        break;
      default:
        // Printable ASCII characters (character codes 33–126)
        interval = 94;
        func = () => randChar(33, 94);
    }

    let randStr = '';
    let addChrLen = additionalChars.length;

    if (addChrLen > 0) {
      for (let i = 0; i < length; i++) {
        let choice = Math.floor((interval + addChrLen) * Math.random());
        if (choice < interval) {
          randStr += func();
        } else {
          let rank = Math.floor(addChrLen * Math.random());
          randStr += additionalChars[rank];
        }
      }
    } else {
      for (let i = 0; i < length; i++) randStr += func();
    }

    return randStr;
  }

  // Returns a 10-character alphanumeric identifier ///////////////////////////

  static getID(): string {
    return this.randomString(10);
  }

  // Functions returning 'Product', 'User' and 'Order' references /////////////

  static digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  // Returns the reference of a product
  static getProductRef(): string {
    let reference = '';
    for (let i = 0; i < 2; i++) reference += this.randomString(6, 1, this.digits) + '-';
    return reference.slice(0, -1);
  }

  // Returns the reference of a product
  static getUserRef(): string {
    return this.randomString(10, 1, this.digits);
  }

  // Returns the reference of an order
  static getOrderRef(): string {
    let reference = '';
    for (let i = 0; i < 5; i++) reference += this.randomString(4, 1, this.digits) + '-';
    return reference.slice(0, -1);
  }

  // Conversion functions /////////////////////////////////////////////////////

  // Round to two decimal places
  static round(value: number | string): number {
    const VALUE = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(VALUE)) {
      const POWER10 = 10 ** 2;
      return Math.round(POWER10 * VALUE) / POWER10;
    } else {
      return NaN;
    }
  }

  // Converts a string to a number by using the current or specified locale settings
  static stringToNumber(value: string, locale: string = 'fr-FR'): number {
    const FRAC_SEPARATOR = (1)
      .toLocaleString(locale, { minimumFractionDigits: 1 })
      .replace(/\d/g, '');
    return parseFloat(
      value
        .replace(new RegExp('[^\\d' + FRAC_SEPARATOR + '-]', 'g'), '')
        .replace(FRAC_SEPARATOR, '.'),
    );
  }

  // Converts a number to a string by using the current or specified locale settings
  static numberToString(value: number, locale: string = 'fr-FR', numberDigits: number = 2): string {
    const POWER10 = 10 ** numberDigits;
    const VALUE = Math.round(value * POWER10) / POWER10;
    return VALUE.toLocaleString(locale, { minimumFractionDigits: numberDigits });
  }

  // Retrieve the timestamp from a date
  static timestamp(date: string | number | Date | undefined): number {
    return date === undefined ? 0 : new Date(date).valueOf();
  }

  // Token management /////////////////////////////////////////////////////////

  // Decode the token
  static decodeToken(token: string): TokenPayload | null {
    const DECODED = jwtDecode(token);
    if (DECODED) {
      const TOKEN_PAYLOAD = new TokenPayload();
      Object.assign(TOKEN_PAYLOAD, DECODED);
      return TOKEN_PAYLOAD;
    }
    return null;
  }

  // Instantiate the HTTP headers with the token
  // Using an HttpOnly, Secure, and SameSite=Strict cookie is a much better practice
  static getHttpHeaders(): HTTPHeaders {
    const TOKEN = sessionStorage.getItem('token') || localStorage.getItem('token');

    if (TOKEN) {
      const HTTP_HEADERS = new HttpHeaders({
        Authorization: `Bearer ${TOKEN}`,
      });
      return { headers: HTTP_HEADERS };
    }
    return;
  }
}
