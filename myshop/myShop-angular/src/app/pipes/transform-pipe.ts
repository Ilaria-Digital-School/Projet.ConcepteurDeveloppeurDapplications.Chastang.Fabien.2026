import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transform',
})
export class TransformPipe implements PipeTransform {
  transform(
    value: string,
    type: number = 0,
    replaceValue: string = '*',
    charset: string = 'aeiouyàâäéèêëîïôöùûü', // Vowels
    ignoreCase: boolean = true,
  ): string {
    if (type === 1) {
      // Replace vowels without native functions
      return this.charsetReplace(value, charset, replaceValue, ignoreCase);
    } else {
      // Replace vowels with RegExp
      const RE = new RegExp(charset, ignoreCase ? 'gi' : 'g');
      return value.replace(RE, replaceValue);
    }
  }

  // Replace vowels without native functions
  isIncluded(chr: string, charset: string): boolean {
    for (const C of charset) if (C === chr) return true;
    return false;
  }

  charsetReplace(
    searchIn: string,
    charset: string,
    replaceValue: string,
    ignoreCase: boolean,
  ): string {
    let _searchIn, _charset;
    if (ignoreCase) {
      _searchIn = searchIn.toLowerCase();
      _charset = charset.toLowerCase();
    } else {
      _searchIn = searchIn;
      _charset = charset;
    }

    let result = '';
    for (const C of _searchIn) result += this.isIncluded(C, _charset) ? replaceValue : C;
    return result;
  }
}
