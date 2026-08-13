import { UserGender } from '../enums/user-gender';

// User's gender class
export class Genders {
  static other = { value: UserGender.other, id: 'other', label: '– Indéfini –' };
  static list = [
    { value: UserGender.female, id: 'female', label: 'Femme' },
    { value: UserGender.male, id: 'male', label: 'Homme' },
    this.other,
  ];

  // Get the ID from the name and the name from the ID
  static getId(genderName: string) {
    const NAME = genderName.trim().toLowerCase();
    const GENDER = this.list.find((item: any) => item.label.toLowerCase() === NAME);
    return GENDER ? GENDER.value : this.other.value;
  }
  static getName(genderId: number) {
    const GENDER = this.list.find((item: any) => item.value === genderId);
    return GENDER ? GENDER.label : this.other.label;
  }
}
