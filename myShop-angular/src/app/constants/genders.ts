import { EnumGenders } from '../enums/user-genders';

// User's gender class
export class Genders {
  static other = { value: EnumGenders.other, id: 'other', label: '– Indéfini –' };
  static list = [
    { value: EnumGenders.female, id: 'female', label: 'Femme' },
    { value: EnumGenders.male, id: 'male', label: 'Homme' },
    this.other,
  ];

  // Get the ID from the name and the name from the ID
  static getId(genderName: string): number {
    const NAME = genderName.trim().toLowerCase();
    const GENDER = this.list.find((item: any) => item.label.toLowerCase() === NAME);
    return GENDER ? GENDER.value : this.other.value;
  }
  static getName(genderId: number, other: string | undefined = undefined): string {
    const GENDER = this.list.find((item: any) => item.value === genderId);
    return GENDER === undefined ? (other === undefined ? this.other.label : other) : GENDER.label;
  }
}
