import { SortArrays, SortElement, SortVariables } from './types';

export class Common {
  // Pseudorandom string generation functions /////////////////////////////////

  // Returns a random string of characters
  // 'type' parameter:
  //    1 == Uppercase letters only
  //    2 == Lowercase letters only
  //    3 == Letters only
  //    4 == Digits only
  //    5 == Alphanumeric characters only (no underscores)
  //    0 == Printable ASCII characters (character codes 33–126)
  //
  static randomString(length: number, type: number = 5, additionalChars: string[] = []) {
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

  // Returns an 10-character alphanumeric identifier
  static getID() {
    return this.randomString(10);
  }

  // Returns the reference of a product
  static getProductRef() {
    const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let reference = '';
    for (let i = 0; i < 2; i++) reference += this.randomString(6, 1, DIGITS) + '-';
    return reference.slice(0, -1);
  }

  // Returns the reference of a product
  static getUserRef() {
    const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return this.randomString(10, 1, DIGITS);
  }

  // Returns the reference of an order
  static getOrderRef() {
    const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let reference = '';
    for (let i = 0; i < 5; i++) reference += this.randomString(4, 1, DIGITS) + '-';
    return reference.slice(0, -1);
  }

  // String-to-number and number-to-string conversion functions ///////////////

  // Converts a string to a number by using the current or specified locale settings
  static stringToNumber(value: string, locale: string = 'fr-FR') {
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
  static numberToString(value: number, locale: string = 'fr-FR', numberDigits: number = 2) {
    const POWER10 = 10 ** numberDigits;
    const VALUE = Math.round(value * POWER10) / POWER10;
    return VALUE.toLocaleString(locale, { minimumFractionDigits: numberDigits });
  }

  // Sorting functions ////////////////////////////////////////////////////////
  // Used by 'TableUsers', 'TableProducts' and 'TableOrders' component

  private static handleArrow(HTMLCol: HTMLElement, up: boolean) {
    if (up) {
      HTMLCol.classList.replace('fa-caret-down', 'fa-caret-up');
    } else {
      HTMLCol.classList.replace('fa-caret-up', 'fa-caret-down');
    }
  }

  static sort(
    arrays: SortArrays,
    sortElements: SortElement[],
    sortVariables: SortVariables[],
    column: string,
  ) {
    const SORT = sortVariables.find((item: SortVariables) => item.sort);
    if (SORT !== undefined) {
      for (const ITEM of sortElements)
        if (ITEM.col === column) {
          if (SORT.col === column) {
            // The column has not changed, only the sort order is reversed
            SORT.up = !SORT.up;

            // Sort all arrays
            for (let array of arrays) array = ITEM.func(array, SORT.up);

            // Reverse the arrow
            this.handleArrow(ITEM.HTMLCol, SORT.up);
          } else {
            // Initialize the new sort when the column has changed
            const TO_SORT = sortVariables.find((item: SortVariables) => item.col === column);
            if (TO_SORT) {
              TO_SORT.sort = true;
              TO_SORT.up = ITEM.up;
            }

            // Sort all arrays
            for (let array of arrays) array = ITEM.func(array, ITEM.up);

            // Hide the previous sort arrow
            SORT.sort = false;
            for (const ITEM2 of sortElements)
              if (ITEM2.col === SORT.col) {
                ITEM2.HTMLCol.classList.add('hidden');
                break;
              }

            // Show the new sort arrow
            ITEM.HTMLCol.classList.remove('hidden');
            this.handleArrow(ITEM.HTMLCol, ITEM.up);
          }
          break;
        }
    }
  }
}
