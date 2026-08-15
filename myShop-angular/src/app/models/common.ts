export class Common {
  // Returns an 11-character alphanumeric identifier
  static getID() {
    const LENGTH = 11;
    const randChar = (min: number, width: number) =>
      String.fromCharCode(min + Math.floor(width * Math.random()));

    let ID = '';
    for (let i = 0; i < LENGTH; i++) {
      const TYPE = Math.floor(62 * Math.random());
      if (TYPE < 26) {
        ID += randChar(65, 26); // Uppercase letter
      } else if (TYPE < 52) {
        ID += randChar(97, 26); // Lowercase letter
      } else {
        ID += randChar(48, 10); // Digit
      }
    }
    return ID;
  }

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
  static numberToString(value: number, locale: string = 'fr-FR', minFracDigits: number = 2) {
    return value.toLocaleString(locale, { minimumFractionDigits: minFracDigits });
  }
}
