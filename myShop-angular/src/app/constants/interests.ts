import { EnumInterests } from '../enums/user-interests';

// User's interests class
export class Interests {
  static other = { value: EnumInterests.none, id: 'other', label: '– Autre –' };
  static list = [
    { value: EnumInterests.clothes, id: 'clothes', label: 'Vêtements' },
    { value: EnumInterests.accessories, id: 'accessories', label: 'Accessoires' },
  ];

  // Get the ID from the name and the name from the ID
  static getId(interestName: string) {
    const NAME = interestName.trim().toLowerCase();
    const INTEREST = this.list.find((item: any) => item.label.toLowerCase() === NAME);
    return INTEREST ? INTEREST.value : this.other.value;
  }
  static getName(interestId: number) {
    const INTEREST = this.list.find((item: any) => item.value === interestId);
    return INTEREST ? INTEREST.label : this.other.label;
  }
}
