// Enumeration of user genders
export class UserGender {
  static other: number = 0;
  static female: number = 1;
  static male: number = 2;

  static list: number[] = [this.female, this.male, this.other];
}
