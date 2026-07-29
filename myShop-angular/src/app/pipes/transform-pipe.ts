import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transform',
})
export class TransformPipe implements PipeTransform {
  transform(value: string, type: number = 0, replaceValue: string | null = null): string {
    switch (type) {
      case 1:
        // Replace vowels without native functions
        return this.charsetReplace(
          value,
          'aeiouyàâäéèêëîïôöùûü',
          replaceValue ? replaceValue : '*',
        );
      case 2:
        // Reverse a string
        return this.reverse(value);
      default:
        // Replace vowels with RegExp
        return value.replace(/[aeiouyàâäéèêëîïôöùûü]/gi, replaceValue ? replaceValue : '*');
    }
  }

  // Replace vowels without native functions /////////////////////////////
  isIncluded(chr: string, charset: string, ignoreCase: boolean = true): boolean {
    const fnTest = ignoreCase
      ? (c: string, chr: string) => c.toLowerCase() == chr.toLowerCase()
      : (c: string, chr: string) => c == chr;

    for (const C of charset) if (fnTest(C, chr)) return true;
    return false;
  }

  charsetReplace(
    searchIn: string,
    charset: string,
    replaceValue: string,
    ignoreCase: boolean = true,
  ): string {
    let result = '';
    for (const C of searchIn) result += this.isIncluded(C, charset, ignoreCase) ? replaceValue : C;
    return result;
  }

  // Reverse a string ////////////////////////////////////////////////////
  reverse(value: string): string {
    let result = '';
    for (const C of value) result = C + result;
    return result;
  }
}
