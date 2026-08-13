export class Common {
  // Returns an 11-character alphanumeric identifier
  static getID() {
    let ID = '';
    const ARRAY = [0, 0, 0, 0];
    for (let i = 0; i < 2; i++) {
      const UINT8_ARRAY = ARRAY.map(
        (item: number) => item + (Math.floor(10000 * Math.random()) % 256),
      );
      ID += btoa(String.fromCharCode(...UINT8_ARRAY)).slice(0, -2);
    }
    return ID.slice(0, -1)
      .replace(/\+/g, String.fromCharCode(65 + Math.floor(26 * Math.random())))
      .replace(/\//g, String.fromCharCode(97 + Math.floor(26 * Math.random())));
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
