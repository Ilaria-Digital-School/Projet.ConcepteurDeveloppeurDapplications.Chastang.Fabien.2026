export class Genders {
  fieldName = 'gender';

  other = { value: 0, id: 'other', label: 'Je le garde pour moi' };
  list = [
    { value: 1, id: 'female', label: 'Femme' },
    { value: 2, id: 'male', label: 'Homme' },
    this.other,
  ];

  // Get the ID from the name and the name from the ID
  getId(genderName: string) {
    const GENDER = this.list.find((item) => item.label.toLowerCase() == genderName);
    return GENDER ? GENDER.value : this.other.value;
  }
  getName(genderId: number) {
    const GENDER = this.list.find((item) => item.value == genderId);
    return GENDER ? GENDER.label : '';
  }
}
